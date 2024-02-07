'use client'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { useRouter, usePathname } from 'next/navigation'
import { getUser } from '@/lib/actions'
import { useEffect, useState } from 'react'
const Navbar = () => {
  const pathname = usePathname()
  const [path, setPath] = useState(pathname)
  const router = useRouter()
  const handleLogout = async () => {
    try {
      await axios.post('/api/users/logout')
      router.replace("/login")
      router.refresh()
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    setPath(pathname)
  }, [path])
  return (
    <header className='w-full'>
      <nav className='nav'>
        <Link href='/' className='flex items-center gap-1 w-full justify-center'>
          <Image src='/assets/images/amazon.png' width={40} height={40} alt='logo' className='mx-3 border rounded-full' />
          <p className='text-[#2A3645] text-3xl font-bold'>Amazon
            <span className='text-[#FE9C09]'>lytics</span></p>
        </Link>
        {/* <p>Hi {userDetails.username}</p> */}
        {pathname === '/login' || pathname === '/signup' ? '' : (
          <button onClick={handleLogout} className='text-sm font-extralight'>Logout</button>
        )}
      </nav>
    </header>
  )
}

export default Navbar