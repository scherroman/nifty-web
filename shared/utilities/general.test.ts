import { sleep } from './general'

describe('sleep', () => {
    it('should resolve after the specified time', async () => {
        let start = Date.now()
        await sleep(100)
        let end = Date.now()
        expect(end - start).toBeGreaterThanOrEqual(100)
    })
})
