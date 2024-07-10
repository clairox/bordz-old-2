'use client'
import Image from 'next/image'

const ProductGallery: React.FunctionComponent<{
	images: {
		src: string
		width: number
		height: number
	}[]
}> = ({ images }) => {
	if (images.length > 0) {
		return (
			<Image
				src={images[0].src}
				alt="product image"
				width={images[0].width}
				height={images[0].height}
			></Image>
		)
	}
	return <></>
}

export default ProductGallery
