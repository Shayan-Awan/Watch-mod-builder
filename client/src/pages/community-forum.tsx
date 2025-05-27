import { useState } from "react";

interface ForumPost {
  id: string;
  title: string;
  author: string;
  category: string;
  timestamp: string;
  likes: number;
  replies: number;
  image?: string;
  description: string;
  featured: boolean;
}

const forumPosts: ForumPost[] = [
  {
    id: "1",
    title: "My Custom Seiko Build - Blue Wave Theme",
    author: "WatchMaster2024",
    category: "Custom Builds",
    timestamp: "2 hours ago",
    likes: 47,
    replies: 12,
    image: "🌊",
    description: "Finally completed my dream build with a stunning blue wave dial and ceramic bezel. What do you think?",
    featured: true
  },
  {
    id: "2", 
    title: "Best Strap Combinations for Sport Watches?",
    author: "SportWatchFan",
    category: "Discussion",
    timestamp: "5 hours ago",
    likes: 23,
    replies: 8,
    description: "Looking for advice on the best strap materials and colors for active lifestyle watches.",
    featured: false
  },
  {
    id: "3",
    title: "Vintage Seiko Restoration Project",
    author: "VintageCollector",
    category: "Restoration",
    timestamp: "1 day ago",
    likes: 89,
    replies: 31,
    image: "⚡",
    description: "Step-by-step restoration of a 1970s Seiko automatic. Before and after photos included!",
    featured: true
  }
];

export default function CommunityForum() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("recent");

  const categories = ["All", "Custom Builds", "Discussion", "Restoration", "Tips & Tricks"];

  const filteredPosts = forumPosts
    .filter(post => selectedCategory === "All" || post.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === "popular") return b.likes - a.likes;
      return 0; // Default to original order for "recent"
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-orange-400 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">👥 Community Forum</h1>
          <p className="text-xl opacity-90">Share your designs, get feedback, and connect with fellow watch enthusiasts</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="font-bold text-lg mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-orange-100 text-orange-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4">Community Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Total Members:</span>
                  <span className="font-bold">12,847</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Today:</span>
                  <span className="font-bold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Posts:</span>
                  <span className="font-bold">45,892</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Forum Posts</h2>
                  <p className="text-gray-600">Showing {filteredPosts.length} posts</p>
                </div>
                
                <div className="flex gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Popular</option>
                  </select>
                  
                  <button className="bg-gradient-to-r from-blue-900 to-orange-400 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow">
                    ✨ New Post
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Posts */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">🌟 Featured Posts</h3>
              <div className="grid gap-4">
                {filteredPosts.filter(post => post.featured).map(post => (
                  <div key={post.id} className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-400">
                    <div className="flex items-start gap-4">
                      {post.image && (
                        <div className="text-3xl">{post.image}</div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                            {post.category}
                          </span>
                          <span className="text-gray-500 text-sm">•</span>
                          <span className="text-gray-500 text-sm">{post.timestamp}</span>
                        </div>
                        
                        <h4 className="font-bold text-lg mb-2">{post.title}</h4>
                        <p className="text-gray-600 mb-3">{post.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>By {post.author}</span>
                            <span>❤️ {post.likes} likes</span>
                            <span>💬 {post.replies} replies</span>
                          </div>
                          <button className="text-orange-400 hover:text-orange-600 font-medium">
                            Read More →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* All Posts */}
            <div>
              <h3 className="text-xl font-bold mb-4">All Posts</h3>
              <div className="space-y-4">
                {filteredPosts.map(post => (
                  <div key={post.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      {post.image && (
                        <div className="text-2xl">{post.image}</div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                            {post.category}
                          </span>
                          <span className="text-gray-500 text-sm">•</span>
                          <span className="text-gray-500 text-sm">{post.timestamp}</span>
                        </div>
                        
                        <h4 className="font-semibold text-lg mb-2">{post.title}</h4>
                        <p className="text-gray-600 mb-3">{post.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>By {post.author}</span>
                            <span>❤️ {post.likes}</span>
                            <span>💬 {post.replies}</span>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 font-medium">
                            View Post →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}