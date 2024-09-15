import { FunctionComponent, useEffect, useRef, useState } from 'react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../Select'
import { DateSelectProps } from '@/types'
import { CURRENT_YEAR, MIN_YEAR } from '@/lib/utils/constants'
import { days, months, years } from './values'

const DateSelect: FunctionComponent<DateSelectProps & { className: string }> = ({
    value,
    onChange,
    className,
    minYear = MIN_YEAR,
    maxYear = CURRENT_YEAR,
}) => {
    const [selectedMonth, setSelectedMonth] = useState(value ? months[value.getMonth()] : 'Month')
    const [selectedDay, setSelectedDay] = useState(value?.getDate().toString() ?? 'Day')
    const [selectedYear, setSelectedYear] = useState(value?.getFullYear().toString() ?? 'Year')

    const _years = [
        'Year',
        ...years.slice(years.indexOf(maxYear.toString()), years.indexOf(minYear.toString()) + 1),
    ]

    useEffect(() => {
        if (selectedMonth && selectedDay && selectedYear) {
            const date = new Date(
                parseInt(selectedYear),
                months.indexOf(selectedMonth) - 1,
                parseInt(selectedDay),
            )
            onChange(date)
        }
    }, [selectedMonth, selectedDay, selectedYear, onChange])

    const onMonthChange = (month: string) => {
        if (month === '') {
            return
        }

        setSelectedMonth(month)
    }

    const onDayChange = (day: string) => {
        if (day === '') {
            return
        }

        setSelectedDay(day)
    }

    const onYearChange = (year: string) => {
        if (year === '') {
            return
        }

        setSelectedYear(year)
    }

    const [monthSelectWidth, setMonthSelectWidth] = useState(
        'w-[var(--radix-select-trigger-width)]',
    )

    // Fixes the month SelectContent element not being wide enough on first render
    // BUG: sometimes this doesn't work and idk why right now
    const monthSelectTriggerRef = useRef<HTMLButtonElement | null>(null)

    useEffect(() => {
        if (monthSelectTriggerRef.current) {
            const width = String(monthSelectTriggerRef.current.clientWidth + 2) + 'px'
            setMonthSelectWidth(width)
        }
    }, [])

    if (minYear < MIN_YEAR) {
        throw new Error(`minYear cannot be less than ${MIN_YEAR}`)
    }

    if (maxYear > CURRENT_YEAR) {
        throw new Error(`maxYear cannot be greater than the current year`)
    }

    return (
        <div className="flex">
            <Select value={selectedMonth} onValueChange={onMonthChange}>
                <SelectTrigger
                    className={'w-full border-r-0 ' + className}
                    ref={monthSelectTriggerRef}
                >
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className={`w-[${monthSelectWidth}]`}>
                    {months.map((month, idx) => (
                        <SelectItem key={idx} value={month}>
                            {month}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={selectedDay} onValueChange={onDayChange}>
                <SelectTrigger className={'w-full border-r-0 ' + className}>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {days.map((day, idx) => (
                        <SelectItem key={idx} value={day}>
                            {day}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={onYearChange}>
                <SelectTrigger className={'w-full ' + className}>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {_years.map((year, idx) => (
                        <SelectItem key={idx} value={year}>
                            {year}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default DateSelect
