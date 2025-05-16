import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"

export const useUnreadMessage = () => {
    const data = useQuery(api.conversations.getUnreadMessagesNumber)
    const isLoading = data === undefined

    return {
        count: data,
        isLoading,
    }
}