"use client"
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Filter } from 'lucide-react'
import React from 'react'

interface AgentFiltersProps {
    location: string;
    handleFilterChange: (key: string, value: any) => void;
    locations: string[];
    specialization: string;
    specializations: string[];
    setIsFilterOpen: (value: boolean) => void;
    isFilterOpen: boolean;
    sort: string; 
    yearsExp: string[];
    languages: string[];
    tempLanguages: string[];
    handleSeach: () => void;
    handleReset: () => void;
}
function AgentFilters({
    location, 
    handleFilterChange,
    locations,
    specialization,
    specializations,
    setIsFilterOpen,
    isFilterOpen,
    sort,
    yearsExp,
    languages,
    tempLanguages,
    handleSeach,
    handleReset

}: AgentFiltersProps) {
  return (
    <div className="mb-6">
    <div className="flex flex-col md:flex-row gap-4 justify-between">
      <div className="flex flex-wrap gap-2">
        <Select value={location} onValueChange={(value)=>{handleFilterChange("location", value)}}>
          <SelectTrigger className="w-[160px] bg-white border-gray-300 text-gray-900">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 text-gray-900">
            {locations
              .map((location) => (
                <SelectItem key={location} value={location} className="focus:bg-gray-100 focus:text-gray-900">
                  {location}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <Select value={specialization} onValueChange={(value)=> {handleFilterChange("specialization", value)}}>
          <SelectTrigger className="w-[200px] bg-white border-gray-300 text-gray-900">
            <SelectValue placeholder="Specialization" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 text-gray-900">
            <SelectItem value="All Specializations" className="focus:bg-gray-100 focus:text-gray-900">
              All Specializations
            </SelectItem>
            {specializations.map((specialization) => (
              <SelectItem
                key={specialization}
                value={specialization}
                className="focus:bg-gray-100 focus:text-gray-900"
              >
                {specialization}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="gap-2 border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Filter className="h-4 w-4" />
          More Filters
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Sort by:</span>
        <Select value={sort} onValueChange={(value)=> {handleFilterChange("sort", value)}}>
          <SelectTrigger className="w-[160px] bg-white border-gray-300 text-gray-900">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 text-gray-900">
            <SelectItem value="Highest Rating" className="focus:bg-gray-100 focus:text-gray-900">
              Highest Rating
            </SelectItem>
            <SelectItem value="Most Experience" className="focus:bg-gray-100 focus:text-gray-900">
              Most Experience
            </SelectItem>
            <SelectItem value="Most Transactions" className="focus:bg-gray-100 focus:text-gray-900">
              Most Transactions
            </SelectItem>
            <SelectItem value="Name (A-Z)" className="focus:bg-gray-100 focus:text-gray-900">
              Name (A-Z)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    {isFilterOpen && (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Experience</h3>
            <div className="space-y-2">
              <RadioGroup defaultValue="0"  onValueChange={(value) => {handleFilterChange("yearsOfExperience", Number(value))}}>
                {yearsExp.map((exp)=> (
                  <div key={exp} className="flex items-center space-x-2">
                    <RadioGroupItem value={exp.toLowerCase() !== "any experience" ? exp : "0"} id={exp} className="h-4 w-4 text-brand-orange rounded border-gray-300 focus:ring-brand-orange" />
                    <Label htmlFor={exp}>{exp}{exp.toLowerCase() !== "any experience" ? "+ Years" : ""}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Languages</h3>
            <div className="space-y-2">
            
              {languages.map((language)=> (
                <div key={language} className="flex items-center space-x-2">
                  <Checkbox 
                    id={language} 
                    name={language}
                    onCheckedChange={(checked)=> { 
                      if (checked === true) {
                        handleFilterChange("languages", [...tempLanguages, language]);
                      } else if (checked === false) {
                        handleFilterChange("languages", tempLanguages.filter((lang) => lang !== language));
                      }
                    }}
                  />
                  <Label
                    htmlFor={language}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {language}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button
            onClick={handleReset}
            variant="outline" className="border-gray-300 text-gray-700">
            Reset Filters
          </Button>
          <Button onClick={handleSeach} className="bg-brand-orange hover:bg-brand-orange/90 text-white">Apply Filters</Button>
        </div>
      </div>
    )}
  </div>
  )
}

export default AgentFilters