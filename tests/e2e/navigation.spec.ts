import { expect, test, type Page } from '@playwright/test'

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
  await expect(page.locator('.app-shell')).toHaveAttribute(
    'data-transitioning',
    'false',
  )
}

async function readCubeTransform(page: Page): Promise<{
  rotation: number
  scaleX: number
  scaleY: number
  x: number
}> {
  return page.locator('.cube-anchor').evaluate((element) => {
    const transform = getComputedStyle(element).transform
    const matrix = new DOMMatrix(transform === 'none' ? undefined : transform)

    return {
      rotation: Math.atan2(matrix.b, matrix.a) * (180 / Math.PI),
      scaleX: Math.hypot(matrix.a, matrix.b),
      scaleY: Math.hypot(matrix.c, matrix.d),
      x: matrix.e,
    }
  })
}

test('animates content, progress, and theme between sections', async ({
  page,
}) => {
  await openSettled(page, 'about')
  const initialTheme = await page
    .locator('.scene-backdrop-tint')
    .evaluate((element) => getComputedStyle(element).backgroundColor)

  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/#experience$/)
  await expect(page.locator('.app-shell')).toHaveAttribute(
    'data-transitioning',
    'true',
  )

  await expect(page.locator('.app-shell')).toHaveAttribute(
    'data-transitioning',
    'false',
  )
  const destinationTheme = await page
    .locator('.scene-backdrop-tint')
    .evaluate((element) => getComputedStyle(element).backgroundColor)
  expect(destinationTheme).not.toBe(initialTheme)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Shipping real systems.',
  )
  await expect(page.locator('.checkpoint-progress__track')).toHaveAttribute(
    'data-progress-value',
    '60',
  )
})

test('hides checkpoint markers by default and restores them with the toggle', async ({
  page,
}) => {
  await openSettled(page, 'hero')

  const toggle = page.getByRole('switch', {
    name: 'Show checkpoint markers',
  })
  await expect(toggle).not.toBeChecked()
  await expect(page.locator('[data-checkpoint-marker]')).toHaveCount(0)

  await toggle.check()
  await expect(toggle).toBeChecked()
  await expect(page.locator('[data-checkpoint-marker]')).toHaveCount(5)

  await page.reload()
  await expect(toggle).toBeChecked()
  await expect(page.locator('[data-checkpoint-marker]')).toHaveCount(5)

  await toggle.uncheck()
  await expect(page.locator('[data-checkpoint-marker]')).toHaveCount(0)
})

test('exposes the animated bar as an accessible progress indicator', async ({
  page,
}) => {
  await openSettled(page, 'about')

  const progress = page.getByRole('progressbar', {
    name: 'Portfolio progress',
  })
  await expect(progress).toHaveAttribute('aria-valuemin', '0')
  await expect(progress).toHaveAttribute('aria-valuemax', '100')
  await expect(progress).toHaveAttribute('aria-valuenow', '40')
  await expect(progress).toHaveAttribute('aria-valuetext', '40.00%')
  await expect(page.locator('.checkpoint-progress__percentage')).toHaveText(
    '40.00%',
  )
  await expect(page.locator('.checkpoint-progress__meta')).toHaveCount(0)
  await expect(page.locator('.checkpoint-progress')).not.toContainText(
    'complete',
  )
})

test('supports wheel and direct checkpoint navigation', async ({ page }) => {
  await openSettled(page, 'hero')

  await page.mouse.wheel(0, 300)
  await expect(page).toHaveURL(/#about$/)
  await expect(page.locator('.app-shell')).toHaveAttribute(
    'data-transitioning',
    'false',
  )

  await page.getByRole('switch', { name: 'Show checkpoint markers' }).check()
  await page.getByRole('button', { name: 'projects checkpoint' }).click()
  await expect(page).toHaveURL(/#projects$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Built to be used.',
  )
})

test('keeps checkpoint markers centered while hovering', async ({ page }) => {
  await openSettled(page, 'hero')
  await page.getByRole('switch', { name: 'Show checkpoint markers' }).check()

  const marker = page.getByRole('button', { name: 'about checkpoint' })
  const before = await marker.boundingBox()

  expect(before).not.toBeNull()

  await marker.hover()
  await page.waitForTimeout(220)

  const after = await marker.boundingBox()

  expect(after).not.toBeNull()
  expect(after!.x).toBeCloseTo(before!.x, 1)
  expect(after!.width).toBeCloseTo(before!.width, 1)
})

test('keeps navigation bounded at the final section', async ({ page }) => {
  await openSettled(page, 'contact')

  await page.keyboard.press('ArrowRight')

  await expect(page).toHaveURL(/#contact$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'CONTACT COMPLETE!',
  )
  await expect(page.locator('.cube-anchor')).toHaveAttribute(
    'data-cube-reaction',
    '1',
  )
})

test('lets project cards prompt a cube reaction', async ({ page }) => {
  await openSettled(page, 'projects')

  await page.getByText('Demonlist Ultimate').hover()

  await expect(page.locator('.cube-comment')).toContainText(
    'My favorite boss battle',
  )
})

test('renders projects as green keyboard-reachable cards with usable links', async ({
  page,
}) => {
  await openSettled(page, 'projects')

  const cards = page.locator('.project-box')
  await expect(cards).toHaveCount(4)
  await expect(cards.first()).toHaveCSS(
    'border-top-color',
    'rgb(248, 255, 239)',
  )

  for (const name of [
    'Vesta Credentialing',
    'Demonlist Ultimate',
    'Guess the OST',
    'Git Janitor',
  ]) {
    await expect(cards.filter({ hasText: name })).toHaveCount(1)
  }

  for (let index = 0; index < 4; index += 1) {
    await cards.nth(index).focus()
    await expect(cards.nth(index)).toBeFocused()
  }

  const projectLinks = page.getByRole('link', { name: /View .* on GitHub/ })
  await expect(projectLinks).toHaveCount(2)
  await expect(
    page.getByRole('link', { name: 'View Demonlist Ultimate on GitHub' }),
  ).toHaveAttribute('href', 'https://github.com/aluciencozy/demonlist')
  await expect(
    page.getByRole('link', { name: 'View Guess the OST on GitHub' }),
  ).toHaveAttribute('href', 'https://github.com/aluciencozy/guess-the-ost')
})

test('keeps project card copy readable on mobile widths', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openSettled(page, 'projects')

  const grid = page.locator('.project-grid')
  const columnCount = await grid.evaluate(
    (element) => getComputedStyle(element).gridTemplateColumns.split(' ').length,
  )
  expect(columnCount).toBe(1)
  await expect(page.locator('.project-box')).toHaveCount(4)
  await expect(
    page.getByText(
      'A scalable leaderboard for the hardest Geometry Dash levels.',
    ),
  ).toBeVisible()
  await expect(
    page.getByText(
      'A three-tier AWS platform with a Next.js frontend, Dockerized FastAPI services, PostgreSQL, S3 media, and a Gemini-powered assistant.',
    ),
  ).toBeVisible()
})

