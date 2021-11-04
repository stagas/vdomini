const hyphenChar = /-./g
const upperAfterHyphen = (s: string) => s.slice(1).toLocaleUpperCase()
export const camelCase = (s: string) => s.replace(hyphenChar, upperAfterHyphen)
