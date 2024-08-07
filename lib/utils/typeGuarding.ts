import { Image, Money, SelectedOption } from '@/types/store'

const conversionError = new Error('Conversion failed')

export const ensureString = (value: any): string => {
	if (typeof value !== 'string') {
		throw conversionError
	}
	return value
}

export const ensureNumber = (value: any, defaultValue = 0): number => {
	if (typeof value !== 'number') {
		throw conversionError
	}
	return value
}

export const ensureDate = (value: any, defaultValue = new Date()): Date => {
	if (!(value instanceof Date)) {
		throw conversionError
	}
	return value
}

export const ensureBoolean = (value: any, defaultValue = false): boolean => {
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
	altText: image.altText ? ensureString(image?.altText) : undefined,
	height: ensureNumber(image?.height),
	src: ensureString(image?.src),
	width: ensureNumber(image?.width),
})

export const ensureSelectedOption = (selectedOption: any): SelectedOption => ({
	name: ensureString(selectedOption?.name),
	value: ensureString(selectedOption?.value),
})
