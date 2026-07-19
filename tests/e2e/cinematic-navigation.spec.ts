import { expect, test, type Locator, type Page } from '@playwright/test'
import { ENABLE_CINEMATIC_TRANSITIONS } from '../../src/features/navigation/transition-config'

async function openSettled(page: Page, scene: string): Promise<void> {
  await page.goto('/#about')
  await page.evaluate(() => {
    window.sessionStorage.setItem('gd-portfolio-opening-played', 'true')
  })
  await page.goto(`/?e2e=${scene}#${scene}`)
  await expect(page.locator('.app-shell')).toHaveAttribute(
    'data-opening',
    'false',
  )
}

async function curtainOwnsPoint(
  page: Page,
  x: number,
  y: number,
): Promise<boolean> {
  return page.evaluate(
    ({ pointX, pointY }) =>
      Boolean(
        document
          .elementFromPoint(pointX, pointY)
          ?.closest('[data-cinematic-curtain]'),
      ),
    { pointX: x, pointY: y },
  )
}

async function pauseCurtainAtMidpoint(curtain: Locator): Promise<void> {
  await curtain.evaluate(async (element) => {
    const animation = element.getAnimations()[0]
    const duration = animation?.effect?.getComputedTiming().duration
    if (!animation || typeof duration !== 'number') {
      throw new Error('Curtain animation was not available')
    }

    animation.pause()
    animation.currentTime = duration / 2
    await new Promise((resolve) => requestAnimationFrame(resolve))
  })
}

async function resumeCurtain(curtain: Locator): Promise<void> {
  await curtain.evaluate((element) => element.getAnimations()[0]?.play())
}

interface GameplaySample {
  elapsed: number
  centerX: number
  centerY: number
  angle: number
  trackLeft: number
  trackVisibility: string
}

async function collectGameplayFromActivation(
  page: Page,
): Promise<GameplaySample[]> {
  return page.evaluate(
    () =>
      new Promise<GameplaySample[]>((resolve) => {
        const selector = '[data-gameplay-track][data-gameplay-active="true"]'
        let startedAt: number | null = null
        const samples: GameplaySample[] = []

        const sample = (timestamp: number): void => {
          const transition = document.querySelector<HTMLElement>(
            '.cinematic-transition',
          )
          const track = transition?.querySelector<HTMLElement>(
            '[data-gameplay-track]',
          )
          const icon = transition?.querySelector<HTMLElement>(
            '[data-gameplay-icon]',
          )
          if (!track || !icon || startedAt === null) {
            requestAnimationFrame(sample)
            return
          }

          const rect = icon.getBoundingClientRect()
          const trackRect = track.getBoundingClientRect()
          const transform = getComputedStyle(icon).transform
          const values = transform
            .match(/matrix(?:3d)?\(([^)]+)\)/)?.[1]
            ?.split(',')
            .map(Number)
          const angle = values
            ? Math.atan2(values[1], values[0]) * (180 / Math.PI)
            : 0

          samples.push({
            elapsed: timestamp - startedAt,
            centerX: trackRect.left + trackRect.width / 2,
            centerY: rect.top + rect.height / 2,
            angle,
            trackLeft: trackRect.left,
            trackVisibility: getComputedStyle(track).visibility,
          })

          if (timestamp - startedAt >= 1_800) {
            resolve(samples)
            return
          }

          requestAnimationFrame(sample)
        }

        const start = (): void => {
          if (startedAt !== null || !document.querySelector(selector)) {
            return
          }

          startedAt = performance.now()
          observer.disconnect()
          sample(startedAt)
        }

        const observer = new MutationObserver(start)
        observer.observe(document.body, {
          attributes: true,
          childList: true,
          subtree: true,
        })
        start()
      }),
  )
}

function expectContinuousTravel(
  samples: GameplaySample[],
  viewportWidth: number,
): void {
  const positions = samples.map((sample) => sample.centerX)
  const distance = Math.max(...positions) - Math.min(...positions)
  const movingFrames = samples.filter((sample, index) => {
    const previous = samples[index - 1]
    return previous ? sample.centerX - previous.centerX > 0.2 : false
  }).length

  expect(distance).toBeGreaterThan(viewportWidth * 0.75)
  expect(movingFrames).toBeGreaterThan(samples.length * 0.5)
}

