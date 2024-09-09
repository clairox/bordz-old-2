import ChangePasswordForm from '@/components/Forms/ChangePasswordForm'
import Heading from '@/components/UI/Heading'
import { Section } from '@/components/UI/Section'
import { Lock } from '@phosphor-icons/react/dist/ssr'
import React from 'react'

const Page = () => {
    return (
        <div>
            <Heading>
                <Lock size={40} weight="regular" />
                Change Password
            </Heading>
            <Section>
                <ChangePasswordForm />
            </Section>
        </div>
    )
}

export default Page
