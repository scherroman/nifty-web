import { expect, test } from '@playwright/test'

const LIGHT_BACKGROUND_COLOR = 'rgb(255, 255, 255)'
const DARK_BACKGROUND_COLOR = 'rgb(19, 19, 24)'

test.describe('Settings panel', () => {
    test('should allow changing the appearance to light, dark, or system', async ({
        page
    }) => {
        await page.goto('/')
        await page.getByRole('button', { name: 'settings' }).click()

        let lightButton = page.getByLabel('Light')
        await lightButton.click()
        await expect(page.locator('body')).toHaveCSS(
            'background-color',
            LIGHT_BACKGROUND_COLOR
        )

        await page.getByLabel('Dark').click()
        await expect(page.locator('body')).toHaveCSS(
            'background-color',
            DARK_BACKGROUND_COLOR
        )

        await page.getByLabel('System').click()
        await page.emulateMedia({ colorScheme: 'light' })
        await expect(page.locator('body')).toHaveCSS(
            'background-color',
            LIGHT_BACKGROUND_COLOR
        )

        await page.emulateMedia({ colorScheme: 'dark' })
        await expect(page.locator('body')).toHaveCSS(
            'background-color',
            DARK_BACKGROUND_COLOR
        )
    })
})
