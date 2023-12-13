import React from 'react'
import { Product } from '@/app/types'
import Link from 'next/link'
import Image from 'next/image'
interface Props {
    product: Product
}
const ProductCard = ({ product }: Props) => {
    return (
        <Link className='product-card' href={`/products/${product._id}`}>
            <div className='product-card_img-container'>
                <Image src={product.img} alt={product.img} width={200} height={200} className='product-card_img' />
            </div>
            <div className='flex flex-col gap-3 '>
                <h3 className='product-title'>{product.title}</h3>
                <div className='flex justify-between'>
                    <p className='text-black opacity-50 text-lg capitalize'>{product.category}
                    </p>
                    <p>
                        <span className='text-black text-lg font-semibold'>Rs.{product.currentPrice}
                        </span>
                    </p>
                </div>
            </div>
        </Link>

    )
}

export default ProductCard