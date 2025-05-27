import { useState } from "react";
import WatchViewer from "./WatchViewer";
import ComponentSelector from "./ComponentSelector";
import { useWatchStore } from "@/lib/stores/useWatchStore";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { calculateTotalPrice, ComponentType } from "@/data/watchComponents";
import { Share2, Download, RefreshCw, Undo2 } from "lucide-react";
import { useAudio } from "@/lib/stores/useAudio";
import ShareModal from "./ShareModal";
import ExportModal from "./ExportModal";
import { toast } from "sonner";

export default function WatchConfigurator() {
  const { config, setSelectedTab, selectedTab, resetConfig } = useWatchStore();
  const { playHit, playSuccess } = useAudio();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const totalPrice = calculateTotalPrice(config);

  const handleTabChange = (value: string) => {
    playHit();
    setSelectedTab(value as ComponentType);
  };

  const handleResetConfig = () => {
    resetConfig();
    playHit();
    toast.info("Configuration has been reset to default");
  };

  const handleShareClick = () => {
    setShareModalOpen(true);
    playSuccess();
  };

  const handleExportClick = () => {
    setExportModalOpen(true);
    playSuccess();
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Watch Viewer */}
      <div className="w-full lg:w-3/5 bg-white p-6 flex flex-col items-center justify-center">
        <WatchViewer />
      </div>

      {/* Configuration Panel */}
      <div className="w-full lg:w-2/5 bg-[#E5E5E5] border-l border-[#C9D8E4] p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#14213D] font-montserrat">Seiko Watch Customizer</h1>
          <Badge variant="outline" className="bg-[#FCA311] text-white px-4 py-2 text-sm font-medium">
            ${totalPrice.toFixed(2)}
          </Badge>
        </div>

        <div className="mb-4 flex space-x-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-white text-[#14213D] border-[#C9D8E4]"
            onClick={handleShareClick}
          >
            <Share2 size={16} />
            Share
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-white text-[#14213D] border-[#C9D8E4]"
            onClick={handleExportClick}
          >
            <Download size={16} />
            Export
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-white text-[#14213D] border-[#C9D8E4] ml-auto"
            onClick={handleResetConfig}
          >
            <RefreshCw size={16} />
            Reset
          </Button>
        </div>

        <Tabs defaultValue="case" value={selectedTab} onValueChange={handleTabChange} className="flex-1">
          <TabsList className="grid grid-cols-4 mb-6 bg-white">
            <TabsTrigger value="case" className="font-medium">Case</TabsTrigger>
            <TabsTrigger value="dial" className="font-medium">Dial</TabsTrigger>
            <TabsTrigger value="hands" className="font-medium">Hands</TabsTrigger>
            <TabsTrigger value="bezel" className="font-medium">Bezel</TabsTrigger>
          </TabsList>
          
          <TabsContent value="case" className="mt-0">
            <ComponentSelector type="case" />
          </TabsContent>
          
          <TabsContent value="dial" className="mt-0">
            <ComponentSelector type="dial" />
          </TabsContent>
          
          <TabsContent value="hands" className="mt-0">
            <ComponentSelector type="hands" />
          </TabsContent>
          
          <TabsContent value="bezel" className="mt-0">
            <ComponentSelector type="bezel" />
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-xs text-[#14213D] opacity-70 text-center">
          All prices are in USD. Customized watches are built to order.
        </div>
      </div>

      {/* Modals */}
      <ShareModal open={shareModalOpen} onOpenChange={setShareModalOpen} />
      <ExportModal open={exportModalOpen} onOpenChange={setExportModalOpen} />
    </div>
  );
}
