'use client '
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge, Grid, List, Search } from 'lucide-react'
import React from 'react'

export default function SidePanel() {

  return (
    <div className="md:w-96 p-4 overflow-y-auto border-r">
        <div className="mb-4">
            <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search properties..." className="pl-10" />
            </div>
        </div>

        <Tabs defaultValue="list">
            <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Properties (24)</h2>
            <TabsList>
                <TabsTrigger value="list">
                <List className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="grid">
                <Grid className="h-4 w-4" />
                </TabsTrigger>
            </TabsList>
            </div>

            <TabsContent value="list" className="space-y-4 mt-0">
            {[1, 2, 3, 4, 5].map((item) => (
                <Card key={item} className="overflow-hidden">
                <div className="flex">
                    <div className="w-24 h-24 bg-muted relative">
                    <div className="absolute top-2 left-2">
                        <Badge className="bg-emerald-500">For Sale</Badge>
                    </div>
                    </div>
                    <CardContent className="p-3 flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                        <h3 className="font-medium">Rice Field {item}</h3>
                        <p className="text-sm text-muted-foreground">San Miguel, Manila</p>
                        </div>
                        <p className="font-semibold text-emerald-600">₱2.5M</p>
                    </div>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                        <span className="mr-3">5.2 hectares</span>
                        <span>Irrigation ready</span>
                    </div>
                    </CardContent>
                </div>
                </Card>
            ))}
            </TabsContent>

            <TabsContent value="grid" className="grid grid-cols-2 gap-4 mt-0">
            {[1, 2, 3, 4, 5, 6].map((item) => (
                <Card key={item} className="overflow-hidden">
                <div className="h-32 bg-muted relative">
                    <div className="absolute top-2 left-2">
                    <Badge className="bg-emerald-500">For Sale</Badge>
                    </div>
                </div>
                <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                    <h3 className="font-medium">Rice Field {item}</h3>
                    <p className="font-semibold text-emerald-600">₱2.5M</p>
                    </div>
                    <p className="text-sm text-muted-foreground">San Miguel, Manila</p>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                    <span className="mr-3">5.2 hectares</span>
                    </div>
                </CardContent>
                </Card>
            ))}
            </TabsContent>
        </Tabs>
    </div>
  )
}