function expectConstantSpeed(samples: GameplaySample[], viewportWidth: number): void {
  expectContinuousTravel(samples, viewportWidth)

  const speeds: number[] = []
  samples.forEach((sample, index) => {
    const previous = samples[index - 3]
    if (
      !previous ||
      sample.elapsed < 200 ||
      sample.elapsed > 1_400
    ) {
      return
    }

    const deltaTime = sample.elapsed - previous.elapsed
    const deltaX = sample.centerX - previous.centerX
    if (deltaTime > 0 && deltaX > 0.1) {
      speeds.push(deltaX / deltaTime)
    }
  })

  if (speeds.length > 10) {
    expect(Math.min(...speeds)).toBeGreaterThan(0.3)
    expect(Math.max(...speeds) / Math.min(...speeds)).toBeLessThan(2.25)
  }
}

function expectSmoothCubeArc(samples: GameplaySample[]): void {
  const visibleSamples = samples.filter(
    (sample) => sample.trackVisibility === 'visible',
  )
  const centerYs = visibleSamples.map((sample) => sample.centerY)
  const apexIndex = centerYs.indexOf(Math.min(...centerYs))
  const ascentSpeeds: number[] = []
  const descentSpeeds: number[] = []

  for (let index = 1; index <= apexIndex; index += 1) {
    const previous = visibleSamples[index - 1]
    const current = visibleSamples[index]
    const delta = previous.centerY - current.centerY
    const elapsed = current.elapsed - previous.elapsed
    if (delta > 0.5 && elapsed > 0) {
      ascentSpeeds.push(delta / elapsed)
    }
  }

  for (let index = apexIndex + 1; index < centerYs.length; index += 1) {
    const previous = visibleSamples[index - 1]
    const current = visibleSamples[index]
    const delta = current.centerY - previous.centerY
    const elapsed = current.elapsed - previous.elapsed
    if (delta > 0.5 && elapsed > 0) {
      descentSpeeds.push(delta / elapsed)
    }
  }

  expect(apexIndex).toBeGreaterThan(3)
  expect(apexIndex).toBeLessThan(centerYs.length - 4)
  expect(ascentSpeeds.length).toBeGreaterThanOrEqual(5)
  expect(descentSpeeds.length).toBeGreaterThanOrEqual(5)
  expect(Math.max(...ascentSpeeds.slice(-2))).toBeLessThan(
    Math.max(...ascentSpeeds) * 0.8,
  )
  expect(Math.max(...descentSpeeds.slice(0, 2))).toBeLessThan(
    Math.max(...descentSpeeds) * 0.8,
  )
}

if (ENABLE_CINEMATIC_TRANSITIONS) {
test('covers the old route before swapping to the destination', async ({
  page,
}) => {
  await openSettled(page, 'hero')

  await page.keyboard.press('End')
  const cubeTransition = page.locator('.cinematic-transition')
  await expect(cubeTransition).toHaveAttribute('data-cinematic-mode', 'cube')
  await expect(cubeTransition).toHaveAttribute('data-cinematic-phase', 'cover')
  await expect(page.locator('[data-scene="hero"]')).toBeVisible()
  const forwardCurtain = cubeTransition.locator('[data-cinematic-curtain]')
  await expect(forwardCurtain).toBeVisible()
  await pauseCurtainAtMidpoint(forwardCurtain)
  expect(await curtainOwnsPoint(page, 64, 360)).toBe(true)
  expect(await curtainOwnsPoint(page, 1216, 360)).toBe(false)
  await resumeCurtain(forwardCurtain)

  await expect(cubeTransition).toHaveAttribute('data-cinematic-phase', 'hold', {
    timeout: 2_000,
  })
  await expect(page.locator('[data-scene="contact"]')).toBeAttached()
  await expect(cubeTransition.locator('[data-cinematic-icon]')).toBeVisible()
  const spikes = cubeTransition.locator('.cinematic-cube-spike')
  await expect(spikes).toHaveCount(2)
  await expect(spikes.nth(0)).toBeVisible()
  await expect(spikes.nth(1)).toBeVisible()
  const spikeBoxes = await spikes.evaluateAll((elements) =>
    elements.map((element) => {
      const { x, y, width, height } = element.getBoundingClientRect()
      return { x, y, width, height }
    }),
  )
  expect(spikeBoxes[1].x).toBeGreaterThan(
    spikeBoxes[0].x + spikeBoxes[0].width - 1,
  )
  expect(Math.abs(spikeBoxes[1].y - spikeBoxes[0].y)).toBeLessThan(1)
  await expect(cubeTransition).toHaveAttribute(
    'data-cinematic-phase',
    'gameplay',
    { timeout: 3_000 },
  )
  await expect(
    cubeTransition.locator('[data-cinematic-scene]'),
  ).toBeVisible()
  await expect(cubeTransition.locator('[data-gameplay-icon]')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Let’s make contact.',
    { timeout: 10_000 },
  )

  await page.keyboard.press('ArrowLeft')
  const waveTransition = page.locator('.cinematic-transition')
  await expect(waveTransition).toHaveAttribute('data-cinematic-mode', 'wave')
  await expect(waveTransition).toHaveAttribute('data-cinematic-phase', 'cover')
  const backwardCurtain = waveTransition.locator('[data-cinematic-curtain]')
  await pauseCurtainAtMidpoint(backwardCurtain)
  expect(await curtainOwnsPoint(page, 64, 360)).toBe(true)
  expect(await curtainOwnsPoint(page, 1216, 360)).toBe(false)
  await resumeCurtain(backwardCurtain)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Selected work in progress.',
    { timeout: 10_000 },
  )

  await page.keyboard.press('ArrowLeft')
  await expect(page.locator('.cinematic-transition')).toHaveAttribute(
    'data-cinematic-mode',
    'wave',
  )
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'A little more about the maker.',
    { timeout: 10_000 },
  )
})

