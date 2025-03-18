import { Loader2Icon } from 'lucide-react'
import React from 'react'

function Loading() {
  return (
    <div className=' size-full flex justify-center items-center'>
        <Loader2Icon className='animate-spin size-10'/>
    </div>
  )
}

export default Loading