import Image from 'next/image'
import Link from 'next/link'
import { isAuthenticated } from '@/lib/utils/ssr'
import AccountNavAction from '@/components/AccountNavAction'
import SavedNavAction from '@/components/SavedNavAction'
import CartNavAction from '@/components/CartNavAction'
import NavMenu from '@/components/NavMenu'
import SearchBar from '@/components/SearchBar'

const Navbar: React.FunctionComponent = () => {
    const isLoggedIn = isAuthenticated()
    return (
        <header className="z-100 flex justify-center h-16">
            <div className="flex justify-between w-full max-w-[1440px]">
                <div className="header-left flex h-full border-b border-black">
                    <Link href={'/'} className="flex justify-center items-center w-40 h-full">
                        <Image
                            src="/bordz-brand-black.svg"
                            alt="bordz logo"
                            width="122"
                            height="42"
                        />
                    </Link>
                    <NavMenu />
                </div>
                <div className="header-middle w-full">
                    <SearchBar />
                </div>
                <div className="header-right">
                    <div className="header-actions flex h-full">
                        <AccountNavAction isAuthenticated={isLoggedIn} />
                        <SavedNavAction />
                        <CartNavAction />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar
