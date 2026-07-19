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
}

test('navigates between sections without route animations', async ({ page }) => {
  await openSettled(page, 'about')

  await page.keyboard.press('ArrowRight')

  await expect(page).toHaveURL(/#projects$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Selected work in progress.',
  )

  const routeAnimations = await page.locator('.route-stage').evaluate((stage) =>
    stage.getAnimations({ subtree: true }).length,
  )
  const progressAnimations = await page
    .locator('.checkpoint-progress')
    .evaluate((progress) => progress.getAnimations({ subtree: true }).length)

  expect(routeAnimations).toBe(0)
  expect(progressAnimations).toBe(0)
})

test('keeps navigation bounded at the final section', async ({ page }) => {
  await openSettled(page, 'contact')

  await page.keyboard.press('ArrowRight')

  await expect(page).toHaveURL(/#contact$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Let’s make contact.',
  )
  await expect(page.locator('.cube-anchor')).toHaveAttribute(
    'data-cube-reaction',
    '1',
  )
})
