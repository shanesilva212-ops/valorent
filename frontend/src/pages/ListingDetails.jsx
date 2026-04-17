import React from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { ArrowLeftIcon, Loader2Icon } from 'lucide-react';

const ListingDetails = () => {

  const navigate = useNavigate()
  //const currency = import.meta.env.VITE_CURRENCY || '$'

  const {listingId} = useParams()
  const {listings} = useSelector((state)=>state.listing)
  const listing = React.useMemo(() => {
    if (!listings || !listingId) return null
    return listings.find((l) => String(l.id) === String(listingId)) ?? null
  }, [listingId, listings])

  return listing ? (
    <div className='mx-auto min-h-screen px-6 md:px-16 lg:px-24 xl:px-32'>
      <button onClick={()=> navigate(-1)} className='flex items-center gap-2 text-slate-600 py-5'>
        <ArrowLeftIcon className='size-4'/> Go to Previous Page
      </button>

    <div>
        
      <div/>
      
    </div>
  ) : (
    <div className='h-screen flex justify-center items-center'>
      <Loader2Icon className='size-7 animate-spin text-indigo-600'/>
    </div>
  )
}

export default ListingDetails
