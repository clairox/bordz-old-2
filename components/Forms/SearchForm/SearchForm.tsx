'use client'
import { Form, FormControl, FormField, FormItem } from '@/components/UI/Form'
import { useRouter } from 'next/navigation'
import { forwardRef, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
    search: string
}

type SearchFormProps = {
    value: string
    isActive: boolean
    setIsActive: (value: boolean) => void
    initiateSearch: (value: string) => void
}

const SearchForm = forwardRef<HTMLFormElement, SearchFormProps>(
    ({ value, isActive, setIsActive, initiateSearch }, ref) => {
        const router = useRouter()

        const form = useForm<FormData>({
            defaultValues: {
                search: '',
            },
        })

        useEffect(() => {
            form.setValue('search', value)
        }, [value, form])

        const searchInputRef = useRef<HTMLInputElement | null>(null)
        useEffect(() => {
            if (searchInputRef == undefined) {
                return
            }

            if (isActive) {
                searchInputRef.current?.focus()
            } else {
                searchInputRef.current?.blur()
            }
        }, [isActive])

        const onSubmit = async (data: FormData) => {
            if (data.search === '') {
                return
            }

            const history: string[] = JSON.parse(localStorage.getItem('search') || '[]')
            let updatedHistory
            if (!history.includes(data.search)) {
                updatedHistory = [data.search, ...history]
                localStorage.setItem('search', JSON.stringify(updatedHistory))
            }

            initiateSearch(data.search)
        }

        return (
            <Form {...form}>
                <form
                    ref={ref}
                    role="search"
                    autoComplete="off"
                    onClick={() => setIsActive(true)}
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="relative flex flex-col w-full h-full"
                >
                    <div className="flex w-full h-full">
                        <div className="w-full h-full">
                            <FormField
                                control={form.control}
                                name="search"
                                render={({ field }) => (
                                    <FormItem className="w-full h-full">
                                        <FormControl>
                                            <input
                                                {...field}
                                                ref={searchInputRef}
                                                className="pl-4 w-full h-full pr-0 outline-none"
                                                type="text"
                                                placeholder="Search for skate stuff"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </form>
            </Form>
        )
    },
)

SearchForm.displayName = 'SearchForm'

export default SearchForm
