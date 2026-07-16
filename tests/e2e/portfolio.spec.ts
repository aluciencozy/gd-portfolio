import { expect, test } from '@playwright/test'

test.describe('controlled portfolio scenes', () => {
  test('starts in Hero and completes a forward scene transition', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('[data-scene="hero"]')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'A portfolio in motion.' })).toBeVisible()

    await page.getByRole('button', { name: 'Next scene' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText('Cube travel')).toBeVisible()
    await page.getByRole('button', { name: 'Skip transition' }).click()

    await expect(page.locator('[data-scene="about"]')).toBeVisible()
    await expect(page).toHaveURL(/#about$/)
    await expect(page.getByText(/Active mode:/)).toHaveCount(0)
  })

  test('animates direct navigation and browser history destinations', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: 'Contact', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Skip transition' })).toBeVisible()
    await page.getByRole('button', { name: 'Skip transition' }).click()
    await expect(page.locator('[data-scene="contact"]')).toBeVisible()
    await expect(page).toHaveURL(/#contact$/)

    await page.goBack()
    await expect(page.getByRole('button', { name: 'Skip transition' })).toBeVisible()
    await page.getByRole('button', { name: 'Skip transition' }).click()
    await expect(page.locator('[data-scene="hero"]')).toBeVisible()
    await expect(page).toHaveURL(/#hero$/)
  })

  test('turns a wheel input into one scene request and ignores repeats during travel', async ({ page }) => {
    await page.goto('/')

    await page.mouse.wheel(0, 20)
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.mouse.wheel(0, 20)
    await page.getByRole('button', { name: 'Skip transition' }).click()

    await expect(page.locator('[data-scene="about"]')).toBeVisible()
    await expect(page).toHaveURL(/#about$/)
  })

  test('keeps the complete asset gallery inside its own scroll surface', async ({ page }) => {
    await page.goto('#contact')
    await expect(page.locator('[data-scene="contact"]')).toBeVisible()

    const gallery = page.locator('[data-scene-scroll-exempt="true"]')
    await expect(gallery).toBeVisible()
    await expect(gallery.locator('figure')).toHaveCount(13)

    await gallery.hover()
    await page.mouse.wheel(0, 120)
    await expect(page.locator('[data-scene="contact"]')).toBeVisible()
  })

  test('renders the foundation at a mobile viewport', async ({ page }) => {
    await page.goto('/?visualTest=1')
    await expect(page.locator('[data-scene="hero"]')).toBeVisible()
    await expect(page).toHaveScreenshot('hero-mobile.png', { animations: 'disabled' })
  })
})
