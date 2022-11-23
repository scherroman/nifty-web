import { formatAddressForDisplay } from './strings'

describe(formatAddressForDisplay, () => {
    it('should return an empty string if no address is provided', () => {
        expect(formatAddressForDisplay()).toBe('')
    })

    it('should return an empty string if an empty string is provided', () => {
        expect(formatAddressForDisplay('')).toBe('')
    })

    it('should return the first 6 characters, ..., and the last 4 characters of the address', () => {
        expect(formatAddressForDisplay('1234567890')).toBe('123456...7890')
    })
})
