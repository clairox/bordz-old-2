import DeleteAccountForm from '@/components/Forms/DeleteAccountForm'
import Heading from '@/components/UI/Heading'
import { Section } from '@/components/UI/Section'
import { Trash } from '@phosphor-icons/react/dist/ssr'
import React from 'react'

const Page = () => {
    return (
        <div>
            <Heading>
                <Trash size={40} weight="regular" />
                Delete Account
            </Heading>
            <Section>
                <DeleteAccountForm />
            </Section>
        </div>
    )
}

export default Page
