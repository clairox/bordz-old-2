import PersonalInfoForm from '@/components/Forms/PersonalInfoForm'
import Heading from '@/components/UI/Heading'
import { Section } from '@/components/UI/Section'
import { User } from '@phosphor-icons/react/dist/ssr'
import React from 'react'

const Page = () => {
    return (
        <>
            <Heading>
                <User size={40} weight="regular" />
                Personal Details
            </Heading>
            <Section>
                <PersonalInfoForm />
            </Section>
        </>
    )
}

export default Page
