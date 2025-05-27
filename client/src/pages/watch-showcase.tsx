import { useState } from "react";

interface WatchBuild {
  id: string;
  title: string;
  author: string;
  image: string;
  description: string;
  likes: number;
  views: number;
  datePosted: string;
  totalCost: number;
  featured: boolean;
  parts: {
    case: { name: string; price: number; material: string; };
    dial: { name: string; price: number; material: string; };
    hands: { name: string; price: number; material: string; };
    bezel: { name: string; price: number; material: string; };
    strap?: { name: string; price: number; material: string; };
  };
}

const watchBuilds: WatchBuild[] = [
  {
    id: "1",
    title: "Ocean Blue Professional",
    author: "SeikoPro2024",
    image: "🌊",
    description: "A stunning dive watch inspired by deep ocean currents. Perfect blend of elegance and functionality.",
    likes: 127,
    views: 1834,
    datePosted: "2 days ago",
    totalCost: 1247,
    featured: true,
    parts: {
      case: { name: "Premium Titanium Case 42mm", price: 599, material: "Titanium" },
      dial: { name: "Ocean Blue Sunburst Dial", price: 249, material: "Metal" },
      hands: { name: "Luminous Dive Hands", price: 159, material: "Steel" },
      bezel: { name: "Unidirectional Rotating Bezel", price: 189, material: "Ceramic" },
      strap: { name: "Professional Rubber Strap", price: 51, material: "Rubber" }
    }
  },
  {
    id: "2",
    title: "Rose Gold Elegance",
    author: "LuxuryTimepiece",
    image: "🌹",
    description: "Sophisticated dress watch with rose gold accents. Perfect for formal occasions.",
    likes: 89,
    views: 1205,
    datePosted: "5 days ago",
    totalCost: 1799,
    featured: false,
    parts: {
      case: { name: "Rose Gold Plated Case 38mm", price: 899, material: "Rose Gold" },
      dial: { name: "Mother of Pearl Dial", price: 349, material: "Mother of Pearl" },
      hands: { name: "Rose Gold Hands", price: 229, material: "Rose Gold" },
      bezel: { name: "Smooth Polished Bezel", price: 199, material: "Rose Gold" },
      strap: { name: "Leather Croco Strap", price: 123, material: "Leather" }
    }
  },
  {
    id: "3",
    title: "Stealth Black Edition",
    author: "TacticalWatch",
    image: "⚫",
    description: "All-black tactical build with enhanced durability. Built for extreme conditions.",
    likes: 156,
    views: 2103,
    datePosted: "1 week ago",
    totalCost: 987,
    featured: true,
    parts: {
      case: { name: "Black PVD Coated Case 44mm", price: 449, material: "Steel PVD" },
      dial: { name: "Matte Black Tactical Dial", price: 179, material: "Metal" },
      hands: { name: "Black Luminous Hands", price: 119, material: "Steel" },
      bezel: { name: "Black Ceramic Bezel", price: 189, material: "Ceramic" },
      strap: { name: "Tactical NATO Strap", price: 51, material: "Nylon" }
    }
  }
];

export default function WatchShowcase() {
  const [selectedWatch, setSelectedWatch] = useState<WatchBuild | null>(null);
  const [sortBy, setSortBy] = useState("recent");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const filteredBuilds = watchBuilds
    .filter(build => !showFeaturedOnly || build.featured)
    .sort((a, b) => {
      if (sortBy === "popular") return b.likes - a.likes;
      if (sortBy === "expensive") return b.totalCost - a.totalCost;
      return 0; // Default to original order for "recent"
    });

  const closeModal = () => setSelectedWatch(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-orange-400 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">⌚ Watch Showcase</h1>
          <p className="text-xl opacity-90">Discover amazing custom watch builds from our community</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">Community Builds</h2>
              <p className="text-gray-600">Showing {filteredBuilds.length} watch builds</p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                  className="rounded border-gray-300 text-orange-400 focus:ring-orange-400"
                />
                <span className="text-sm">Featured only</span>
              </label>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="expensive">Highest Value</option>
              </select>
              
              <button className="bg-gradient-to-r from-blue-900 to-orange-400 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow">
                📸 Post Your Build
              </button>
            </div>
          </div>
        </div>

        {/* Watch Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuilds.map(build => (
            <div key={build.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedWatch(build)}>
              {build.featured && (
                <div className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-3 py-1 text-xs font-bold rounded-t-lg">
                  ⭐ FEATURED BUILD
                </div>
              )}
              
              <div className="p-6">
                <div className="text-6xl mb-4 text-center">{build.image}</div>
                
                <h3 className="font-bold text-xl mb-2">{build.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{build.description}</p>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>By {build.author}</span>
                  <span>{build.datePosted}</span>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="text-2xl font-bold text-orange-400">${build.totalCost}</div>
                  <div className="flex space-x-4 text-sm text-gray-600">
                    <span>❤️ {build.likes}</span>
                    <span>👁️ {build.views}</span>
                  </div>
                </div>
                
                <button 
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedWatch(build);
                  }}
                >
                  View Build Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Watch Details */}
      {selectedWatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={closeModal}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedWatch.title}</h2>
                  <p className="text-gray-600">By {selectedWatch.author} • {selectedWatch.datePosted}</p>
                </div>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left Side - Image and Description */}
                <div>
                  <div className="text-8xl mb-6 text-center bg-gray-50 py-8 rounded-lg">
                    {selectedWatch.image}
                  </div>
                  
                  <h3 className="font-bold text-lg mb-3">Description</h3>
                  <p className="text-gray-700 mb-6">{selectedWatch.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-6 text-sm text-gray-600">
                      <span>❤️ {selectedWatch.likes} likes</span>
                      <span>👁️ {selectedWatch.views} views</span>
                    </div>
                    <button className="bg-gradient-to-r from-blue-900 to-orange-400 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow">
                      ❤️ Like Build
                    </button>
                  </div>
                </div>

                {/* Right Side - Parts Breakdown */}
                <div>
                  <h3 className="font-bold text-lg mb-4">Parts Breakdown</h3>
                  
                  <div className="space-y-4">
                    {Object.entries(selectedWatch.parts).map(([partType, part]) => (
                      <div key={partType} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-gray-500 uppercase text-xs mb-1">
                              {partType}
                            </div>
                            <div className="font-semibold text-lg">{part.name}</div>
                            <div className="text-sm text-gray-600">{part.material}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg text-orange-400">${part.price}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Total Cost */}
                  <div className="border-t-2 border-gray-300 mt-6 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">Total Build Cost:</span>
                      <span className="text-3xl font-bold text-orange-400">${selectedWatch.totalCost}</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-6 space-y-3">
                    <button className="w-full bg-gradient-to-r from-blue-900 to-orange-400 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow">
                      🛒 Order These Parts
                    </button>
                    <button className="w-full border-2 border-orange-400 text-orange-400 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
                      📋 Copy Build to My Designs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}