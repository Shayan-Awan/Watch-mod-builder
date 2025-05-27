import { useState } from "react";

interface Component {
  id: string;
  name: string;
  type: string;
  price: number;
  material: string;
  brand: string;
  image: string;
  inStock: boolean;
}

const components: Component[] = [
  // Cases
  { id: "case-001", name: "Classic Stainless Steel Case", type: "Case", price: 299, material: "Stainless Steel", brand: "Seiko", image: "⌚", inStock: true },
  { id: "case-002", name: "Premium Titanium Case", type: "Case", price: 599, material: "Titanium", brand: "Seiko", image: "⌚", inStock: true },
  { id: "case-003", name: "Gold-Plated Luxury Case", type: "Case", price: 899, material: "Gold Plated", brand: "Seiko", image: "⌚", inStock: false },
  
  // Dials
  { id: "dial-001", name: "Black Sunburst Dial", type: "Dial", price: 149, material: "Metal", brand: "Seiko", image: "🎯", inStock: true },
  { id: "dial-002", name: "Blue Wave Pattern Dial", type: "Dial", price: 179, material: "Metal", brand: "Seiko", image: "🎯", inStock: true },
  { id: "dial-003", name: "Mother of Pearl Dial", type: "Dial", price: 249, material: "Mother of Pearl", brand: "Seiko", image: "🎯", inStock: true },
  
  // Hands
  { id: "hands-001", name: "Classic Silver Hands", type: "Hands", price: 89, material: "Steel", brand: "Seiko", image: "📍", inStock: true },
  { id: "hands-002", name: "Luminous Green Hands", type: "Hands", price: 119, material: "Steel", brand: "Seiko", image: "📍", inStock: true },
  { id: "hands-003", name: "Rose Gold Hands", type: "Hands", price: 159, material: "Rose Gold", brand: "Seiko", image: "📍", inStock: false },
  
  // Bezels
  { id: "bezel-001", name: "Smooth Polished Bezel", type: "Bezel", price: 199, material: "Steel", brand: "Seiko", image: "⭕", inStock: true },
  { id: "bezel-002", name: "Rotating GMT Bezel", type: "Bezel", price: 279, material: "Steel", brand: "Seiko", image: "⭕", inStock: true },
  { id: "bezel-003", name: "Ceramic Insert Bezel", type: "Bezel", price: 349, material: "Ceramic", brand: "Seiko", image: "⭕", inStock: true }
];

export default function PartsCatalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  const filteredComponents = components
    .filter(component => {
      const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          component.material.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "All" || component.type === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const types = ["All", "Case", "Dial", "Hands", "Bezel"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-orange-400 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Premium Parts Catalog</h1>
          <p className="text-xl opacity-90">Browse our collection of 125+ premium Seiko watch components</p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Components</label>
              <input
                type="text"
                placeholder="Search by name or material..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Component Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              >
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredComponents.length} of {components.length} components
          </p>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredComponents.map(component => (
            <div key={component.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="text-4xl mb-4 text-center">{component.image}</div>
                <h3 className="font-semibold text-lg mb-2">{component.name}</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium">{component.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Material:</span>
                    <span className="font-medium">{component.material}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Brand:</span>
                    <span className="font-medium">{component.brand}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-orange-400">${component.price}</span>
                  <div className="flex items-center space-x-2">
                    {component.inStock ? (
                      <span className="text-green-600 text-sm">✓ In Stock</span>
                    ) : (
                      <span className="text-red-600 text-sm">⚠ Out of Stock</span>
                    )}
                  </div>
                </div>
                
                <button 
                  className={`w-full mt-4 py-2 rounded-lg font-medium transition-colors ${
                    component.inStock 
                      ? 'bg-gradient-to-r from-blue-900 to-orange-400 text-white hover:shadow-lg' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!component.inStock}
                >
                  {component.inStock ? 'Add to Configuration' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredComponents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No components found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}