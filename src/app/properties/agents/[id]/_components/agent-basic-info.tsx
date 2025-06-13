"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AgentType } from "@/lib/types";
import { useQuery } from "convex/react";
import { Flag, MapPin, Share2, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { api } from "../../../../../../convex/_generated/api";
import { toast } from "sonner";

function AgentBasicInfo({ agent }: { agent: AgentType }) {
  const [isCopied, setIsCopied] = useState(false);
  const agentRatingsAndReviews = useQuery(
    api.ratings_reviews.getAgentRatingsAndReviews,
    { agentId: agent._id }
  );

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };
  return (
    <div className="md:w-1/4">
      <div className="flex items-center justify-center relative h-48 w-48 mx-auto md:mx-0 rounded-lg overflow-hidden border border-gray-200">
        {agent.imageUrl ? (
          <Image
            src={agent.imageUrl}
            alt={agent.lname}
            fill
            className="object-cover"
          />
        ) : (
          <p className=" text-center text-muted-foreground">
            No uploaded image.
          </p>
        )}
      </div>

      <div className="mt-4 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start">
          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          <span className="ml-1 font-bold text-gray-900">
            {agentRatingsAndReviews?.rating}
          </span>
          <span className="ml-1 text-gray-500">
            ({agentRatingsAndReviews?.reviews.length} reviews)
          </span>
        </div>

        <div className="flex items-center justify-center md:justify-start mt-2 text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{agent.city}</span>
        </div>

        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
          {agent.agentInfo?.socialMedia &&
          (agent.agentInfo.socialMedia.facebook ||
            agent.agentInfo.socialMedia.instagram ||
            agent.agentInfo.socialMedia.linkedin ||
            agent.agentInfo.socialMedia.X) ? (
            <>
              {agent.agentInfo.socialMedia.facebook && (
                <Link
                  href={agent.agentInfo.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full border-gray-300"
                  >
                    <FaFacebook className="h-4 w-4 text-gray-700" />
                  </Button>
                </Link>
              )}
              {agent.agentInfo.socialMedia.instagram && (
                <Link
                  href={agent.agentInfo.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full border-gray-300"
                  >
                    <FaInstagram className="h-4 w-4 text-gray-700" />
                  </Button>
                </Link>
              )}
              {agent.agentInfo.socialMedia.linkedin && (
                <Link
                  href={agent.agentInfo.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full border-gray-300"
                  >
                    <FaLinkedin className="h-4 w-4 text-gray-700" />
                  </Button>
                </Link>
              )}
              {agent.agentInfo.socialMedia.X && (
                <Link
                  href={agent.agentInfo.socialMedia.X}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full border-gray-300"
                  >
                    <FaTwitter className="h-4 w-4 text-gray-700" />
                  </Button>
                </Link>
              )}
            </>
          ) : (
            <span className="text-sm text-muted-foreground">
              No social media links provided.
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {/* <Button
                variant={isFollowing ? "default" : "outline"}
                className={cn(
                "w-full",
                isFollowing
                    ? "bg-brand-orange hover:bg-brand-orange/90 text-white"
                    : "border-brand-orange text-brand-orange hover:bg-brand-orange/10",
                )}
                onClick={handleFollowToggle}
            >
                {isFollowing ? <BookmarkCheck className="h-4 w-4 mr-2" /> : <Bookmark className="h-4 w-4 mr-2" />}
                {isFollowing ? "Following" : "Follow Agent"}
            </Button> */}

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="flex-1 border-gray-300 text-gray-700 hover:text-white"
              onClick={copyUrl}
            >
              {isCopied ? "Copied!" : <Share2 className="h-4 w-4" />}
            </Button>
            {/* <Dialog>
                <DialogTrigger asChild>
                    <Button
                    variant="outline"
                    size="icon"
                    className="flex-1 border-gray-300 text-gray-700 hover:text-gray-900"
                    >
                    <Flag className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Report this agent</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                    <p className="text-sm text-gray-500">
                        Please let us know why you're reporting this agent. Your report will be reviewed by our
                        team.
                    </p>
                    <Textarea placeholder="Describe the issue..." className="min-h-[100px]" />
                    </div>
                    <div className="flex justify-end">
                    <Button variant="destructive" onClick={()=>{}}>
                        Submit Report
                    </Button>
                    </div>
                </DialogContent>
                </Dialog> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentBasicInfo;
