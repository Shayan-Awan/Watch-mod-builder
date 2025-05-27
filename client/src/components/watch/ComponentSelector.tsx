import { ComponentType, watchComponents } from "@/data/watchComponents";
import { useWatchStore } from "@/lib/stores/useWatchStore";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAudio } from "@/lib/stores/useAudio";

interface ComponentSelectorProps {
  type: ComponentType;
}

export default function ComponentSelector({ type }: ComponentSelectorProps) {
  const { config, setComponent, getSelectedComponent } = useWatchStore();
  const { playHit } = useAudio();
  
  const components = watchComponents[type];
  const selectedComponent = getSelectedComponent(type);
  
  const handleComponentSelect = (id: string) => {
    if (id !== config[type]) {
      setComponent(type, id);
      playHit();
    }
  };

  return (
    <div className="h-full">
      <h2 className="text-lg font-semibold text-[#14213D] mb-4 font-montserrat">Select {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
      
      {/* Selected component details */}
      {selectedComponent && (
        <div className="mb-4 p-4 bg-white rounded-md border border-[#C9D8E4]">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-[#14213D]">{selectedComponent.name}</h3>
              <p className="text-sm text-[#14213D] opacity-70 mt-1">{selectedComponent.description}</p>
              
              {selectedComponent.material && (
                <div className="text-xs mt-2">
                  <span className="font-medium">Material:</span> {selectedComponent.material}
                </div>
              )}
            </div>
            <Badge className="bg-[#FCA311] hover:bg-[#FCA311] text-white">
              ${selectedComponent.price.toFixed(2)}
            </Badge>
          </div>
        </div>
      )}
      
      {/* Component list */}
      <ScrollArea className="h-[calc(100vh-420px)] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {components.map((component) => (
            <Card 
              key={component.id} 
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md",
                component.id === config[type] 
                  ? "ring-2 ring-[#FCA311] bg-[#C9D8E4]/20" 
                  : "hover:border-[#C9D8E4]"
              )}
              onClick={() => handleComponentSelect(component.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-[#14213D]">{component.name}</h3>
                    <p className="text-xs text-[#14213D] opacity-70 line-clamp-2 mt-1">
                      {component.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-white text-[#14213D]">
                    ${component.price.toFixed(2)}
                  </Badge>
                </div>
                
                {component.color && (
                  <div 
                    className="mt-2 w-6 h-6 rounded-full border border-gray-300" 
                    style={{ backgroundColor: component.color }}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
