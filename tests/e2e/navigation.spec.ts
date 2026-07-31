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

test('supports wheel and direct checkpoint navigation', async ({ page }) => {
  await openSettled(page, 'hero')

  await page.mouse.wheel(0, 300)
  await expect(page).toHaveURL(/#about$/)
  await expect(page.locator('.app-shell')).toHaveAttribute(
    'data-transitioning',
    'false',
  )

  await page.getByRole('button', { name: 'projects checkpoint' }).click()
  await expect(page).toHaveURL(/#projects$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Built to be used.',
  )
})

test('keeps checkpoint markers centered while hovering', async ({ page }) => {
  await openSettled(page, 'hero')

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
    'Let’s build something good.',
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

test('keeps cube motion state separate from visible comments', async ({
  page,
}) => {
  await openSettled(page, 'hero')

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
