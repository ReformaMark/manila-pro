"use client"

import { useState } from "react"
import AgentHero from "./agent-hero"
import AgentFilters from "./agent-filters"
import AgentList from "./agent-list"
import { usePaginatedQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api"


// Specializations for filtering
const specializations = [
  "Luxury Properties",
  "Condominiums",
  "Investment Properties",
  "Family Homes",
  "Townhouses",
  "First-time Buyers",
  "Penthouses",
  "Exclusive Listings",
  "Commercial Properties",
  "Office Spaces",
  "Retail Locations",
  "Residential Properties",
  "Income-Generating Assets",
  "Property Portfolio Management",
]

// Locations for filtering
const locations = ["All Locations", "Makati", "Taguig", "Pasay"]
const yearsExp = ["any experience", "5", "10"]
const languages = ["English", "Filipino", "Chinese (Mandarin/Cantonese)"]
interface AgentFilter {
  searchTerm: string;
  location: string;
  specialization: string;
  yearsOfExperience: number;
  languages: string[];
  sort: string;
}
export default function FindAgents() {
  const initialFilter = {
    searchTerm: "",
    location: "All Locations",
    specialization: "All Specializations",
    yearsOfExperience: 0,
    languages: [],
    sort: "Highest Rating",
  }

  const [filters, setFilters] = useState<AgentFilter>(initialFilter)
  const [ tempFilter, setTempFilter ] = useState<AgentFilter>(initialFilter)
  const { results, status, loadMore } = usePaginatedQuery(
    api.users.getAgents,
    {
      searchTerm: filters.searchTerm,
      location: filters.location,
      specialization: filters.specialization,
      yearsOfExperience: filters.yearsOfExperience,
      language: filters.languages,
      sort: filters.sort
    },
    { initialNumItems: 20 },
  );


  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleFilterChange = (key: string, value: any) => {
    if(key === "specialization" || key === "location" || key === "sort") {
      setTempFilter((prev) => ({
        ...prev,
        [key]: value,
      }))
      setFilters((prev) => ({
        ...prev,
        [key]: value
      }))

    } else {

      setTempFilter((prev) => ({
        ...prev,
        [key]: value,
      }))
    }
    }

  const handleSeach = () =>{
    setFilters(tempFilter)
  }

  const handleReset = () => {
    setFilters(initialFilter)
    setTempFilter(initialFilter)
  }

  return (
   
    <div className={`transition-all duration-300 bg-white`}>
      <div className="container mx-auto px-4 py-6">
         {/* Hero Section */}
        <AgentHero 
          searchTerm={tempFilter.searchTerm} 
          onChange={handleFilterChange} 
          onSearch={handleSeach}
        />
        {/* Filter and Sort */}
        <AgentFilters 
           location={filters.location}
           handleFilterChange={handleFilterChange}
           locations={locations}
           specialization={filters.specialization}
           specializations={specializations}
           setIsFilterOpen={setIsFilterOpen}
           isFilterOpen={isFilterOpen}
           sort={filters.sort}
           yearsExp={yearsExp}
           languages={languages}
           tempLanguages={tempFilter.languages}
           handleSeach={handleSeach}
           handleReset={handleReset}
        />
        {/* Agents List */}
        <AgentList 
          results={results}
          status={status}
          handleReset={handleReset}
          loadMore={loadMore}
        />
      </div>
    </div>
  )
}

