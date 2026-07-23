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
    'Alex Cosentino',
  )

  const settledCube = await cube.boundingBox()
  expect(settledCube).not.toBeNull()
  expect(settledCube!.x).toBeLessThan(200)
  expect(settledCube!.width).toBeLessThan(openingCube!.width)

  await page.keyboard.press('End')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Let’s build something good.',
    { timeout: 10_000 },
  )
})

test('plays the opening only once per tab session', async ({ page }) => {
  await page.goto('/#hero')
  await expect(page.locator('.app-shell')).toHaveAttribute(
    'data-opening',
    'false',
    { timeout: 9_000 },
  )

  await page.reload()

  await expect(page.locator('.app-shell')).toHaveAttribute(
    'data-opening',
    'false',
  )
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Alex Cosentino',
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
    'Built to be used.',
  )
})
