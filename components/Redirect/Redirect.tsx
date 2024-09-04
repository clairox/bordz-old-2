import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type RedirectProps = {
    href: string
    replace: boolean
}

const Redirect: React.FunctionComponent<RedirectProps> = ({ href, replace }) => {
    const router = useRouter()

    useEffect(() => {
        if (replace) {
            router.replace(href)
        } else {
            router.push(href)
        }
    }, [href, replace, router])

    return <></>
}

export default Redirect
