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

function AgentContactCard({
    agent
}:{
    agent: AgentType
}) {
    const [messageText, setMessageText] = useState<string>("")
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const sendMessage = useMutation(api.messsages.sendMessage)
    const handleSendMessage = () =>{
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
                >
                <PhoneCall className="h-4 w-4 mr-2 text-brand-orange" />
                {agent.contact}
                </Button>

                <Button
                variant="outline"
                className="w-full justify-start border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                <Mail className="h-4 w-4 mr-2 text-brand-orange" />
                {agent.email}
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

                {/* <Dialog>
                <DialogTrigger asChild>
                    <Button
                    variant="outline"
                    className="w-full border-brand-orange text-brand-orange hover:bg-brand-orange/10"
                    >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Schedule Call
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Schedule a Call with {agent.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                    <p className="text-sm text-gray-500">
                        Select a date for your call. {agent.name} will confirm the time via message.
                    </p>
                    <div className="flex justify-center">
                        <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant="outline"
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !selectedDate && "text-gray-500",
                            )}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : "Select a date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                            disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                            />
                        </PopoverContent>
                        </Popover>
                    </div>
                    </div>
                    <div className="flex justify-end">
                    <Button
                        onClick={handleScheduleCall}
                        disabled={!selectedDate}
                        className="bg-brand-orange hover:bg-brand-orange/90 text-white"
                    >
                        Schedule Call
                    </Button>
                    </div>
                </DialogContent>
                </Dialog> */}
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Office Address:</span>
                </div>
                <p className="text-gray-700 text-sm">{agent.agentInfo?.officeAddress}</p>

                <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Working Hours:</span>
                </div>
                <p className="text-gray-700 text-sm">
                {agent.agentInfo?.workingHours?.days}
                <br />
                {agent.agentInfo?.workingHours?.hours}
                </p>
            </div>
            </CardContent>
        </Card>
    </div>
  )
}

export default AgentContactCard