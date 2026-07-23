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
