import Link from 'next/link'
import Image from 'next/image'
import NavMenu from './NavMenu'
import SearchBar from './SearchBar'
import AccountButton from './Actions/AccountButton'
import CartButton from './Actions/CartButton'
import WishlistButton from './Actions/WishlistButton'

const Header: React.FunctionComponent = () => {
	return (
		<header className="z-100 flex justify-center h-16">
			<div className="flex justify-between w-full max-w-[1440px]">
				<div className="header-left flex h-full border-b border-black">
					<Link href={'/'} className="flex justify-center items-center w-40 h-full">
						<Image src="/bordz-brand-black.svg" alt="bordz logo" width="122" height="42" />
					</Link>
					<NavMenu />
				</div>
				<div className="header-middle w-full">
					<SearchBar />
				</div>
				<div className="header-right">
					<div className="header-actions flex h-full">
						<AccountButton />
						<WishlistButton />
						<CartButton />
					</div>
				</div>
			</div>
		</header>
	)
}

export default Header
