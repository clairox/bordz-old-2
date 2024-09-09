'use client'
import { Button } from '@/components/UI/Button'
import Heading from '@/components/UI/Heading'
import { Section } from '@/components/UI/Section'
import { useAccount } from '@/context/AccountContext/AccountContext'
import { Customer } from '@/types/store'
import { Gear } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import React from 'react'

const Page = () => {
    const { data: customer } = useAccount()

    const router = useRouter()

    const handleDeleteAccountButtonClick = () => {
        router.push('/account/delete-account')
    }

    return (
        <>
            <Heading>
                <Gear size={40} weight="regular" />
                <span>Settings</span>
            </Heading>
            <div>
                <Section>
                    <Section.Heading>
                        Personal Details
                        <Section.Heading.ActionLink href={'/account/personal-details'}>
                            Edit
                        </Section.Heading.ActionLink>
                    </Section.Heading>
                    <Section.Content>
                        <p className="font-semibold">Email</p>
                        <p className="mb-3">{customer?.email}</p>

                        <p className="font-semibold">First name</p>
                        <p className="mb-3">{customer?.firstName}</p>

                        <p className="font-semibold">Last name</p>
                        <p>{customer?.lastName}</p>
                    </Section.Content>
                </Section>
                <Section>
                    <Section.Heading>
                        Addresses
                        <Section.Heading.ActionLink href={'/account/addresses'}>
                            Edit
                        </Section.Heading.ActionLink>
                    </Section.Heading>
                    <Section.Content>
                        {customer?.defaultAddress == undefined ? (
                            <p>No home address saved.</p>
                        ) : (
                            <p>Address</p>
                        )}
                    </Section.Content>
                </Section>
                <Section>
                    <Section.Heading>Delete Account</Section.Heading>
                    <Button onClick={handleDeleteAccountButtonClick}>Delete Account</Button>
                </Section>
            </div>
        </>
    )
}

export default Page
