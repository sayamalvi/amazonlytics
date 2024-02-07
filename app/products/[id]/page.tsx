import { getProductById } from '@/lib/actions'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import PriceInfoCard from '@/components/PriceInfoCard'
import { getSimilarProducts } from '@/lib/actions'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/app/types'
import TrackButton from '@/components/TrackButton'
import PriceChart from '@/components/PriceChart'
type Props = {
    params: { id: string }
}

const ProductDetails = async ({ params: { id } }: Props) => {
    const product = await getProductById(id)
    if (!product) redirect('/')
    const similarProducts = await getSimilarProducts(id)
    const chartData = product.priceHistory.map((price: any) => ({ x: price.date.toLocaleString().split(',')[0], y: price.price }))
    const chart = {
        labels: chartData.map((data: any) => data.x),
        datasets: [
            {
                label: "Price History",
                data: chartData.map((data: any) => data.y)
            }
        ]
    }
    return (
        <div className='product-container'>
            <div className='flex gap-28 xl:flex-row flex-col'>
                <div>
                    <Image className='mx-auto' src={product.img} alt={product.title} width={400} height={400} />
                </div>
                <div className='flex-1 flex flex-col'>
                    <div className='flex justify-between items-start gap-5 flex-wrap pb-6'>
                        <div className='flex flex-col gap-3'>
                            <p className='text-[28px] text-secondary font-semibold'>{product.title}</p>
                            <Link href={product.url} target="_blank" className='text-base text-black opacity-50'>
                                Check on Amazon
                            </Link>
                        </div>
                        <div className='flex items-center gap-3'>
                            <div className='product-hearts'>
                                <Image src='/assets/icons/red-heart.svg' alt='heart' width={20} height={20} />
                                <p className='text-base font-semibold text-[#D46F77]'>{product.reviewCount}
                                    {product.reviewCount > 1 ? ' ratings' : ' rating'} </p>
                            </div>
                        </div>
                    </div>
                    <div className='product-info'>
                        <div className='flex flex-col gap-2'>
                            <p className='text-[21px] text-black font-bold'>Rs. {product?.currentPrice}</p>
                            <p className='text-[21px] text-black opacity-50 line-through'>Rs. {product?.originalPrice}</p>
                        </div>
                        <div className='flex flex-col gap-4'>
                            <div className='flex gap-3'>
                                <div className='product-stars'>
                                    <Image src='/assets/icons/star.svg' alt='star' height={16} width={16} />
                                    <p className='text-sm text-primary-orange font-semibold'>{product.reviewRating}</p>
                                </div>
                            </div>
                        </div>
                        <div className='w-auto flex flex-row lg:items-start lg:content-start lg:self-start gap-4'>
                            <TrackButton />
                        </div>
                        <div className='my-7 flex flex-col gap-5'>
                            <div className='flex gap-5 flex-wrap'>
                                <PriceInfoCard
                                    title='Current Price'
                                    iconSrc='/assets/icons/price-tag.svg'
                                    value={`Rs. ${product.currentPrice}`}
                                />
                                <PriceInfoCard
                                    title='Average Price'
                                    iconSrc='/assets/icons/chart.svg'
                                    value={`Rs. ${product.averagePrice}`}
                                />
                                <PriceInfoCard
                                    title='Highest Price'
                                    iconSrc='/assets/icons/arrow-up.svg'
                                    value={`Rs. ${product.highestPrice}`}
                                />
                                <PriceInfoCard
                                    title='Lowest Price'
                                    iconSrc='/assets/icons/arrow-down.svg'
                                    value={`Rs. ${product.lowestPrice}`}
                                />
                            </div>
                        </div>
                    </div>
                    {/* <Modal /> */}
                </div>
            </div>
            <div className='flex flex-col gap-10 '>
                <div className='flex flex-col gap-5 '>
                    <h3 className='text-2xl text-secondary font-semibold'>Product Description</h3>
                    <div className='flex flex-col gap-4'>
                        {product?.description.length >= 10 ? product.description : 'No description found'}
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-10'>
                <h3 className='text-2xl text-secondary font-semibold'>Price History</h3>
                <div className='self-center'>
                    <PriceChart priceData={chart} />
                </div>
            </div>
            {similarProducts && similarProducts?.length > 0 && (
                <div className='flex flex-col gap-2 w-full'>
                    <p className='section-text'>Similar Products</p>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {similarProducts?.map((pr: Product) => (
                            <ProductCard key={pr._id} product={pr} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductDetails