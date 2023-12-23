'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
const TrackButton = () => {
  const { id } = useParams()
  const [buttonText, setButtonText] = useState('Track')
  const [errCode, setErrCode] = useState(0)
  const trackProduct = async () => {
    setButtonText("Adding to tracked products...")
    try {
      const res = await axios.post('/api/users/addToTrackedProducts', { productID: id })
      toast('Product added to tracked products !', {
        duration: 3000,
        position: 'bottom-center',
        icon: '✅'

      })
    } catch (error: any) {
      if (error.response.status === 403) {
        toast('Product already under tracking !', {
          duration: 5000,
          position: 'bottom-center',
          icon: '📊'
        })
      }
    }
    setButtonText("Track")
  }
  return (
    <>
      <button className='btn w-fit mx-auto flex items-center justify-center min-w-[200px]' onClick={trackProduct}>
        {buttonText}
      </button>
      <Toaster />
    </>

  )
}

export default TrackButton