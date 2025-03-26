"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Star, Phone, MessageSquare, Filter, Users, Building, Home } from "lucide-react"
import { motion } from "framer-motion"
import { AgentType } from "@/types/agents"
import { useIsMobile } from "@/hooks/use-mobile"
import { Agent } from "@/lib/types"
import { usePaginatedQuery, useQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RatingStars } from "@/components/rating-stars"
import Loading from "@/components/loading"
import AgentHero from "./agent-hero"
import AgentFilters from "./agent-filters"
import AgentList from "./agent-list"


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

