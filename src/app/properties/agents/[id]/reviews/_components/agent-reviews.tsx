"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useQuery } from "convex/react"
import { Star, ThumbsUp, ThumbsDown, MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { api } from "../../../../../../../convex/_generated/api"
import { Id } from "../../../../../../../convex/_generated/dataModel"
import { RatingStars } from "@/components/rating-stars"
import Loading from "@/components/loading"
import { formatDateListed } from "@/lib/utils"

interface Review {
  id: string
  user: {
    name: string
    avatar?: string
    initials: string
  }
  rating: number
  date: string
  title: string
  content: string
  helpful: number
  notHelpful: number
  verified: boolean
}

const reviews: Review[] = [
  {
    id: "1",
    user: {
      name: "Sarah Johnson",
      initials: "SJ",
    },
    rating: 5,
    date: "2 days ago",
    title: "Excellent support agent!",
    content:
      "Alex was incredibly helpful and resolved my issue quickly. Very knowledgeable and patient with all my questions. Highly recommend!",
    helpful: 12,
    notHelpful: 0,
    verified: true,
  },
  {
    id: "2",
    user: {
      name: "Michael Chen",
      initials: "MC",
    },
    rating: 4,
    date: "1 week ago",
    title: "Good experience overall",
    content:
      "The agent was professional and helped me understand the process. Response time could be faster, but the quality of help was good.",
    helpful: 8,
    notHelpful: 1,
    verified: true,
  },
  {
    id: "3",
    user: {
      name: "Emily Rodriguez",
      initials: "ER",
    },
    rating: 5,
    date: "2 weeks ago",
    title: "Outstanding service",
    content:
      "Went above and beyond to help me with a complex issue. Very thorough explanations and follow-up. Couldn't ask for better service!",
    helpful: 15,
    notHelpful: 0,
    verified: true,
  },
  {
    id: "4",
    user: {
      name: "David Kim",
      initials: "DK",
    },
    rating: 3,
    date: "3 weeks ago",
    title: "Average experience",
    content: "The agent was helpful but seemed rushed. Got my issue resolved but felt like I was being hurried along.",
    helpful: 3,
    notHelpful: 2,
    verified: false,
  },
]

const ratingBreakdown = [
  { stars: 5, count: 45, percentage: 65 },
  { stars: 4, count: 15, percentage: 22 },
  { stars: 3, count: 6, percentage: 9 },
  { stars: 2, count: 2, percentage: 3 },
  { stars: 1, count: 1, percentage: 1 },
]

export default function AgentReviews({agentId}:{agentId: string}) {
  const data = useQuery(api.ratings_reviews.getAgentRatingsAndReviews, {agentId: agentId as Id<'users'>})
  const [sortBy, setSortBy] = useState("newest")

  const totalReviews = data?.reviews.length ?? 0
  const averageRating = data?.rating ?? 0
  const reviews = data?.reviews ?? []

  if(!data) return <Loading/>

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Agent Header */}
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={data.agent.imageUrl ?? undefined} alt="Agent" />
          <AvatarFallback className="text-lg">{data.agent.fname.charAt(0)}{data.agent.lname.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold capitalize">{data.agent.fname} {data.agent.lname}</h1>
          <p className="text-muted-foreground">{data.agent.agentInfo?.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{data.agent.emailVerified ? "Verified Agent" : "Not Verified"}</Badge>
            <Badge variant="outline">{data.agent.agentInfo?.experience}</Badge>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Rating Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Overall Rating</CardTitle>
              <div className="space-y-2">
                <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
                <RatingStars edit={false} size={30} average={data.rating}/>
                <CardDescription>Based on {totalReviews} reviews</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {ratingBreakdown.map((item) => (
                <div key={item.stars} className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1 w-8">
                    <span>{item.stars}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <Progress value={item.percentage} className="flex-1" />
                  <span className="text-muted-foreground w-8 text-right">{item.count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Reviews ({totalReviews})</h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="highest">Highest rated</option>
              <option value="lowest">Lowest rated</option>
              <option value="helpful">Most helpful</option>
            </select>
          </div>

          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review._id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={review.user.imageUrl || "/placeholder.svg"} alt={review.user.lname} />
                      <AvatarFallback>{review.user.fname.charAt(0)} {review.user.lname.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium capitalize">{review.user.fname} {review.user.fname}</span>
                            {review.user.emailVerified && (
                              <Badge variant="outline" className="text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <RatingStars average={review.ratings} edit={false} size={10}/>
                            <span className="text-sm text-muted-foreground">{formatDateListed(review._creationTime)}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">{review.title}</h4>
                        <p className="text-muted-foreground">{review.content}</p>
                      </div>

                      <div className="flex items-center gap-4 pt-2">
                        <Button variant="ghost" size="sm" className="gap-2">
                          <ThumbsUp className="w-4 h-4" />
                          Helpful ({review.helpful})
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <ThumbsDown className="w-4 h-4" />
                          Not helpful ({review.notHelpful})
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline">Load more reviews</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
