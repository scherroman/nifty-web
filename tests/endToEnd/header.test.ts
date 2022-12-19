import { expect, test, Page } from '@playwright/test'

async function navigate({
    page,
    isMobile,
    name,
    url
}: {
    page: Page
    isMobile: boolean | undefined
    name: string
    url: string
}): Promise<void> {
    if (isMobile) {
        await page.getByRole('button', { name: 'menu' }).click()
    }
    await page.getByRole('link', { name }).click()
    await expect(page).toHaveURL(url)
}

test.describe('Header', () => {
    test('allows the user to navigate and use the back button', async ({
        page,
        isMobile
    }) => {
        await page.goto('/')

        await navigate({ page, isMobile, name: 'Sell', url: '/sell' })
        await navigate({ page, isMobile, name: 'Explore', url: '/' })
        await navigate({ page, isMobile, name: 'Sell', url: '/sell' })
        await navigate({ page, isMobile, name: 'Nifty', url: '/' })

        await page.goBack()
        await expect(page).toHaveURL('/sell')

        await page.goBack()
        await expect(page).toHaveURL('/')

        await page.goBack()
        await expect(page).toHaveURL('/sell')

        await page.goBack()
        await expect(page).toHaveURL('/')
    })

    test('allows the user to open and close the settings panel', async ({
        page
    }) => {
        await page.goto('/')

        await page.getByRole('button', { name: 'settings' }).click()

        let settingsHeader = page.getByText('Settings')
        await expect(settingsHeader).toBeVisible()

        await page.getByRole('button', { name: 'close' }).click()
        await expect(settingsHeader).not.toBeVisible()
    })
})
