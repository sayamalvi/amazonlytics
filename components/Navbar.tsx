'use client'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { useRouter, usePathname } from 'next/navigation'

const Navbar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const handleLogout = async () => {
    await axios.get('/api/users/logout')
    router.push('/login')
  }
  return (
    <header className='w-full'>
      <nav className='nav'>
        <Link href='/' className='flex items-center gap-1 w-full justify-center'>
          <Image src='/assets/images/amazon.png' width={40} height={40} alt='logo' className='mx-3 border rounded-full' />
          <p className='text-[#2A3645] text-3xl font-bold'>Amazon
            <span className='text-[#FE9C09]'>lytics</span></p>
        </Link>
        {pathname === '/login' || pathname === '/signup' ? '' : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </nav>
    </header>
  )
}

export default Navbar