test('ignores wheel momentum while a transition is active', async ({ page }) => {
  await openSettled(page, 'about')

  await page.keyboard.press('ArrowRight')
  const transition = page.locator('.cinematic-transition')
  await expect(transition).toHaveAttribute('data-cinematic-phase', 'hold', {
    timeout: 3_000,
  })

  await page.mouse.wheel(0, 600)
  await expect(transition).not.toHaveAttribute(
    'data-cinematic-phase',
    'skip-reveal',
  )
  await expect(transition).toHaveAttribute('data-cinematic-phase', 'gameplay', {
    timeout: 3_000,
  })
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Selected work in progress.',
    { timeout: 10_000 },
  )
})

test('a second navigation input safely finishes the active destination', async ({
  page,
}) => {
  await openSettled(page, 'about')

  await page.keyboard.press('ArrowRight')
  const transition = page.locator('.cinematic-transition')
  await expect(transition).toHaveAttribute('data-cinematic-mode', 'ship')
  await expect(transition).toHaveAttribute('data-cinematic-phase', 'hold', {
    timeout: 2_000,
  })

  await page.keyboard.press('Space')
  await expect(transition).toHaveAttribute(
    'data-cinematic-phase',
    'skip-reveal',
  )

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Selected work in progress.',
    { timeout: 3_000 },
  )
  await expect(page).toHaveURL(/#projects$/)
})

test('keeps the centered mode icon within the curtain on portrait screens', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openSettled(page, 'about')

  await page.keyboard.press('ArrowRight')
  const transition = page.locator('.cinematic-transition')
  await expect(transition).toHaveAttribute('data-cinematic-mode', 'ship')
  await expect(transition).toHaveAttribute('data-cinematic-phase', 'hold', {
    timeout: 2_000,
  })
  await expect(transition.locator('[data-cinematic-icon]')).toBeVisible()

  const icon = await transition.locator('[data-cinematic-icon]').boundingBox()
  expect(icon).not.toBeNull()
  expect(Math.abs(icon!.x + icon!.width / 2 - 195)).toBeLessThan(2)
  expect(Math.abs(icon!.y + icon!.height / 2 - 422)).toBeLessThan(2)

  await expect(transition).toHaveAttribute('data-cinematic-phase', 'gameplay', {
    timeout: 3_000,
  })
  await expect(transition.locator('[data-gameplay-icon]')).toBeVisible()
  await expect(transition.locator('.cinematic-hazards')).toBeHidden()
})

