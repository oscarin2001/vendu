"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NotificationsTab } from "./components/NotificationsTab";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

export function NotificationsModal({
  isOpen,
  onClose,
  userId,
}: NotificationsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Notificaciones</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[60vh]">
          <NotificationsTab userId={userId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
