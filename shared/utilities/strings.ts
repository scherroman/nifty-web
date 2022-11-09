export function formatAddressForDisplay(address?: string): string {
    return address
        ? `${address.substring(0, 6)}...${address.substring(
              address.length - 4,
              address.length
          )}`
        : ''
}
