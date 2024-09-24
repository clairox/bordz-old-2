'use client'
import React, { LegacyRef, forwardRef, useEffect, useRef, useState } from 'react'
import SearchForm from '../Forms/SearchForm'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'

const SearchBar = () => {
    const [isFormActive, setIsFormActive] = useState(false)
    const formRef: LegacyRef<HTMLFormElement> = useRef(null)
    const recentSearchesRef = useRef(null)

    useEffect(() => {
        const callback = (event: MouseEvent) => {
            const form = formRef.current
            const recentSearches = recentSearchesRef.current
            if (form == undefined || !isFormActive) {
                return
            }

            if (
                !event.composedPath().includes(form) &&
                ((recentSearches && !event.composedPath().includes(recentSearches)) ||
                    recentSearches == undefined)
            ) {
                setIsFormActive(false)
            }
        }

        document.addEventListener('click', callback)

        return () => document.removeEventListener('click', callback)
    }, [isFormActive])

    const router = useRouter()

    const initiateSearch = (value: string) => {
        setSearchValue(value)
        setIsFormActive(false)
        router.push('/search?q=' + value)
    }
    const [searchValue, setSearchValue] = useState('')

    return (
        <div className="relative h-full">
            <div className="flex h-full border-l border-b border-black">
                <SearchForm
                    ref={formRef}
                    value={searchValue}
                    isActive={isFormActive}
                    setIsActive={value => setIsFormActive(value)}
                    initiateSearch={initiateSearch}
                />
                <button
                    onClick={() => setIsFormActive(!isFormActive)}
                    className="flex justify-center items-center h-full"
                >
                    <div className="px-[18px]">
                        {isFormActive ? (
                            <X size={28} weight="light" />
                        ) : (
                            <MagnifyingGlass size={28} weight="light" />
                        )}
                    </div>
                </button>
            </div>
            {isFormActive && (
                <RecentSearchesMenu ref={recentSearchesRef} onSelect={initiateSearch} />
            )}
        </div>
    )
}

type RecentSearchesMenuProps = {
    onSelect: (value: string) => void
}

const RecentSearchesMenu = forwardRef<HTMLDivElement, RecentSearchesMenuProps>(
    ({ onSelect }, ref) => {
        const [recentSearches, setRecentSearches] = useState<string[]>([])
        const recentSearchesLength = 10

        useEffect(() => {
            const savedRecentSearches = JSON.parse(localStorage.getItem('search') || '[]')
            setRecentSearches(savedRecentSearches.slice(0, recentSearchesLength))
        }, [])

        useEffect(() => {
            localStorage.setItem(
                'search',
                JSON.stringify(recentSearches.slice(0, recentSearchesLength)),
            )
        }, [recentSearches])

        if (recentSearches.length === 0) {
            return <></>
        }

        return (
            <div
                ref={ref}
                className="absolute z-50 top-16 w-full border-x border-b border-black bg-white flex flex-col"
            >
                <div className="pr-5 py-[6px] text-end">
                    <button onClick={() => setRecentSearches([])} className="hover:underline">
                        Clear
                    </button>
                </div>
                {recentSearches.map((item, idx) => {
                    return (
                        <div
                            onClick={() => onSelect(item)}
                            className="flex justify-start align-items px-5 py-[6px] text-gray-500 hover:bg-gray-100"
                            key={idx + item}
                        >
                            <p className="cursor-default">{item}</p>
                        </div>
                    )
                })}
            </div>
        )
    },
)

RecentSearchesMenu.displayName = 'RecentSearchesMenu'

export default SearchBar
