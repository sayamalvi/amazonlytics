import React from 'react'
import ProductCard from '@/components/ProductCard'

const Searches = ({ searchedProducts }: { searchedProducts: any[] | null | undefined }) => {
    return (
        <section className='recent-section'>
            <h2 className='section-text'>Your recent searches</h2>
            <div className='flex flex-wrap gap-x-8 gap-y-16'>
                {searchedProducts?.length === 0 ? <div>
                    <h1 className='text-gray-500'>You have not searched anything yet</h1>
                </div> : searchedProducts?.map((product: any) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </section>
    )
}

export default Searches