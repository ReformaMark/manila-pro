import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useMutation } from 'convex/react'
import { MessageSquare } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useRouter } from 'next/navigation'

export default function SendMessageDialog({agentId}: {agentId: Id<'users'>}) {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [ message, setMessage] = useState<string>('')
    const sendMessage = useMutation(api.messsages.sendMessage)
    const {user, isLoading} = useCurrentUser()
    const router = useRouter()
    const handleSubmit =  () => {
        toast.promise(sendMessage({
            receiverId: agentId,
            content: message
        }),{
            loading: "Sending...",
            success: "Sent.",
            error: "Failed to send your messsage."
        })

        setMessage('')
        setDialogOpen(false)
    }
  return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <Button
                onClick={() => user ? setDialogOpen(true) : router.push('/auth')}
                variant="outline"
                className="w-full border-brand-orange text-brand-orange hover:bg-brand-orange/10"
            >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
            </Button>
         
            <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Message Agent</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <Textarea
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi Maria, I'm interested in this property and would like to know more about..."
                className="min-h-[120px]"
                />
            </div>
            <DialogFooter>
                <Button type="submit" onClick={handleSubmit} className="bg-brand-orange hover:bg-brand-orange/90">
                Send Message
                </Button>
            </DialogFooter>
            </DialogContent>
    </Dialog>
  )
}
