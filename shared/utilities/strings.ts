export function formatAddressForDisplay(address?: string): string {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''
}
