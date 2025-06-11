"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, MessageSquare, MenuIcon } from "lucide-react"
import { cn, formatDateListed } from "@/lib/utils"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Doc, Id } from "../../../convex/_generated/dataModel"
import Loading from "@/components/loading"
import { useCurrentUser } from "@/hooks/use-current-user"
import { AgentType, ConversationType } from "@/lib/types"
import { useIsMobile } from "@/hooks/use-mobile"
import ChatArea from "./_components/chat-area"

export default function MessagesPage() {
    const isMobile = useIsMobile()
    const conversations = useQuery(api.conversations.conversations)
    const markAsRead = useMutation(api.conversations.markAsRead)
    const sendMessage = useMutation(api.messsages.sendMessage)
    const {user: currentUser} = useCurrentUser()
    const [selectedConversation, setSelectedConversation] = useState<Id<'conversations'> | null>(null)
    const [reciever, setReciever] = useState<AgentType | undefined>()
    const [messageText, setMessageText] = useState("")
    const [searchConversationText, setSearchConversationText] = useState("")
    const [showConversationList, setShowConversationList] = useState(true)
    const [filteredConversations, setFilteredConversations] = useState<ConversationType[]>([]);
 
    const messagesEndRef = useRef<HTMLDivElement>(null)


  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!messageText.trim() || !selectedConversation) return

    if(reciever?._id) {
        sendMessage({
            receiverId: reciever._id,
            content: messageText
        })
    }
      setMessageText("")
  }

  const handleConversationSelect = (conversationId: Id<'conversations'>) => {
    setSelectedConversation(conversationId)
    markAsRead({
        conversationId: conversationId
    })
 
  }

  const getOtherUser = (receiverId: Id<'users'>) => {
    const conversation = conversations?.find((conversation) => conversation.receiver._id === receiverId)
    if (conversation) {
      setReciever(conversation.receiver as AgentType)
    }
  }

  const getConversationMessages = (conversationsId: Id<'conversations'>) =>{
    const conversation = conversations?.find((conversation) => conversation._id === conversationsId)

    return conversation?.messages
  }

  useEffect(()=> {
    
    if(isMobile && selectedConversation) {
        setShowConversationList(false)
    } else {
        setShowConversationList(true)
    }
  }, [isMobile])


  useEffect(() => {
  if (!conversations) return;

  const lowerSearch = searchConversationText.toLowerCase();

  const filtered = conversations.filter((conversation) => {
    const { fname = "", lname = "" } = conversation.receiver || {};
    const fullName = `${fname} ${lname}`.toLowerCase();

    return fname.toLowerCase().includes(lowerSearch) ||
           lname.toLowerCase().includes(lowerSearch) ||
           fullName.includes(lowerSearch);
  });

  setFilteredConversations(filtered);
}, [searchConversationText, conversations, sendMessage]);


    if(!conversations) return <Loading/>
  
  return (
    <div className="container overflow-auto h-[90vh] "
   
    >
      {/* Main Content */}
        <div
            className={`transition-all duration-300 h-full flex max-h-[90vh] flex-col overflow-hidden`}
            
        >
            <div className="container  h-[100vh] mx-auto px-4 py-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between w-full">
                    <h1 className="text-2xl font-bold mb-6 text-gray-900">Messages</h1>
                    <Button type="button" onClick={() => {
                        setSelectedConversation(null)
                        setShowConversationList(true)
                    }} size={'icon'} className="flex lg:hidden items-center justify-center">
                        <MenuIcon/>
                    </Button>
            
                </div>

                <div className="flex rounded-lg bg-white border border-gray-200 shadow-sm min-h-[80vh] max-h-[80vh] ">
                {/* Conversation List */}
                {showConversationList && (
                <div className="w-full lg:w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-3 border-b border-gray-200">
                    <div className="relative">
                    <Input
                        onChange={(e)=> setSearchConversationText(e.target.value)}
                        placeholder="Search conversations..."
                        className="pl-9 bg-white border-gray-300 text-gray-900"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    {filteredConversations?.length > 0 ? (
                    <div>
                        {filteredConversations.map((conversation) => {
                        const otherUser = conversation.receiver
                        

                        return (
                            <div
                            key={conversation._id}
                            className={cn(
                                "p-3 hover:bg-gray-50 cursor-pointer transition-colors",
                                selectedConversation === conversation._id && "bg-gray-50",
                            )}
                            onClick={() => {
                                handleConversationSelect(conversation._id)
                                if(conversation.receiver._id) {
                                    getOtherUser(conversation.receiver._id)
                                }
                                if(isMobile) {
                                    setShowConversationList(false)
                                }
                            }}
                            >
                            <div className="flex items-center gap-3">
                                <Avatar>
                                <AvatarImage src={otherUser.imageUrl ?? undefined} alt={otherUser.lname} />
                                <AvatarFallback className="bg-brand-orange text-white">
                                    {otherUser.fname?.charAt(0)} 
                                    {otherUser.lname?.charAt(0)}
                                </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-medium text-gray-900 truncate">{otherUser.fname} {otherUser.lname}</h3>
                                    <span className="text-xs text-gray-500">
                                    {formatDateListed(conversation.messages[0]._creationTime)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center mt-1">
                                    <p className="text-sm text-gray-500 truncate">
                                    {conversation.messages[0].senderId === currentUser?._id ? "You: " : ""}
                                    {conversation.messages[0].content}
                                    </p>

                                    {conversation.unreadMessages > 0 && (
                                    <Badge className="bg-brand-orange text-white ml-2">
                                        {conversation.unreadMessages}
                                    </Badge>
                                    )}
                                </div>
                                </div>
                            </div>
                            </div>
                        )
                        })}
                    </div>
                    ) : (
                    <div className="p-6 text-center">
                        <p className="text-gray-500">No conversations yet</p>
                    </div>
                    )}
                </ScrollArea>
                </div>
                )}

                {/* Chat Area */}
                {selectedConversation  ? (
                    <ChatArea
                        isMobile={isMobile}
                        showConversationList={showConversationList}
                        handleSendMessage={handleSendMessage}
                        messageText={messageText}
                        setMessageText={setMessageText}
                        receiver={reciever}
                        setShowConversationList={setShowConversationList}
                        conversationMessages={getConversationMessages(selectedConversation)}
                        messagesEndRef={messagesEndRef}
                        currentUser={currentUser as AgentType}
                    />  
                ) : (
                    <div className={cn(isMobile && showConversationList ? "hidden"  : "flex" ,"w-full md:w-2/3 min-h-[70vh]  items-center justify-center")}>
                    <div className="text-center p-6">
                        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
                        <p className="text-gray-500">Select a conversation to start messaging</p>
                    </div>
                    </div>
                )}
                </div>
            </div>
        </div>
    </div>

  )
}

