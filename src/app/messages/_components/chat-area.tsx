import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area'
import { AgentType } from '@/lib/types';
import { cn, formatDateListed } from '@/lib/utils'
import { MoreVertical, Send } from 'lucide-react';
import React from 'react'
import { Doc, Id } from '../../../../convex/_generated/dataModel';
import { Textarea } from '@/components/ui/textarea';

function ChatArea({
    isMobile,
    showConversationList,
    handleSendMessage,
    messageText,
    setMessageText,
    receiver,
    setShowConversationList,
    conversationMessages,
    messagesEndRef,
    currentUser
}:{
    isMobile: boolean;
    showConversationList: boolean;
    handleSendMessage: (e: React.FormEvent) => void;
    messageText: string;
    setMessageText: (value: string) => void;
    receiver: AgentType | undefined;
    setShowConversationList: (value: boolean) => void;
    conversationMessages: Doc<'messages'>[] | undefined;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    currentUser: AgentType | undefined;
}) {

    React.useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [conversationMessages]);
  return (
    <div className={cn(
        (isMobile && showConversationList) ? "hidden" : "flex flex-col min-h-[80vh] max-h-[80vh]",
        "w-full md:w-2/3 h-screen"
    )}>
        {/* Chat Header */}
        <div className="p-3 border-b border-gray-200 flex items-center justify-between ">
            <div className="flex items-center gap-3">
            <Avatar>
                <AvatarImage
                src={receiver?.imageUrl ?? undefined}
                alt={receiver?.lname}
                />
                <AvatarFallback className="bg-brand-orange text-white">
                {receiver?.fname.charAt(0)}
                {receiver?.lname.charAt(0)}
                </AvatarFallback>
            </Avatar>

            <div>
                <h3 className="font-medium text-gray-900">{receiver?.fname} {receiver?.fname}</h3>
                <p className="text-xs text-gray-500">
                {receiver?.role === "seller" ? "Real Estate Agent" : "User"}
                </p>
            </div>
            </div>

            <div className="flex items-center gap-1">
            
            <Button onClick={() => setShowConversationList(true)} variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900 hover:bg-gray-100">
                <MoreVertical className="h-5 w-5" />
            </Button>
            </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 bg-gray-100 h-[65vh] ">
          
            <div className="flex flex-col-reverse justify-start h-[63vh]">
            {conversationMessages?.map((message) => {
                const isCurrentUser = message.senderId === currentUser?._id

                return (
                <div key={message._id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                    <div className="flex items-end gap-2 max-w-[80%]">
                    <div>
                        <div
                        className={cn(
                            "rounded-lg px-4 py-2 inline-block",
                            isCurrentUser
                            ? "bg-brand-orange text-white rounded-br-none"
                            : "bg-white text-gray-900 rounded-bl-none",
                        )}
                        >
                        <pre className='font-normal text-wrap'>{message.content}</pre>
                        </div>

                        <div
                        className={`text-xs text-gray-500 mt-1 ${isCurrentUser ? "text-right" : "text-left"}`}
                        >
                        {formatDateListed(message._creationTime)}
                        </div>
                    </div>
                    </div>
                </div>
                )
            })}
            <div ref={messagesEndRef} />
            </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-3 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Textarea
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="bg-white border-gray-300 text-gray-900"
            />
            <Button
                type="submit"
                className="bg-brand-orange hover:bg-brand-orange/90 text-white"
                disabled={!messageText.trim()}
            >
                <Send className="h-4 w-4" />
            </Button>
            </form>
        </div>
    </div>
  )
}

export default ChatArea