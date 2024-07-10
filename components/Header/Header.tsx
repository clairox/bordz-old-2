import Link from 'next/link'
import NavMenu from './NavMenu/NavMenu'
import CartButton from './Actions/CartButton/CartButton'
import AccountButton from './Actions/AccountButton/AccountButton'
import WishlistButton from './Actions/WishlistButton/WishlistButton'
import SearchBar from './SearchBar/SearchBar'
import Image from 'next/image'

const Header: React.FunctionComponent = () => {
	return (
		<header className="flex justify-center h-16 border-b border-black">
			<div className="flex justify-between w-full max-w-[1440px]">
				<div className="header-left flex h-full">
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
