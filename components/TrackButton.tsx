'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { getUser } from '@/lib/actions'
const TrackButton = () => {
  const { id } = useParams()
  const [buttonText, setButtonText] = useState('Track')
  const [tracking, setTracking] = useState(false)
  const [errCode, setErrCode] = useState(0)
  const trackProduct = async () => {
    setButtonText("Adding...")
    try {
      const res = await axios.post('/api/users/addToTrackedProducts', { productID: id })
      if (res.status === 200) {
        toast('Product added to tracked products !', {
          duration: 3000,
          position: 'bottom-center',
          icon: '✅'
        })
      }
      setButtonText("Tracking ✅")
      setTracking(true)
    } catch (error: any) {
      if (error.response.status === 403) {
        toast('Product already under tracking !', {
          duration: 5000,
          position: 'bottom-center',
          icon: '📊'
        })
      }
      setButtonText("Tracking ✅")
      setTracking(true)
    }

  }
  const removeFromTracking = async () => {
    const res = await axios.post('/api/users/removeFromTracking', { productID: id })
    if (res.status === 200) {
      toast('Removed from tracking', {
        duration: 3000,
        position: 'bottom-center',
        icon: '✅'
      })
    }
    setButtonText("Track")
    setTracking(false)
  }
  useEffect(() => {
    const isTracking = async () => {
      const userDetails = await getUser()
      const user = JSON.parse(userDetails!)
      const trackedProducts = user.trackedProducts
      const isProduct = trackedProducts.some((prod: any) => prod._id === id)
      if (isProduct) {
        setButtonText("Tracking ✅")
        setTracking(true)
      }
    }
    isTracking()
  }, [id])
  return (
    <>
      <button className='btn bg-secondary w-fit mx-auto flex items-center justify-center min-w-[200px]' onClick={trackProduct}>
        {buttonText}
      </button>
      {tracking && (
        <button className='btn bg-red-600 w-fit mx-auto flex items-center justify-center min-w-[200px]' onClick={removeFromTracking}>
          Remove
        </button>
      )}
      <Toaster />
    </>

  )
}

export default TrackButton