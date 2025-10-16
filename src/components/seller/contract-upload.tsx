"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { FileText, Loader2, Upload, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

const contractUploadSchema = z.object({
  description: z.string().optional(),
});

type ContractUploadFormValues = z.infer<typeof contractUploadSchema>;

interface ContractUploadProps {
  dealId: Id<"deal">;
  isOpen: boolean;
  onClose: () => void;
}

export const ContractUpload = ({
  dealId,
  isOpen,
  onClose,
}: ContractUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.files.generateDocumentUploadUrl);
  const uploadContract = useMutation(api.deal.uploadContract);

  const form = useForm<ContractUploadFormValues>({
    resolver: zodResolver(contractUploadSchema),
    defaultValues: {
      description: "",
    },
  });

  // Fix pointer-events issue when dialog closes
  useEffect(() => {
    const removePointerEvents = () => {
      // Force remove pointer-events from body
      document.body.style.pointerEvents = "";
      // Also remove any data attributes that might be causing the issue
      document.body.style.removeProperty("pointer-events");
    };

    if (!isOpen) {
      // Immediate cleanup
      removePointerEvents();

      // Delayed cleanup to ensure it persists
      const timer1 = setTimeout(removePointerEvents, 0);
      const timer2 = setTimeout(removePointerEvents, 100);
      const timer3 = setTimeout(removePointerEvents, 300);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (PDF, DOCX, DOC)
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
      ];

      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a PDF or Word document");
        return;
      }

      // Validate file size (max 20MB)
      if (file.size > 20 * 1024 * 1024) {
        toast.error("File size must be less than 20MB");
        return;
      }

      setSelectedFile(file);
    }
  };

  const onSubmit = async (values: ContractUploadFormValues) => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    const loadingToast = toast.loading("Uploading contract...");

    try {
      // Step 1: Get upload URL
      const uploadUrl = await generateUploadUrl();

      // Step 2: Upload file to Convex storage
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });

      const { storageId } = await result.json();

      // Step 3: Save the contract record
      await uploadContract({
        dealId,
        storageId,
        documentType: "contract", // Default type since we removed the field
      });

      toast.dismiss(loadingToast);
      toast.success("Contract uploaded successfully");

      // Reset form
      form.reset();
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onClose();
    } catch (error) {
      console.error("Error uploading contract:", error);
      toast.dismiss(loadingToast);
      toast.error(
        error instanceof Error
          ? error.message.replace("Error: ", "")
          : "Failed to upload contract"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      form.reset();
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Force cleanup of pointer-events before closing
      document.body.style.pointerEvents = "";
      document.body.style.removeProperty("pointer-events");

      onClose();

      // Additional cleanup after state update
      setTimeout(() => {
        document.body.style.pointerEvents = "";
        document.body.style.removeProperty("pointer-events");
      }, 0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[500px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          // Force cleanup when dialog closes
          document.body.style.pointerEvents = "";
          document.body.style.removeProperty("pointer-events");
        }}
        onInteractOutside={(e) => {
          if (isUploading) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Upload Contract</DialogTitle>
          <DialogDescription>
            Upload contract agreements or payment records for this deal.
            Accepted formats: PDF, DOC, DOCX (Max 20MB)
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">File *</label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {selectedFile ? "Change File" : "Select File"}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploading}
                />
              </div>

              {selectedFile && (
                <div className="flex items-center justify-between p-3 bg-gray-100 border border-gray-200 rounded-md">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText className="h-5 w-5 text-gray-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    disabled={isUploading}
                    className="ml-2 flex-shrink-0"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isUploading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!selectedFile || isUploading}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
