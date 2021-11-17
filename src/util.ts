import { html } from 'property-information'
import { css } from './css'
import { kebabToCamel } from 'kebab-to-camel'
import { camelCaseToKebab } from 'camelcase-to-kebab'

export const toAttr = Object.fromEntries([
  ...Object.entries(html.property).map(([key, value]) => [
    key,
    value.attribute,
  ]),
  ...Object.entries(html.normal).map(([key, value]) => [
    key,
    html.property[value].attribute,
  ]),
])

// export const toProp = Object.fromEntries([
//   ...Object.entries(html.property).map(([key, value]) => [key, value.property]),
//   ...Object.entries(html.normal).map(([key, value]) => [key, value]),
// ])

// const toCssProp = Object.fromEntries(css.map(key => [key, kebabToCamel(key)]))

const toCssAttr = Object.fromEntries(css.map(key => [kebabToCamel(key), key]))

export const toCssText = (style: CSSStyleDeclaration) => {
  let css = ''
  for (const key in style)
    css += (toCssAttr[key] || camelCaseToKebab(key)) + ':' + style[key] + ';'
  return css
}

// const eventProp = Object.fromEntries([
//   ...htmlEventAttributes.map(key => [toProp[key], true]),
//   ...htmlEventAttributes.map(key => [key, true]),
// ])

export const createElement = document.createElement.bind(
  document,
) as typeof document.createElement

export const createElementSvg = document.createElementNS.bind(
  document,
  'http://www.w3.org/2000/svg',
) as typeof document.createElement
