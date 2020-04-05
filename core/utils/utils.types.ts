import { Dashes } from '../../types'

export type ToArray = (NodeList: NodeList) => Array<HTMLInputElement>

export type ToNumber = (value: number | string | Dashes) => string | number

export type ToLeadingZero = (value: number | string | Dashes) => string