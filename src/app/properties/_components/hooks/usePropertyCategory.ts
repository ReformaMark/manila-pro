import { useQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api"

export const usePropertyCategory = () =>{
    const categories = useQuery(api.property.unitType)
    const isLoading = categories === undefined

    return {
        categories,
        isLoading,
    }
}