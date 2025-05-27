import { useState } from "react";

interface JewelryItem {
  id: string;
  name: string;
  type: "chain" | "bracelet" | "ring";
  material: string;
  price: number;
  image: string;
}

const jewelryItems: JewelryItem[] = [
  // Chains
  { id: "chain-001", name: "Classic Gold Chain", type: "chain", material: "18K Gold", price: 899, image: "🔗" },
  { id: "chain-002", name: "Silver Cuban Link", type: "chain", material: "Sterling Silver", price: 299, image: "🔗" },
  { id: "chain-003", name: "Rose Gold Rope Chain", type: "chain", material: "Rose Gold", price: 649, image: "🔗" },
  
  // Bracelets
  { id: "bracelet-001", name: "Tennis Bracelet", type: "bracelet", material: "White Gold", price: 1299, image: "📿" },
  { id: "bracelet-002", name: "Leather Wrap Bracelet", type: "bracelet", material: "Leather", price: 89, image: "📿" },
  { id: "bracelet-003", name: "Stainless Steel Bracelet", type: "bracelet", material: "Stainless Steel", price: 149, image: "📿" },
  
  // Rings
  { id: "ring-001", name: "Classic Wedding Band", type: "ring", material: "Platinum", price: 799, image: "💍" },
  { id: "ring-002", name: "Signet Ring", type: "ring", material: "Gold", price: 449, image: "💍" },
  { id: "ring-003", name: "Modern Minimalist Ring", type: "ring", material: "Titanium", price: 199, image: "💍" }
];

export default function JewelryDesigner() {
  const [selectedType, setSelectedType] = useState<"chain" | "bracelet" | "ring">("chain");
  const [selectedItems, setSelectedItems] = useState<JewelryItem[]>([]);
  const [customization, setCustomization] = useState({
    engraving: "",
    size: "",
    finish: "polished"
  });

  const filteredItems = jewelryItems.filter(item => item.type === selectedType);

  const addToDesign = (item: JewelryItem) => {
    setSelectedItems(prev => [...prev, { ...item, id: `${item.id}-${Date.now()}` }]);
  };

  const removeFromDesign = (id: string) => {
    setSelectedItems(prev => prev.filter(item => item.id !== id));
  };

  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-orange-400 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">💎 Jewelry Designer</h1>
          <p className="text-xl opacity-90">Create custom chains, bracelets & rings to complement your watch</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Panel - Item Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">Select Jewelry Type</h2>
              
              {/* Type Selector */}
              <div className="flex space-x-4 mb-8">
                {["chain", "bracelet", "ring"].map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type as any)}
                    className={`px-6 py-3 rounded-lg font-medium capitalize transition-colors ${
                      selectedType === type
                        ? 'bg-gradient-to-r from-blue-900 to-orange-400 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type}s
                  </button>
                ))}
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredItems.map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="text-3xl mb-3 text-center">{item.image}</div>
                    <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                    <p className="text-gray-600 mb-2">{item.material}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-orange-400">${item.price}</span>
                      <button
                        onClick={() => addToDesign(item)}
                        className="bg-gradient-to-r from-blue-900 to-orange-400 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-shadow"
                      >
                        Add to Design
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Design Summary */}
          <div className="space-y-6">
            
            {/* Current Design */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4">Your Design</h3>
              
              {selectedItems.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No items selected yet</p>
              ) : (
                <div className="space-y-4">
                  {selectedItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.material}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">${item.price}</span>
                        <button
                          onClick={() => removeFromDesign(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-orange-400">${totalPrice}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Customization Options */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4">Customization</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Engraving Text</label>
                  <input
                    type="text"
                    value={customization.engraving}
                    onChange={(e) => setCustomization(prev => ({...prev, engraving: e.target.value}))}
                    placeholder="Enter custom text..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                  <select
                    value={customization.size}
                    onChange={(e) => setCustomization(prev => ({...prev, size: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  >
                    <option value="">Select size...</option>
                    <option value="XS">Extra Small</option>
                    <option value="S">Small</option>
                    <option value="M">Medium</option>
                    <option value="L">Large</option>
                    <option value="XL">Extra Large</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Finish</label>
                  <select
                    value={customization.finish}
                    onChange={(e) => setCustomization(prev => ({...prev, finish: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  >
                    <option value="polished">Polished</option>
                    <option value="matte">Matte</option>
                    <option value="brushed">Brushed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                className="w-full bg-gradient-to-r from-blue-900 to-orange-400 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
                disabled={selectedItems.length === 0}
              >
                💎 Save Design
              </button>
              <button 
                className="w-full border-2 border-orange-400 text-orange-400 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
                disabled={selectedItems.length === 0}
              >
                📤 Share Design
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}