export const isNumeric = (value: string): boolean => {
    for (let i = 0; i < value.length; i++) {
        const code = value.charCodeAt(i)
        if (code < 48 || code > 57) {
            return false
        }
    }
    return value.length > 0
}

export const roundUp = (value: number, to: number = 5) => Math.ceil(value / to) * to
