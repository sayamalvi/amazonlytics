'use client'
import { scrapeAndStore } from '@/lib/actions/index'
import axios from 'axios'
import React from 'react'
const SearchBar = () => {
    const [searchPrompt, setSearchPrompt] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const isValidURL = (url: string) => {
        try {
            const parsedURL = new URL(url)
            const hostname = parsedURL.hostname
            if (hostname.includes('amazon.in') || hostname.endsWith('amazon')) return true
        } catch (error) {
            console.log(error)
            return false
        }
        return false
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const isValid = isValidURL(searchPrompt)
        if (!isValid) return alert('Please enter a valid Amazon product link')
        try {
            setLoading(true)
            await scrapeAndStore(searchPrompt)
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <form className='flex flex-wrap gap-4 mt-12' onSubmit={handleSubmit}>
            <input className='searchbar-input' type='text' placeholder='Search for a product' value={searchPrompt} onChange={(e) => setSearchPrompt(e.target.value)} />
            <button type='submit' className='searchbar-btn' disabled={searchPrompt === ''}>{loading ? 'Searching...' : "Search"}</button>
        </form>
    )
}

export default SearchBar