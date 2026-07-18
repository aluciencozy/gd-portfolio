import { expect, test } from '@playwright/test'

test('plays the opening sequence and settles into the hero layout', async ({
  page,
}) => {
  await page.goto('/#hero')

  const app = page.locator('.app-shell')
  const progress = page.locator('.checkpoint-progress')
  const cube = page.locator('.cube-anchor')

  await expect(app).toHaveAttribute('data-opening', 'true')
  await expect(progress).toBeHidden()

  const openingCube = await cube.boundingBox()
  expect(openingCube).not.toBeNull()
  expect(openingCube!.width).toBeGreaterThan(200)

  await page.keyboard.press('End')
  await expect(page).toHaveURL(/#hero$/)

  await expect(app).toHaveAttribute('data-opening', 'false', {
    timeout: 9_000,
  })
  await expect(progress).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'A portfolio in motion.',
  )

  const settledCube = await cube.boundingBox()
  expect(settledCube).not.toBeNull()
  expect(settledCube!.x).toBeLessThan(200)
  expect(settledCube!.width).toBeLessThan(openingCube!.width)

  await page.keyboard.press('End')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Let’s make contact.',
    { timeout: 4_000 },
  )
})

test('skips the opening sequence for a direct section link', async ({ page }) => {
  await page.goto('/#projects')

  await expect(page.locator('.app-shell')).toHaveAttribute(
    'data-opening',
    'false',
  )
  await expect(page.locator('.checkpoint-progress')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Selected work in progress.',
  )
})
