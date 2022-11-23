import { renderHook } from '@testing-library/react'

import { useIsMounted } from './useIsMounted'

describe('useIsMounted', () => {
    it('should return true when the component is mounted', () => {
        let { result } = renderHook(() => useIsMounted())
        expect(result.current).toBe(true)
    })
})
