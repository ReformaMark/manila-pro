'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Filter, Search } from 'lucide-react'
import React from 'react'

function SearchAndFilter() {
  return (
    <Card className="border border-gray-200 shadow-sm mb-8">
    <CardContent className="p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Input
            placeholder="Search featured properties..."
            className="pl-10 bg-white border-gray-300 text-gray-900"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="location">
            <SelectTrigger className="w-[160px] bg-white border-gray-300 text-gray-900">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 text-gray-900">
              <SelectItem value="location" className="focus:bg-gray-100 focus:text-gray-900">
                All Locations
              </SelectItem>
              <SelectItem value="makati" className="focus:bg-gray-100 focus:text-gray-900">
                Makati
              </SelectItem>
              <SelectItem value="taguig" className="focus:bg-gray-100 focus:text-gray-900">
                Taguig
              </SelectItem>
              <SelectItem value="pasay" className="focus:bg-gray-100 focus:text-gray-900">
                Pasay
              </SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="price">
            <SelectTrigger className="w-[160px] bg-white border-gray-300 text-gray-900">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 text-gray-900">
              <SelectItem value="price" className="focus:bg-gray-100 focus:text-gray-900">
                Any Price
              </SelectItem>
              <SelectItem value="0-10m" className="focus:bg-gray-100 focus:text-gray-900">
                ₱0 - ₱10M
              </SelectItem>
              <SelectItem value="10m-20m" className="focus:bg-gray-100 focus:text-gray-900">
                ₱10M - ₱20M
              </SelectItem>
              <SelectItem value="20m-50m" className="focus:bg-gray-100 focus:text-gray-900">
                ₱20M - ₱50M
              </SelectItem>
              <SelectItem value="50m+" className="focus:bg-gray-100 focus:text-gray-900">
                ₱50M+
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="gap-2 border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
  )
}

export default SearchAndFilter