import { expect, test } from '@playwright/test'

test.describe('App', () => {
    test('has a title', async ({ page }) => {
        await page.goto('/')
        await expect(page).toHaveTitle('Nifty')
    })

    test('tells the user to connect their wallet if they are not connected', async ({
        page
    }) => {
        await page.goto('/')
        let welcome = page.getByText('Connect your wallet to get started!')
        await expect(welcome).toBeVisible()

        await page.goto('/sell')
        await expect(welcome).toBeVisible()
    })
})
