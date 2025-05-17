import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Id } from "../../convex/_generated/dataModel"


function UseMessage() {
    const conversations = () =>{
        const conversation = useQuery(api.conversations.conversations)
        const conversationLoading = conversation === undefined
        return {
            conversation,
            conversationLoading
        }
    }

    return {
        conversations
    }
}

export default UseMessage