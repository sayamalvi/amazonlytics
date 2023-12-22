'use client'
import React from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation'
const TrackButton = () => {
  const { id } = useParams()
  const trackProduct = async () => {
    await axios.post('/api/users/addToTrackedProducts', { productID: id })

  }
  return (
    <button className='btn w-fit mx-auto flex items-center justify-center min-w-[200px]' onClick={trackProduct}>
      Track
    </button>
  )
}

export default TrackButton