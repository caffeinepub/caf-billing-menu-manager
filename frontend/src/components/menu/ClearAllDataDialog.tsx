import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useClearAllData } from "../../hooks/useQueries";
import { toast } from "sonner";

export default function ClearAllDataDialog() {
  const [open, setOpen] = useState(false);
  const clearMutation = useClearAllData();

  const handleConfirm = async () => {
    try {
      await clearMutation.mutateAsync();
      setOpen(false);
      toast.success("All data cleared successfully. The app is ready for a fresh start.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to clear data. Please try again."
      );
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="h-9 gap-1.5"
        >
          <Trash2 size={14} />
          Clear All Data
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear All Data?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <span className="block">
              This will <strong>permanently delete</strong> all data including:
            </span>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>All finalized orders and sales history</li>
              <li>All menu items and categories</li>
              <li>All user profiles</li>
            </ul>
            <span className="block mt-2 font-medium text-destructive">
              This action cannot be undone.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={clearMutation.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={clearMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {clearMutation.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin mr-1.5" />
                Clearing…
              </>
            ) : (
              "Yes, Clear Everything"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
