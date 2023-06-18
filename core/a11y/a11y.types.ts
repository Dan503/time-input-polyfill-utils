export interface A11yCreate {
	(document?: Document): HTMLDivElement | null
}

export interface A11yUpdate {
	(
		$input: HTMLInputElement | null,
		announcementArray: Array<'initial' | 'select' | 'update'>,
		document?: Document,
	): string
}

export type A11yClear = (document?: Document) => void

export type GetA11yValue = (document?: Document) => string

export type GetA11yElement = (document?: Document) => HTMLDivElement | null
