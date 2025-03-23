'use client'
import FeaturedProperties from './featured-properties'
import FeaturedAgents from './featured-agents'
import Hero from './hero'

function Featured() {

  return (
    <div className='contents'>
        <Hero/>
        {/* <SearchAndFilter/> */}
        <div className="" id='featured-properties'>
          <FeaturedProperties/>
        </div>
        <div className="" id='agents'>

        <FeaturedAgents/>
        </div>
    </div>
  )
}

export default Featured