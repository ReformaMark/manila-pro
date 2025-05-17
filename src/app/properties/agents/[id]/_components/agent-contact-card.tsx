import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Popover } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { AgentType } from '@/lib/types'
import { useMutation } from 'convex/react'
import { CalendarIcon, Mail, MessageSquare, PhoneCall } from 'lucide-react'
import React, { useState } from 'react'
import { api } from '../../../../../../convex/_generated/api'
import { toast } from 'sonner'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useRouter } from 'next/navigation'

function AgentContactCard({
    agent
}:{
    agent: AgentType
}) {
    const {user, isLoading} = useCurrentUser()
    const router = useRouter()
    const [messageText, setMessageText] = useState<string>("")
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const sendMessage = useMutation(api.messsages.sendMessage)
    const [copyStates, setCopyStates ] = useState({
        phone: false,
        email: false
    })
    const handleSendMessage = () =>{
        if(!user) {
            router.push('/auth')
        }
        toast.promise(sendMessage({
            receiverId: agent._id,
            content: messageText
        }),{
            loading: "Sending...",
            success: "Sent.",
            error: "Failed to send your messsage."
        })

        setMessageText('')
        setDialogOpen(false)
    }

   
    const copyUrl = (text: string, type: 'phone' | 'email') => {
        navigator.clipboard.writeText(text).then(() => {
            setCopyStates(prev => ({ ...prev, [type]: true }));
            setTimeout(() => {
                setCopyStates(prev => ({ ...prev, [type]: false }));
            }, 2000);
        });
    }
  return (
    <div className="md:w-1/4">
        <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
            <CardTitle className="text-gray-900">Contact {agent.lname}</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
                <Button
                    variant="outline"
                    className="w-full justify-start border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => copyUrl(agent.contact, 'phone')}
                >
                    <PhoneCall className="h-4 w-4 mr-2 text-brand-orange" />
                    {agent.contact}
                    <span className="ml-auto text-xs text-green-600">
                        {copyStates.phone ? "Copied!" : ""}
                    </span>
                </Button>

                <Button
                    variant="outline"
                    className="w-full justify-start border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => copyUrl(agent.email, 'email')}
                >
                    <Mail className="h-4 w-4 mr-2 text-brand-orange" />
                    {agent.email}
                    <span className="ml-auto text-xs text-green-600">
                        {copyStates.email ? "Copied!" : ""}
                    </span>
                </Button>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Message {agent.lname}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                    <p className="text-sm text-gray-500">
                        Send a direct message to {agent.lname}. They typically respond within 24 hours.
                    </p>
                    <Textarea
                        placeholder="Type your message here..."
                        className="min-h-[100px]"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                    />
                    </div>
                    <div className="flex justify-end">
                    <Button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                        className="bg-brand-orange hover:bg-brand-orange/90 text-white"
                    >
                        Send Message
                    </Button>
                    </div>
                </DialogContent>
                </Dialog>

            
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
    </div>
  )
}

export default AgentContactCard