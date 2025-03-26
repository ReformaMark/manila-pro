export interface AgentType {
    id: string
    name: string
    title: string
    agency: string
    photo: string
    phone: string
    email: string
    location: string
    bio: string
    specializations: string[]
    languages: string[]
    experience: number
    transactions: number
    rating: number
    reviews: number
    socialMedia: {
      facebook?: string
      instagram?: string
      linkedin?: string
      twitter?: string
    }
    certifications: string[]
    awards: string[]
    
  }
  
  