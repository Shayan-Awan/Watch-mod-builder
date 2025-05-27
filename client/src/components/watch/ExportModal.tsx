import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWatchStore } from "@/lib/stores/useWatchStore";
import { watchComponents } from "@/data/watchComponents";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ExportModal({ open, onOpenChange }: ExportModalProps) {
  const { config } = useWatchStore();
  
  // Get selected component details
  const getComponentDetails = (type: keyof typeof watchComponents, id: string) => {
    return watchComponents[type].find(component => component.id === id);
  };
  
  const selectedCase = getComponentDetails('case', config.case);
  const selectedDial = getComponentDetails('dial', config.dial);
  const selectedHands = getComponentDetails('hands', config.hands);
  const selectedBezel = getComponentDetails('bezel', config.bezel);
  
  // Calculate total price
  const calculateTotal = () => {
    let total = 0;
    
    if (selectedCase) total += selectedCase.price;
    if (selectedDial) total += selectedDial.price;
    if (selectedHands) total += selectedHands.price;
    if (selectedBezel) total += selectedBezel.price;
    
    return total.toFixed(2);
  };
  
  // Generate parts list as CSV
  const generatePartsList = () => {
    const headers = "Component,Name,Description,Price\n";
    let csv = headers;
    
    if (selectedCase) {
      csv += `Case,${selectedCase.name},${selectedCase.description},$${selectedCase.price.toFixed(2)}\n`;
    }
    
    if (selectedDial) {
      csv += `Dial,${selectedDial.name},${selectedDial.description},$${selectedDial.price.toFixed(2)}\n`;
    }
    
    if (selectedHands) {
      csv += `Hands,${selectedHands.name},${selectedHands.description},$${selectedHands.price.toFixed(2)}\n`;
    }
    
    if (selectedBezel) {
      csv += `Bezel,${selectedBezel.name},${selectedBezel.description},$${selectedBezel.price.toFixed(2)}\n`;
    }
    
    csv += `\nTotal,,,\$${calculateTotal()}`;
    
    return csv;
  };
  
  // Handle export for parts list
  const handleExport = () => {
    const csv = generatePartsList();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'seiko_watch_parts.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Parts list exported successfully");
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[#14213D]">Export Parts List</DialogTitle>
          <DialogDescription>
            Download a list of all components in your custom watch design for ordering.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <h3 className="font-medium text-[#14213D] mb-2">Selected Components</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-[#E5E5E5]">
              <div>
                <p className="font-medium text-[#14213D]">Case</p>
                <p className="text-sm text-[#14213D] opacity-70">{selectedCase?.name}</p>
              </div>
              <p className="text-[#14213D]">${selectedCase?.price.toFixed(2)}</p>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-[#E5E5E5]">
              <div>
                <p className="font-medium text-[#14213D]">Dial</p>
                <p className="text-sm text-[#14213D] opacity-70">{selectedDial?.name}</p>
              </div>
              <p className="text-[#14213D]">${selectedDial?.price.toFixed(2)}</p>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-[#E5E5E5]">
              <div>
                <p className="font-medium text-[#14213D]">Hands</p>
                <p className="text-sm text-[#14213D] opacity-70">{selectedHands?.name}</p>
              </div>
              <p className="text-[#14213D]">${selectedHands?.price.toFixed(2)}</p>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-[#E5E5E5]">
              <div>
                <p className="font-medium text-[#14213D]">Bezel</p>
                <p className="text-sm text-[#14213D] opacity-70">{selectedBezel?.name}</p>
              </div>
              <p className="text-[#14213D]">${selectedBezel?.price.toFixed(2)}</p>
            </div>
            
            <div className="flex justify-between items-center py-2 font-medium">
              <p className="text-[#14213D]">Total</p>
              <p className="text-[#14213D]">${calculateTotal()}</p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex space-x-2 mt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-[#C9D8E4] text-[#14213D]"
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleExport}
            className="bg-[#14213D] hover:bg-[#14213D]/90 text-white flex items-center gap-2"
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