test('keeps cube motion state separate from visible comments', async ({
  page,
}) => {
  await openSettled(page, 'hero')
  await page.getByRole('switch', { name: 'Show checkpoint markers' }).check()
  await page.evaluate(() => document.activeElement?.blur())

  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/#about$/)
  await expect(page.locator('.app-shell')).toHaveAttribute(
    'data-transitioning',
    'false',
  )
  const firstLanding = await readCubeTransform(page)

  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/#experience$/)
  await expect(page.locator('.app-shell')).toHaveAttribute(
    'data-transitioning',
    'false',
  )
  const secondLanding = await readCubeTransform(page)

  expect(firstLanding.x).toBeGreaterThan(0)
  expect(secondLanding.x).toBeLessThan(0)
  expect(Math.abs(secondLanding.rotation - firstLanding.rotation)).toBeCloseTo(
    90,
    0,
  )
  expect(firstLanding.scaleX).toBeCloseTo(1, 2)
  expect(firstLanding.scaleY).toBeCloseTo(1, 2)
  expect(secondLanding.scaleX).toBeCloseTo(1, 2)
  expect(secondLanding.scaleY).toBeCloseTo(1, 2)

  await page.getByRole('button', { name: 'projects checkpoint' }).click()
  await expect(page).toHaveURL(/#projects$/)
  await expect(page.locator('.app-shell')).toHaveAttribute(
    'data-transitioning',
    'false',
  )

  const beforeComment = await readCubeTransform(page)
  await page.getByText('Demonlist Ultimate').hover()
  const comment = page.locator('.cube-comment')
  await expect(comment).toContainText('My favorite boss battle')
  await expect(comment).toBeVisible()
  await expect(page.locator('.cube-comment-overlay')).toHaveCSS(
    'z-index',
    '20',
  )
  await expect(page.locator('.route-stage')).toHaveCSS('z-index', '10')
  const resolvedPositions = await page.evaluate(() => {
    const cube = new DOMMatrix(
      getComputedStyle(document.querySelector('.cube-anchor')!).transform,
    )
    const commentAnchor = new DOMMatrix(
      getComputedStyle(
        document.querySelector('.cube-comment-overlay__anchor')!,
      ).transform,
    )

    return { commentAnchorX: commentAnchor.e, cubeX: cube.e }
  })
  expect(resolvedPositions.commentAnchorX).toBeCloseTo(
    resolvedPositions.cubeX,
    1,
  )
  const verticalPositions = await page.evaluate(() => {
    const cube = document.querySelector('.cube-anchor')!.getBoundingClientRect()
    const anchor = document
      .querySelector('.cube-comment-overlay__anchor')!
      .getBoundingClientRect()
    const comment = document.querySelector('.cube-comment')!.getBoundingClientRect()

    return {
      anchorTop: anchor.top,
      commentBottom: comment.bottom,
      cubeTop: cube.top,
    }
  })
  expect(verticalPositions.commentBottom).toBeLessThan(
    verticalPositions.anchorTop,
  )
  expect(verticalPositions.commentBottom).toBeLessThan(
    verticalPositions.cubeTop,
  )
  expect(
    await comment.evaluate((element) =>
      Boolean(element.closest('.opening-cube-camera')),
    ),
  ).toBe(false)

  await page.waitForTimeout(100)
  const afterComment = await readCubeTransform(page)
  expect(afterComment.x).toBeCloseTo(beforeComment.x, 1)
  expect(afterComment.rotation).toBeCloseTo(beforeComment.rotation, 1)
})
