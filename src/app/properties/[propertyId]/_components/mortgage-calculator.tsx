'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { PropertyTypesWithImageUrls } from '@/lib/types'
import { calculateLoanDetails, formatPrice } from '@/lib/utils'
import React, { useState } from 'react'

interface MortgageCalculatorProps {
    property: PropertyTypesWithImageUrls
}
function MortgageCalculator({property}:MortgageCalculatorProps) {
    const [loanTerm, setLoanTerm] = useState<string>("20")
    const [interestRate, setInterestRate] = useState<string>("6.0")
    const propertyPrice =  property.totalSellingPrice
    const downpayment = propertyPrice * 0.2
   
    const totals = calculateLoanDetails(propertyPrice, downpayment, loanTerm, interestRate)
  return (
    <Card className="border border-gray-200 shadow-sm">
    <CardHeader>
      <CardTitle className="text-gray-900">Mortgage Calculator</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Property Price</label>
          <div className="relative">
        
            <input
              type="text"
              value={formatPrice(property.totalSellingPrice)}
              className="w-full bg-white border border-gray-300 rounded-md py-2 px-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange"
              readOnly
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Down Payment (20%)</label>
          <div className="relative">
            <input
              type="text"
              value={formatPrice(downpayment)}
              className="w-full bg-white border border-gray-300 rounded-md py-2 px-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange"
              readOnly
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-1 block">Loan Term</Label>
         
          <Select defaultValue={loanTerm} onValueChange={(value) => {

            setLoanTerm(value)
          }}>
            <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange">
                <SelectValue placeholder="Select Loan Term" />
            </SelectTrigger>
           
            <SelectContent>
              <SelectItem value="15">15 years</SelectItem>
              <SelectItem value="20">20 years</SelectItem>
              <SelectItem value="30">30 years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-1 block">Interest Rate</Label>
          <Select defaultValue={interestRate} onValueChange={(value) => {
            setInterestRate(value)
          }}>
            <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange">
                <SelectValue placeholder="Select Interest Rate" />
            </SelectTrigger>
           
            <SelectContent>
              <SelectItem value="4.5">4.5%</SelectItem>
              <SelectItem value="5.0">5.0%</SelectItem>
              <SelectItem value="5.5">5.5%</SelectItem>
              <SelectItem value="6.0">6.0%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator className="bg-gray-200" />

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-700">Monthly Payment:</span>
            <span className="text-lg font-bold text-brand-orange">{totals.monthlyPayment}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Total Loan Amount:</span>
            <span>{totals.totalLoanAmount}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Total Interest:</span>
            <span>{totals.totalInterest}</span>
          </div>
        </div>

        <Button className="w-full bg-brand-orange hover:bg-brand-orange/90">Apply for Pre-approval</Button>
      </div>
    </CardContent>
  </Card>
  )
}

export default MortgageCalculator