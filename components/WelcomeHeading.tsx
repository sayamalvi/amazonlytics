import React from 'react'
import Image from 'next/image'
const WelcomeHeading = () => {
    return (
        <div className='flex items-center gap-6 w-full justify-center text-center flex-col my-20'>
            <p className='text-black text-5xl lg:text-7xl font-bold'>Welcome to
            </p>
            <div className='flex items-center gap-1 w-full justify-center text-center'>
                {/* <Image src='/assets/images/amazon.png' width={40} height={40} alt='logo' className='mx-3 border rounded-full' /> */}
                <p className='text-[#2A3645] text-3xl font-bold'>Amazon
                    <span className='text-[#FE9C09]'>lytics</span></p>
            </div>

        </div>
    )
}

export default WelcomeHeading