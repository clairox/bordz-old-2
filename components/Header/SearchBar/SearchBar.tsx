'use client'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import React, { useState } from 'react'

// TODO: Search bar should cover nav menu when active
const SearchBar = () => {
	const [active, setActive] = useState(false)

	const handleInputClick = () => {
		setActive(true)
	}
	return (
		<form className="flex w-full h-full border-l border-b border-black" role="search">
			<input
				className="pl-4 w-full h-full pr-0 mr-0"
				type="text"
				placeholder="Search for skate stuff"
				onClick={handleInputClick}
			/>
			<div className="flex justify-center items-center px-8 w-14 h-full">
				<button>
					{active ? <X size={28} weight="light" /> : <MagnifyingGlass size={28} weight="light" />}
				</button>
			</div>
		</form>
	)
}

export default SearchBar
