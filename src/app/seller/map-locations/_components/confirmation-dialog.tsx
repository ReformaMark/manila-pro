// components/ConfirmLocationDialog.tsx

"use client";

import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmLocationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  coordinates: [number, number];
}

export function ConfirmLocationDialog({ open, onClose, onConfirm, coordinates }: ConfirmLocationDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="z-[1000]">
        <DialogHeader>
          <DialogTitle>Confirm Property Location</DialogTitle>
          <DialogDescription>
            You have selected the following coordinates:
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <p><strong>Latitude:</strong> {coordinates[0].toFixed(6)}</p>
          <p><strong>Longitude:</strong> {coordinates[1].toFixed(6)}</p>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