test('pulls the arrival camera back before revealing destination text', async ({
  page,
}) => {
  await openSettled(page, 'about')

  await page.keyboard.press('ArrowRight')
  const transition = page.locator('.cinematic-transition')
  await expect(transition).toHaveAttribute('data-cinematic-phase', 'arrival', {
    timeout: 7_000,
  })

  const heading = page.locator('[data-opening-heading]')
  await expect(heading).toHaveCSS('opacity', '0')

  const camera = page.locator('.opening-cube-camera')
  const initialTransform = await camera.evaluate(
    (element) => getComputedStyle(element).transform,
  )
  await page.waitForTimeout(300)
  const intermediateTransform = await camera.evaluate(
    (element) => getComputedStyle(element).transform,
  )
  expect(initialTransform).not.toBe('none')
  expect(intermediateTransform).not.toBe(initialTransform)
  expect(intermediateTransform).not.toBe('none')

  await expect(transition).toHaveAttribute(
    'data-cinematic-phase',
    'content-reveal',
    { timeout: 2_000 },
  )
  await expect(heading).not.toHaveCSS('opacity', '0')
})

test('acknowledges bounded endpoint input without changing scenes', async ({
  page,
}) => {
  await openSettled(page, 'contact')

  const cube = page.locator('.cube-anchor')
  await page.keyboard.press('ArrowRight')

  await expect(page).toHaveURL(/#contact$/)
  await expect(page.locator('.cinematic-transition')).toHaveCount(0)
  await expect(cube).toHaveAttribute('data-cube-reaction', '1')
})

test('keeps each gameplay icon moving at constant horizontal speed', async ({
  page,
}) => {
  await openSettled(page, 'hero')

  const cubeGameplay = collectGameplayFromActivation(page)
  await page.keyboard.press('ArrowRight')
  let transition = page.locator('.cinematic-transition')
  await expect(transition).toHaveAttribute('data-cinematic-mode', 'cube')
  const cubeSamples = await cubeGameplay
  const firstVisibleCubeSample = cubeSamples.find(
    (sample) => sample.trackVisibility === 'visible',
  )
  expect(firstVisibleCubeSample).toBeDefined()
  expect(firstVisibleCubeSample!.trackLeft).toBeLessThan(
    -(page.viewportSize()?.width ?? 1280) * 0.15,
  )
  expectConstantSpeed(cubeSamples, page.viewportSize()?.width ?? 1280)
  const cubeVerticalRange =
    Math.max(...cubeSamples.map((sample) => sample.centerY)) -
    Math.min(...cubeSamples.map((sample) => sample.centerY))
  expect(cubeVerticalRange).toBeGreaterThan(
    (page.viewportSize()?.height ?? 720) * 0.2,
  )
  expectSmoothCubeArc(cubeSamples)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'A little more about the maker.',
    { timeout: 10_000 },
  )

  const shipGameplay = collectGameplayFromActivation(page)
  await page.keyboard.press('ArrowRight')
  transition = page.locator('.cinematic-transition')
  await expect(transition).toHaveAttribute('data-cinematic-mode', 'ship')
  expectConstantSpeed(
    await shipGameplay,
    page.viewportSize()?.width ?? 1280,
  )
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Selected work in progress.',
    { timeout: 10_000 },
  )

  const waveGameplay = collectGameplayFromActivation(page)
  await page.keyboard.press('ArrowRight')
  transition = page.locator('.cinematic-transition')
  await expect(transition).toHaveAttribute('data-cinematic-mode', 'wave')
  const waveSamples = await waveGameplay
  expectConstantSpeed(waveSamples, page.viewportSize()?.width ?? 1280)
  const waveAngleDelta = waveSamples.reduce((largestDelta, sample, index) => {
    const previous = waveSamples[index - 1]
    if (!previous) {
      return largestDelta
    }

    const delta = Math.abs(sample.angle - previous.angle)
    return Math.max(largestDelta, Math.min(delta, 360 - delta))
  }, 0)
  expect(waveAngleDelta).toBeGreaterThan(80)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Let’s make contact.',
    { timeout: 10_000 },
  )
})
} else {
  test('navigates immediately without route transition animations', async ({
    page,
  }) => {
    await openSettled(page, 'about')

    await expect(page.locator('.app-shell')).toHaveAttribute(
      'data-transitions-enabled',
      'false',
    )
    await page.keyboard.press('ArrowRight')

    await expect(page).toHaveURL(/#projects$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Selected work in progress.',
    )
    await expect(page.locator('.cinematic-transition')).toHaveCount(0)

    const routeAnimations = await page.locator('.route-stage').evaluate((stage) =>
      stage.getAnimations({ subtree: true }).length,
    )
    expect(routeAnimations).toBe(0)

    const progressClipPath = await page
      .locator('.checkpoint-progress__fill')
      .evaluate((element) => getComputedStyle(element).clipPath)
    expect(progressClipPath).toContain('25%')
  })
}
