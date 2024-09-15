'use client'

import DateSelect from '@/components/UI/DateSelect'
import { useState } from 'react'

const Page = () => {
    const [date, setDate] = useState<Date | undefined>(undefined)

    return (
        <main>
            <p>Date: {date?.toUTCString() ?? 'Invalid Date'}</p>
            <DateSelect value={date} onChange={setDate} />
        </main>
    )
}

export default Page
