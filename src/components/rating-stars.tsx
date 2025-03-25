'use client'
import React, { useState } from 'react'
import ReactStars from 'react-stars'

interface RatingStarsProps {
    average?: number 
    edit: boolean,
    size: number
}
export function RatingStars({average , edit, size}: RatingStarsProps) {
  const [rating, setRating] = useState(average ? average : 0)
  const [editable, setEditable] = useState<boolean>(edit)
  const [hidden, setHidden] = useState<boolean>(true)

  // Catch Rating value
  const handleOnChange = (newRating: number)=>{
    if(editable){
      setHidden(false)
      setRating(newRating)
    } else {
      setHidden(true)
    }
  }

  return (
    <div className=''>
      <ReactStars count={5} size={size} value={rating} onChange={handleOnChange} edit={editable} half={true} />
    </div>
  )
}