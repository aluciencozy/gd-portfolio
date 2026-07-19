import { expect, test, type Locator, type Page } from '@playwright/test'

async function openSettled(page: Page, scene: string): Promise<void> {
  await page.goto('/#about')
  await page.evaluate(() => {
    window.sessionStorage.setItem('gd-portfolio-opening-played', 'true')
    window.localStorage.removeItem('gd-portfolio-skip-transitions')
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
  await expect(cubeTransition).toHaveAttribute(
    'data-cinematic-direction',
    'forward',
  )
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
  await expect(waveTransition).toHaveAttribute(
    'data-cinematic-direction',
    'backward',
  )
  const backwardCurtain = waveTransition.locator('[data-cinematic-curtain]')
  await pauseCurtainAtMidpoint(backwardCurtain)
  expect(await curtainOwnsPoint(page, 64, 360)).toBe(false)
  expect(await curtainOwnsPoint(page, 1216, 360)).toBe(true)
  await resumeCurtain(backwardCurtain)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Selected work in progress.',
    { timeout: 10_000 },
  )

  await page.keyboard.press('ArrowLeft')
  await expect(page.locator('.cinematic-transition')).toHaveAttribute(
    'data-cinematic-mode',
    'ship',
  )
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'A little more about the maker.',
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

test('persists skip preference and bypasses the curtain and arrival camera', async ({
  page,
}) => {
  await openSettled(page, 'about')

  const skipControl = page.getByRole('checkbox', { name: 'Skip transitions' })
  await skipControl.check()
  await page.reload()
  await expect(skipControl).toBeChecked()

  await page.keyboard.press('ArrowRight')
  const transition = page.locator('.cinematic-transition')
  await expect(transition).toHaveAttribute(
    'data-cinematic-phase',
    'skip-reveal',
  )
  await expect(transition.locator('[data-cinematic-curtain]')).toHaveCount(0)

  const cameraTransform = await page
    .locator('.opening-cube-camera')
    .evaluate((element) => getComputedStyle(element).transform)
  expect(cameraTransform).toBe('none')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Selected work in progress.',
    { timeout: 1_500 },
  )
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
