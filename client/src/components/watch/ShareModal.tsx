import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useWatchStore } from "@/lib/stores/useWatchStore";
import { Copy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShareModal({ open, onOpenChange }: ShareModalProps) {
  const { config } = useWatchStore();
  const [copied, setCopied] = useState(false);
  
  // Create shareable URL with configuration in query parameters 
  const getShareableUrl = () => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams();
    
    Object.entries(config).forEach(([key, value]) => {
      params.append(key, value);
    });
    
    return `${baseUrl}?${params.toString()}`;
  };
  
  const shareableUrl = getShareableUrl();
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      
      // Reset copied state after 3 seconds
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#14213D]">Share Your Watch Design</DialogTitle>
          <DialogDescription>
            Anyone with this link will be able to view your custom watch design.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 mt-4">
          <Input
            readOnly
            value={shareableUrl}
            className="flex-1 text-sm text-[#14213D]"
          />
          <Button 
            type="button" 
            size="icon" 
            onClick={handleCopyLink}
            className={copied ? "bg-green-600 hover:bg-green-700" : "bg-[#14213D] hover:bg-[#14213D]/90"}
          >
            {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        
        <DialogFooter className="flex justify-end space-x-2 mt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-[#C9D8E4] text-[#14213D]"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
