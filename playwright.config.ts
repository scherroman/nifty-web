import type { PlaywrightTestConfig } from '@playwright/test'
import { devices } from '@playwright/test'

/**
 * See https://playwright.dev/docs/test-configuration
 */

const ONE_SECOND_IN_MILLISECONDS = 1000

/* eslint-disable @typescript-eslint/naming-convention */
const CONFIG: PlaywrightTestConfig = {
    testDir: './tests/endToEnd',
    /* Maximum time one test can run for. */
    timeout: 30 * ONE_SECOND_IN_MILLISECONDS,
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         */
        timeout: 5000
    },
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Number of times to run each test before registering an error */
    retries: 2,
    /* Opt-out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: 'html',
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        baseURL: 'http://localhost:3000',
        /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
        actionTimeout: 0,
        /* Base URL to use in actions like `await page.goto('/')`. */
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry'
    },
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome']
            }
        },
        {
            name: 'firefox',
            use: {
                ...devices['Desktop Firefox']
            }
        },
        {
            name: 'webkit',
            use: {
                ...devices['Desktop Safari']
            }
        },
        {
            name: 'Mobile Chrome',
            use: {
                ...devices['Pixel 5']
            }
        },
        {
            name: 'Mobile Safari',
            use: {
                ...devices['iPhone 12']
            }
        }
    ],

    /* Folder for test artifacts such as screenshots, videos, traces, etc. */
    // outputDir: 'test-results/',

    /* Run your local dev server before starting the tests */
    webServer: {
        command: 'npm run start:production',
        port: 3000,
        reuseExistingServer: !process.env.CI
    }
}
/* eslint-enable @typescript-eslint/naming-convention */

export default CONFIG
