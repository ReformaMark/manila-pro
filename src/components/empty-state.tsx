"use client";

import { motion } from "framer-motion";
import { Button, buttonVariants } from "./ui/button";
import { MessageSquareOff } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  href?: string;
}

export const EmptyState = ({
  actionLabel,
  description,
  onAction,
  title,
  href,
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col w-full h-[60vh] items-center justify-center p-8"
    >
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-12 shadow-xl max-w-md w-full border border-purple-100">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-200 rounded-full blur-xl opacity-70"></div>
            <div className="relative bg-gradient-to-br from-orange-500 to-amber-300 p-4 rounded-full">
              <MessageSquareOff size={40} className="text-white" />
            </div>
          </div>

          <motion.h2
            className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {title}
          </motion.h2>

          <motion.p
            className="text-gray-600 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {description}
          </motion.p>

          {href && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Link
                href={href!}
                className={cn(
                  "bg-gradient-to-r from-orange-500 to-amber-300 hover:from-orange-600 hover:to-amber-400 text-white shadow-lg font-medium",
                  buttonVariants({
                    variant: "default",
                  })
                )}
              >
                {actionLabel}
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
