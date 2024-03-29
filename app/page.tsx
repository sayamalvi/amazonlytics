import React from 'react'
import Image from 'next/image'
import SearchBar from '@/components/SearchBar'
import HeroCarousel from '@/components/HeroCarousel'
import { getSearchedProducts } from '@/lib/actions'
import ProductCard from '@/components/ProductCard'
import toast, { Toaster } from 'react-hot-toast'
import { getUser } from '@/lib/actions'

const Home = async () => {
  const searchedProducts = await getSearchedProducts()
  const userDetails = await getUser()
  // const user = JSON.parse(userDetails!)
  return (
    <>
      <section className='px-6 md:px-20 py-4'>
        <div className='flex max-xl:flex-col gap-16'>
          <div className='flex flex-col justify-center overflow-x-hidden'>
            {/* <p className='small-text'>Smart Shopping starts here
              <Image src='/assets/icons/arrow-right.svg' width={16} height={16}
                alt='arrow-right' />
            </p> */}
            <h1 className='head-text lg:text-8xl'>Save your pockets with real time price tracking by
            </h1>
            <p className='text-[#2A3645] text-5xl lg:text-8xl font-bold inline my-3'>
              Amazon
              <span className='text-[#FE9C09]'>lytics</span>
            </p>
            <p className='mt-6 text-md lg:text-4xl text-gray-500'>Track, Save, Shop - Never Miss a Price Drop on Amazon!</p>
            <SearchBar />
          </div>
          {/* <HeroCarousel /> */}
        </div>
      </section>
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
    </>
  )
}
export default Home