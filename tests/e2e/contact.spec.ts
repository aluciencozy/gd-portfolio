import { expect, test, type Page } from '@playwright/test'

async function openContact(page: Page): Promise<void> {
  await page.goto('/#about')
  await page.evaluate(() => {
    window.sessionStorage.setItem('gd-portfolio-opening-played', 'true')
  })
  await page.goto('/?e2e=contact#contact')
  await expect(page.locator('.app-shell')).toHaveAttribute(
    'data-opening',
    'false',
  )
  await expect(page.locator('.app-shell')).toHaveAttribute(
    'data-transitioning',
    'false',
  )
}

test.describe('Contact checkpoint', () => {
  test('keeps contact details and actions inside the framed panel', async ({
    page,
  }) => {
    await openContact(page)

    const panel = page.locator('[data-contact-panel]')
    await expect(panel).toBeVisible()
    await expect(panel).toHaveAttribute('data-contact-motion', 'spring')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'CONTACT COMPLETE!',
    )
    await expect(
      page.locator('a[href="mailto:aluciencozy22@gmail.com"]'),
    ).toHaveCount(1)
    await expect(page.locator('a[href="https://github.com/aluciencozy"]')).toHaveCount(1)
    await expect(page.locator('a[href="https://linkedin.com/in/alcozy/"]')).toHaveCount(1)
    await expect(page.locator('a[href="tel:+14077246962"]')).toHaveCount(1)
    await expect(page.locator('a[download]')).toHaveAttribute('href', /alex_cosentino_resume/)
    await expect(page.locator('.contact-panel__frame-piece')).toHaveCount(4)
  })

  test('settles without an entry animation when reduced motion is requested', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await openContact(page)

    await expect(page.locator('[data-contact-panel]')).toHaveAttribute(
      'data-contact-motion',
      'reduced',
    )
  })

  test('keeps the panel usable on a narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await openContact(page)

    const viewport = await page.evaluate(() => ({
      height: window.innerHeight,
      width: window.innerWidth,
      documentHeight: document.documentElement.scrollHeight,
      documentWidth: document.documentElement.scrollWidth,
    }))

    expect(viewport.documentWidth).toBeLessThanOrEqual(viewport.width)
    expect(viewport.documentHeight).toBeLessThanOrEqual(viewport.height)
    await expect(page.locator('a[download]')).toBeVisible()
    await expect(page.locator('a[href="tel:+14077246962"]')).toBeVisible()
  })
})
