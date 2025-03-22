import React from 'react'
import Hero from './_components/hero'
import SearchAndFilter from './_components/search-and-filter'
import FeaturedProperties from './_components/featured-properties'
import FeaturedAgents from './_components/featured-agents'

function Page() {
  return (
    <div className='px-3 md:px-10  '>
      <Hero/>
      <SearchAndFilter/>
      <FeaturedProperties/>
      <FeaturedAgents/>
    </div>
  )
}

export default Page