import React from 'react'
import Image from 'next/image'
import SearchBar from '@/components/SearchBar'
import HeroCarousel from '@/components/HeroCarousel'
import { getSearchedProducts } from '@/lib/actions'
import ProductCard from '@/components/ProductCard'

const Home = async () => {
  const searchedProducts = await getSearchedProducts()
  return (
    <>
      <section className='px-6 mx:px-20 py-4'>
        <div className='flex max-xl:flex-col gap-16'>
          <div className='flex flex-col justify-center'>
            {/* <p className='small-text'>Smart Shopping starts here
              <Image src='/assets/icons/arrow-right.svg' width={16} height={16}
                alt='arrow-right' />
            </p> */}
            <h1 className='head-text'>Save your pockets with real time price tracking by <p className='text-[#2A3645] text-6xl font-bold'>Amazon
              <span className='text-[#FE9C09]'>lytics</span></p></h1>
            <p className='mt-6'>Powerful, self-serve product and growth to help you convert, engage and retain more.</p>
            <SearchBar />
          </div>
          {/* <HeroCarousel /> */}
        </div>
      </section>
      <section className='trending-section'>
        <h2 className='section-text'>Your recent searches</h2>
        <div className='flex flex-wrap gap-x-8 gap-y-16'>
          {searchedProducts.length === 0 ? <div>
            <h1 className='text-gray-500 px-2'>You have not searched anything yet</h1>
          </div> : searchedProducts?.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}

        </div>
      </section>
    </>
  )
}

export default Home