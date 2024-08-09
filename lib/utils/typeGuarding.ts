import { Image, Metafield, Money, SelectedOption } from '@/types/store'

const conversionError = new Error('Conversion failed')

export const ensureString = (value: any): string => {
	if (typeof value !== 'string') {
		throw conversionError
	}
	return value
}

export const ensureNumber = (value: any): number => {
	if (typeof value !== 'number') {
		throw conversionError
	}
	return value
}

export const ensureDate = (value: any): Date => {
	value = new Date(value)
	if (isNaN(value)) {
		throw conversionError
	}
	return value
}

export const ensureBoolean = (value: any): boolean => {
	if (typeof value !== 'boolean') {
		throw conversionError
	}
	return value
}

export const ensureArray = <T>(value: any, itemGuard: (item: any) => T): T[] => {
	if (!Array.isArray(value)) {
		throw conversionError
	}
	return value.map(itemGuard)
}

export const ensureMoney = (value: any): Money => ({
	amount: ensureNumber(parseFloat(value?.amount)),
	currencyCode: ensureString(value?.currencyCode),
})

export const ensureImage = (image: any): Image => ({
	altText: ensureNullableString(image?.altText),
	height: ensureNumber(image?.height),
	src: ensureString(image?.src),
	width: ensureNumber(image?.width),
})

export const ensureSelectedOption = (selectedOption: any): SelectedOption => ({
	name: ensureString(selectedOption?.name),
	value: ensureString(selectedOption?.value),
})

export const ensureMetafield = (metafield: any): Metafield => ({
	key: ensureString(metafield?.name),
	value: ensureString(metafield?.value),
})

export const ensureNullableString = (value: any): string | undefined => {
	if (typeof value !== 'string') {
		return undefined
	}
	return value
}

export const ensureNullableNumber = (value: any, defaultValue = 0): number | undefined => {
	if (typeof value !== 'number') {
		return undefined
	}
	return value
}

export const ensureNullableDate = (value: any, defaultValue = new Date()): Date | undefined => {
	value = new Date(value)
	if (isNaN(value)) {
		return undefined
	}
	return value
}

export const ensureNullableBoolean = (value: any, defaultValue = false): boolean | undefined => {
	if (typeof value !== 'boolean') {
		return undefined
	}
	return value
}

export const ensureNullableArray = <T>(
	value: any,
	itemGuard: (item: any) => T
): T[] | undefined => {
	if (!Array.isArray(value)) {
		return undefined
	}
	return value.map(itemGuard)
}

export const ensureNullableMoney = (value: any): Money | undefined => {
	try {
		return {
			amount: ensureNumber(parseFloat(value?.amount)),
			currencyCode: ensureString(value?.currencyCode),
		}
	} catch {
		return undefined
	}
}

export const ensureNullableImage = (image: any): Image | undefined => {
	try {
		return {
			altText: image.altText ? ensureString(image?.altText) : undefined,
			height: ensureNumber(image?.height),
			src: ensureString(image?.src),
			width: ensureNumber(image?.width),
		}
	} catch {
		return undefined
	}
}

export const ensureNullableSelectedOption = (selectedOption: any): SelectedOption | undefined => {
	try {
		return {
			name: ensureString(selectedOption?.name),
			value: ensureString(selectedOption?.value),
		}
	} catch {
		return undefined
	}
}

export const ensureNullableMetafield = (metafield: any): Metafield | undefined => {
	try {
		return {
			key: ensureString(metafield?.name),
			value: ensureString(metafield?.value),
		}
	} catch {
		return undefined
	}
}
