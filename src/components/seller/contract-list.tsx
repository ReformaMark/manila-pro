"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useConfirm } from "@/hooks/use-confirm";
import { useMutation, useQuery } from "convex/react";
import { Download, Eye, FileText, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Badge } from "../ui/badge";

interface ContractListProps {
  dealId: Id<"deal">;
  isOpen: boolean;
  onClose: () => void;
}

const documentTypeLabels: Record<string, string> = {
  contract: "Contract Agreement",
  payment_record: "Payment Record",
  deed_of_sale: "Deed of Sale",
  transfer_certificate: "Transfer Certificate",
  other: "Other Document",
};

export const ContractList = ({
  dealId,
  isOpen,
  onClose,
}: ContractListProps) => {
  const contracts = useQuery(api.deal.getContractsByDeal, { dealId });
  const deleteContract = useMutation(api.deal.deleteContract);
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Contract",
    "Are you sure you want to delete this contract? This action cannot be undone."
  );

  const handleDelete = async (documentId: Id<"document">, fileName: string) => {
    const confirmed = await confirm();
    if (!confirmed) return;

    const loadingToast = toast.loading("Deleting contract...");
    try {
      await deleteContract({ documentId });
      toast.dismiss(loadingToast);
      toast.success("Contract deleted successfully");
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Error deleting contract:", error);
      toast.error(
        error instanceof Error
          ? error.message.replace("Error: ", "")
          : "Failed to delete contract"
      );
    }
  };

  const handleDownload = async (url: string, documentType: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${documentType}_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      toast.success("Download started");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contracts & Documents</DialogTitle>
            <DialogDescription>
              View and manage all contracts and documents for this deal
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {contracts === undefined ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : contracts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No contracts uploaded</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Upload contracts using the "Upload Contract" button
                </p>
              </div>
            ) : (
              contracts.map((contract) => (
                <div
                  key={contract._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/10 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="h-8 w-8 text-orange-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">
                          {documentTypeLabels[contract.documentType] ||
                            contract.documentType}
                        </p>
                        {/* <Badge variant="outline" className="text-xs">
                          {contract.documentType}
                        </Badge> */}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Uploaded:{" "}
                        {new Date(contract._creationTime).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        contract.fileUrl &&
                        window.open(contract.fileUrl, "_blank")
                      }
                      title="View Document"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        contract.fileUrl &&
                        handleDownload(contract.fileUrl, contract.documentType)
                      }
                      title="Download Document"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleDelete(
                          contract._id,
                          documentTypeLabels[contract.documentType]
                        )
                      }
                      title="Delete Document"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmDialog />
    </>
  );
};
