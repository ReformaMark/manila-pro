import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog'
import { Mail, Phone, PhoneCall } from 'lucide-react'
import React, { useState } from 'react'
import { AgentType } from '@/lib/types'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CallDialog({agent}: {agent: AgentType}) {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [copyStates, setCopyStates ] = useState({
        phone: false,
        email: false
    })
    const copyUrl = (text: string, type: 'phone' | 'email') => {
        navigator.clipboard.writeText(text).then(() => {
            setCopyStates(prev => ({ ...prev, [type]: true }));
            setTimeout(() => {
                setCopyStates(prev => ({ ...prev, [type]: false }));
            }, 2000);
        });
    }
  return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <Button
                onClick={()=> setDialogOpen(true) }
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
                <Phone className="h-4 w-4 mr-2" />
                Contact
            </Button>
         
            <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Contact Agent</DialogTitle>
            </DialogHeader>
              <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
            <CardTitle className="text-gray-900">{agent.fname} {agent.lname}</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
                <Button
                onClick={() => copyUrl(agent.contact, "phone")}
                variant="outline"
                className="w-full justify-start border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                    <PhoneCall className="h-4 w-4 mr-2 text-brand-orange" />
                    {copyStates.phone ? "Copied!" : agent.contact}
                </Button>

                <Button
                onClick={() => copyUrl(agent.email, "email")}
                variant="outline"
                className="w-full justify-start border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                    <Mail className="h-4 w-4 mr-2 text-brand-orange" />
                    {copyStates.email ? "Copied!" : agent.email}
                </Button>

              
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Office Address:</span>
                </div>
                <p className="text-gray-700 text-sm">
                    {agent.agentInfo?.officeAddress
                        ? agent.agentInfo.officeAddress
                        : "No office address provided"}
                </p>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Working Hours:</span>
                </div>
                <p className="text-gray-700 text-sm">
                    {agent.agentInfo?.workingHours?.days || agent.agentInfo?.workingHours?.hours
                        ? <>
                            {agent.agentInfo?.workingHours?.days || "Days not specified"}
                            <br />
                            {agent.agentInfo?.workingHours?.hours || "Hours not specified"}
                          </>
                        : "No working hours provided"}
                </p>
            </div>
            </CardContent>
        </Card>
            <DialogFooter>
                <Button type="button" onClick={()=> setDialogOpen(false)} className="bg-brand-orange hover:bg-brand-orange/90">
                    Close
                </Button>
            </DialogFooter>
            </DialogContent>
    </Dialog>
  )
}
