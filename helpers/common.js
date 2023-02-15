export function arrayFromLength(number) {
  return Array.from(Array(number).keys()).map((i) => i + 1)
}

// 8&nbsp;450&nbsp;000&nbsp;
export function formatPrice(price) {
  return price.replace(/\s/g, '') // 8450000
}