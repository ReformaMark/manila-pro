"use client";
import { RatingStars } from "@/components/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Agent } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

interface AgentProfileProps {
  agent: Agent;
}

function AgentProfile({ agent }: AgentProfileProps) {
  const [messageText, setMessageText] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleSendMessage = () => {
    // Handle sending the message here
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column - Photo and Basic Info */}
        <div className="md:w-1/4">
          <div className="relative h-48 w-48 mx-auto md:mx-0 rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={agent.imageUrl || "/placeholder.svg"}
              alt={agent.lname}
              fill
              className="object-cover"
            />
          </div>

          <div className="mt-4 text-center md:text-left">
            <RatingStars average={agent.rating} edit={false} size={20} />

            <div className="flex items-center justify-center md:justify-start mt-2 text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              <span>
                {agent.street} {agent.barangay}, {agent.city}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
              {agent.agentInfo?.socialMedia?.facebook && (
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
              {agent.agentInfo?.socialMedia?.instagram && (
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
              {agent.agentInfo?.socialMedia?.linkedin && (
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
              {agent.agentInfo?.socialMedia?.twitter && (
                <Link
                  href={agent.agentInfo.socialMedia.twitter}
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
            </div>
          </div>
        </div>

        {/* Middle Column - Bio and Details */}
        <div className="md:w-2/4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {agent.fname} {agent.lname}
            </h1>
          </div>
          <p className="text-lg text-gray-700">
            {agent.agentInfo?.title} at {agent.agentInfo?.agency}
          </p>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-sm text-gray-500">Experience</p>
              <p className="text-xl font-bold text-gray-900">
                {agent.agentInfo?.experience} years
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-sm text-gray-500">Transactions</p>
              <p className="text-xl font-bold text-gray-900">
                {agent.transactions}+
              </p>
            </div>
            {/* <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-500">Active Listings</p>
            <p className="text-xl font-bold text-gray-900">{agent.activeListings}</p>
          </div> */}
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-900">About</h3>
            <p className="mt-2 text-gray-700">{agent.bio}</p>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Specializations
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {agent.agentInfo?.specializations?.map((specialization) => (
                <Badge
                  key={specialization}
                  variant="outline"
                  className="bg-gray-50 text-gray-700 border-gray-300"
                >
                  {specialization}
                </Badge>
              ))}
            </div>
          </div>

          {/* <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-900">Areas Served</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {agent.areasServed?.map((area) => (
              <Badge key={area} variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">
                <MapPin className="h-3 w-3 mr-1" />
                {area}
              </Badge>
            ))}
          </div>
        </div> */}

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Languages</h3>
              <div className="mt-2">
                <p className="text-gray-700">
                  {agent.agentInfo?.languages?.join(", ")}
                </p>
              </div>
            </div>
            {/* <div>
            <h3 className="text-lg font-semibold text-gray-900">License</h3>
            <div className="mt-2">
              <p className="text-gray-700">{agent.licenseNumber}</p>
            </div>
          </div> */}
          </div>
        </div>

        {/* Right Column - Contact Card */}
        <div className="md:w-1/4">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">
                Contact {agent.fname}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  <Phone className="h-4 w-4 mr-2 text-brand-orange" />
                  {agent.contact}
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  <Mail className="h-4 w-4 mr-2 text-brand-orange" />
                  {agent.email}
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Message {agent.fname}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <p className="text-sm text-gray-500">
                        Send a direct message to {agent.fname}. They typically
                        respond within 24 hours.
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
                <p className="text-gray-700 text-sm">
                  {agent.agentInfo?.officeAddress ||
                    "Office address not available"}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Working Hours:</span>
                </div>
                <p className="text-gray-700 text-sm">
                  {agent.agentInfo?.workingHours?.days || "Days not specified"}
                  <br />
                  {agent.agentInfo?.workingHours?.hours ||
                    "Hours not specified"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AgentProfile;
