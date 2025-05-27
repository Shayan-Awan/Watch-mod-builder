/**
 * Seiko Watch Customizer Chatbot
 * Handles customer inquiries about watch customization, parts, compatibility, and general support
 */

// Types and Interfaces
interface ChatMessage {
  id: string;
  timestamp: Date;
  sender: 'user' | 'bot';
  message: string;
  category?: string;
  confidence?: number;
}

interface WatchComponent {
  id: string;
  name: string;
  type: 'case' | 'dial' | 'hands' | 'bezel';
  price: number;
  compatibility: string[];
  material?: string;
  description: string;
}

interface ChatResponse {
  message: string;
  suggestions?: string[];
  relatedProducts?: WatchComponent[];
  category: string;
  confidence: number;
}

interface KnowledgeBase {
  [key: string]: {
    patterns: string[];
    responses: string[];
    category: string;
    followUp?: string[];
    products?: string[];
  };
}

// Watch components data
const watchComponents: WatchComponent[] = [
  {
    id: "case_skx007",
    name: "SKX007 Classic Case",
    type: "case",
    price: 89.99,
    compatibility: ["dial_black", "dial_blue", "dial_green"],
    material: "Stainless Steel",
    description: "Classic diver's watch case with 42.5mm diameter and 200m water resistance"
  },
  {
    id: "dial_black",
    name: "Black Sunburst Dial",
    type: "dial",
    price: 49.99,
    compatibility: ["case_skx007", "case_turtle"],
    description: "Classic black sunburst dial with applied indices"
  },
  {
    id: "hands_standard",
    name: "Standard Polished Hands",
    type: "hands",
    price: 29.99,
    compatibility: ["case_skx007", "dial_black"],
    material: "Polished Steel",
    description: "Classic hour, minute and second hands with luminous coating"
  },
  {
    id: "bezel_dive",
    name: "Dive Timing Bezel",
    type: "bezel",
    price: 49.99,
    compatibility: ["case_skx007"],
    material: "Stainless Steel with Aluminum Insert",
    description: "120-click unidirectional rotating bezel for dive timing"
  }
];

// Knowledge base with common questions and responses
const knowledgeBase: KnowledgeBase = {
  greeting: {
    patterns: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "start", "help"],
    responses: [
      "Hello! Welcome to Seiko Watch Customizer! I'm here to help you build your perfect custom watch. What would you like to know?",
      "Hi there! I'm your watch customization assistant. I can help you with parts selection, compatibility, pricing, and building tips. How can I assist you today?",
      "Welcome! Ready to create something amazing? I can guide you through our 125+ premium components to build your dream Seiko watch. What interests you most?"
    ],
    category: "greeting",
    followUp: [
      "Browse our case collection",
      "Check dial options",
      "View complete parts catalog",
      "Get pricing information"
    ]
  },

  compatibility: {
    patterns: [
      "compatible", "compatibility", "will this work", "does this fit", "can I use",
      "match", "compatible with", "fits with", "works with", "combine"
    ],
    responses: [
      "Great question about compatibility! To check if parts work together, I need to know which specific components you're interested in. What case and dial are you considering?",
      "I can help you verify compatibility! Our parts are designed to work together, but some combinations work better than others. Which components would you like me to check?",
      "Compatibility is crucial for a successful build! Each part has specific compatibility requirements. Tell me your component choices and I'll verify they work together perfectly."
    ],
    category: "compatibility",
    followUp: [
      "SKX007 case compatibility",
      "SARB033 dial options",
      "Universal hand sets",
      "Bezel compatibility guide"
    ]
  },

  pricing: {
    patterns: [
      "price", "cost", "how much", "expensive", "cheap", "budget", "total cost",
      "pricing", "affordable", "payment", "money"
    ],
    responses: [
      "Our components range from $29.99 for basic hands to $129.99 for premium cases. A complete watch typically costs $200-400 depending on your choices. What's your target budget?",
      "Pricing varies by component quality and complexity. Cases: $89-129, Dials: $49-65, Hands: $29-45, Bezels: $39-89. I can help you build within any budget!",
      "We offer transparent pricing with no hidden fees! Basic builds start around $200, while premium configurations can reach $400+. Would you like me to estimate your specific build?"
    ],
    category: "pricing",
    followUp: [
      "Budget build recommendations",
      "Premium component selection",
      "Compare pricing options",
      "Calculate total cost"
    ]
  },

  cases: {
    patterns: [
      "case", "cases", "skx007", "sarb033", "turtle", "presage", "42mm", "38mm", "size",
      "stainless steel", "water resistance"
    ],
    responses: [
      "We offer authentic cases from iconic Seiko models! The SKX007 (42.5mm diver), SARB033 (38mm dress), Turtle (44mm cushion), and Presage (40.5mm elegant). Which style interests you?",
      "Our case collection features premium stainless steel construction with varying sizes and styles. Popular choices include the classic SKX007 for diving and SARB033 for dress occasions. What's your preference?",
      "Cases are the foundation of your build! We have diver cases (SKX007, Turtle), dress cases (SARB033, Presage), and sport cases. All feature excellent water resistance and quality finishing."
    ],
    category: "cases",
    products: ["case_skx007"],
    followUp: [
      "SKX007 specifications",
      "Case size comparison",
      "Water resistance guide",
      "Compatible dials for cases"
    ]
  },

  dials: {
    patterns: [
      "dial", "dials", "black", "blue", "white", "green", "orange", "cream", "sunburst",
      "color", "face", "markers", "indices", "lume", "luminous"
    ],
    responses: [
      "Our dial collection features stunning sunburst finishes in black, blue, green, white, cream, and orange. Each has luminous markers for excellent readability. What color speaks to you?",
      "Dials are where personality shines! We offer classic black sunburst, deep navy blue, forest green, pure white porcelain, vintage cream, and vibrant orange. All feature quality luminous indices.",
      "Choose from 38 different dial options! Popular choices include black sunburst for versatility, blue for elegance, and orange for sport. Each dial is carefully crafted with applied markers."
    ],
    category: "dials",
    products: ["dial_black"],
    followUp: [
      "Dial color options",
      "Sunburst vs matte finish",
      "Marker styles available",
      "Dial compatibility check"
    ]
  },

  hands: {
    patterns: [
      "hands", "hour hand", "minute hand", "second hand", "sword", "cathedral", "dauphine",
      "snowflake", "mercedes", "luminous", "lume", "polished", "brushed"
    ],
    responses: [
      "Hand sets complete your watch's character! We offer Standard polished, Sword style, Cathedral vintage, Gold dauphine, and Snowflake designs. All feature luminous coating for night visibility.",
      "Our hand collection includes 28 different styles from classic to contemporary. Popular options are Standard (versatile), Sword (elegant), Cathedral (vintage), and Mercedes (iconic). What style fits your vision?",
      "Quality hands make all the difference! Choose from polished steel, brushed finishes, or gold-plated options. Each set includes hour, minute, and second hands with premium luminous fill."
    ],
    category: "hands",
    products: ["hands_standard"],
    followUp: [
      "Hand style comparison",
      "Luminous coating options",
      "Material choices",
      "Installation requirements"
    ]
  },

  bezels: {
    patterns: [
      "bezel", "bezels", "rotating", "fixed", "dive", "gmt", "fluted", "polished",
      "timing", "ceramic", "aluminum", "unidirectional"
    ],
    responses: [
      "Bezels add both function and style! We offer fixed polished steel, rotating dive bezels, GMT bezels, decorative fluted, and premium ceramic options. What functionality do you need?",
      "Our bezel selection includes 27 options from functional to decorative. Dive bezels for timing, GMT for multiple time zones, fluted for elegance, and ceramic for durability. Which appeals to you?",
      "Choose the perfect bezel for your build! Options include 120-click dive bezels, 24-hour GMT bezels, luxury fluted designs, and scratch-resistant ceramic. Each enhances both form and function."
    ],
    category: "bezels",
    products: ["bezel_dive"],
    followUp: [
      "Bezel functionality guide",
      "Rotating vs fixed bezels",
      "Material comparisons",
      "Color options available"
    ]
  },

  shipping: {
    patterns: [
      "shipping", "delivery", "how long", "when will", "arrive", "fast", "express",
      "international", "tracking", "free shipping"
    ],
    responses: [
      "We offer multiple shipping options! Standard delivery takes 5-7 business days, express 2-3 days, and overnight for urgent builds. International shipping available to most countries.",
      "Shipping times depend on your location and components. Most parts ship within 24-48 hours. Domestic delivery: 3-7 days, International: 7-14 days. Express options available!",
      "Fast and secure shipping worldwide! We use premium carriers with full tracking. Free standard shipping on orders over $200, express shipping available for faster delivery."
    ],
    category: "shipping",
    followUp: [
      "Track my order",
      "Express shipping options",
      "International delivery",
      "Shipping costs"
    ]
  },

  assembly: {
    patterns: [
      "assembly", "install", "installation", "build", "put together", "tools",
      "how to", "instructions", "guide", "difficult", "professional"
    ],
    responses: [
      "We provide detailed assembly instructions with every order! Basic builds require standard watch tools. For complex modifications, we recommend professional installation or our assembly service.",
      "Assembly difficulty varies by component. Dial and hand swaps are intermediate level, while case work requires experience. We offer video guides and can recommend certified watchmakers in your area.",
      "Building your custom watch can be rewarding! We include step-by-step instructions, tool lists, and safety tips. For guaranteed results, consider our professional assembly service."
    ],
    category: "assembly",
    followUp: [
      "Tool requirements",
      "Assembly service options",
      "Video tutorials",
      "Professional installation"
    ]
  },

  warranty: {
    patterns: [
      "warranty", "guarantee", "return", "exchange", "defective", "quality",
      "problem", "issue", "broken", "replacement"
    ],
    responses: [
      "All components come with our quality guarantee! 30-day returns for any reason, 1-year warranty against defects. We stand behind every part and will make it right if you're not satisfied.",
      "Your satisfaction is guaranteed! We offer hassle-free returns within 30 days and comprehensive warranty coverage. Defective parts are replaced immediately at no cost.",
      "Quality is our priority! Every component is thoroughly inspected before shipping. We provide full warranty coverage and responsive customer service to ensure your complete satisfaction."
    ],
    category: "warranty",
    followUp: [
      "Return process",
      "Warranty terms",
      "Quality standards",
      "Customer service contact"
    ]
  },

  customization: {
    patterns: [
      "custom", "customize", "personalize", "unique", "special", "engrave",
      "modification", "special order", "bespoke", "one of a kind"
    ],
    responses: [
      "We love creating unique timepieces! Beyond our standard catalog, we offer custom engraving, special finishes, and bespoke modifications. What kind of personalization interests you?",
      "Make it truly yours! We provide custom dial printing, case engraving, special hand colors, and unique combinations. Our craftsmen can bring your vision to life with premium customization options.",
      "Personalization makes your watch special! Options include custom text engraving, special edition dials, unique hand combinations, and exclusive finishes. Let's discuss your ideas!"
    ],
    category: "customization",
    followUp: [
      "Engraving options",
      "Custom dial design",
      "Special finishes",
      "Bespoke services"
    ]
  }
};

class SeikoWatchChatbot {
  private conversationHistory: ChatMessage[] = [];
  private currentContext: string = '';

  constructor() {
    this.addBotMessage("Hello! Welcome to Seiko Watch Customizer! I'm here to help you build your perfect custom watch. What would you like to know?", "greeting");
  }

  // Main method to process user input
  public processMessage(userInput: string): ChatResponse {
    const userMessage: ChatMessage = {
      id: this.generateId(),
      timestamp: new Date(),
      sender: 'user',
      message: userInput
    };

    this.conversationHistory.push(userMessage);

    const response = this.generateResponse(userInput.toLowerCase());
    
    const botMessage: ChatMessage = {
      id: this.generateId(),
      timestamp: new Date(),
      sender: 'bot',
      message: response.message,
      category: response.category,
      confidence: response.confidence
    };

    this.conversationHistory.push(botMessage);
    this.currentContext = response.category;

    return response;
  }

  // Generate appropriate response based on user input
  private generateResponse(input: string): ChatResponse {
    let bestMatch = { category: '', confidence: 0, patterns: [] as string[] };

    // Find the best matching category
    for (const [category, data] of Object.entries(knowledgeBase)) {
      for (const pattern of data.patterns) {
        if (input.includes(pattern)) {
          const confidence = this.calculateConfidence(input, pattern);
          if (confidence > bestMatch.confidence) {
            bestMatch = { category, confidence, patterns: data.patterns };
          }
        }
      }
    }

    // If no good match found, provide general help
    if (bestMatch.confidence < 0.3) {
      return this.getGeneralHelpResponse();
    }

    const categoryData = knowledgeBase[bestMatch.category];
    const randomResponse = categoryData.responses[Math.floor(Math.random() * categoryData.responses.length)];

    const response: ChatResponse = {
      message: randomResponse,
      suggestions: categoryData.followUp,
      category: bestMatch.category,
      confidence: bestMatch.confidence
    };

    // Add related products if available
    if (categoryData.products) {
      response.relatedProducts = this.getRelatedProducts(categoryData.products);
    }

    return response;
  }

  // Calculate confidence score for pattern matching
  private calculateConfidence(input: string, pattern: string): number {
    if (input === pattern) return 1.0;
    if (input.includes(pattern)) return 0.8;
    
    const words = input.split(' ');
    const patternWords = pattern.split(' ');
    let matches = 0;
    
    for (const word of words) {
      if (patternWords.includes(word)) {
        matches++;
      }
    }
    
    return matches / Math.max(words.length, patternWords.length);
  }

  // Get related products based on category
  private getRelatedProducts(productIds: string[]): WatchComponent[] {
    return watchComponents.filter(component => 
      productIds.includes(component.id)
    ).slice(0, 3); // Limit to 3 products
  }

  // Fallback response for unrecognized input
  private getGeneralHelpResponse(): ChatResponse {
    const helpResponses = [
      "I'd be happy to help! I can assist with parts selection, compatibility questions, pricing, assembly guidance, and more. What specific aspect of watch customization interests you?",
      "I'm here to guide you through building your perfect Seiko watch! You can ask me about our 125+ components, compatibility, pricing, or get personalized recommendations. What would you like to explore?",
      "Let me help you create something amazing! I can answer questions about cases, dials, hands, bezels, compatibility, pricing, and assembly. What's on your mind?"
    ];

    return {
      message: helpResponses[Math.floor(Math.random() * helpResponses.length)],
      suggestions: [
        "Show me popular case options",
        "What dial colors are available?",
        "Help me check compatibility",
        "What's the price range?",
        "Guide me through my first build"
      ],
      category: "general_help",
      confidence: 0.5
    };
  }

  // Add bot message to history
  private addBotMessage(message: string, category: string): void {
    const botMessage: ChatMessage = {
      id: this.generateId(),
      timestamp: new Date(),
      sender: 'bot',
      message,
      category
    };
    this.conversationHistory.push(botMessage);
  }

  // Generate unique ID for messages
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Get conversation history
  public getHistory(): ChatMessage[] {
    return [...this.conversationHistory];
  }

  // Clear conversation
  public clearHistory(): void {
    this.conversationHistory = [];
    this.currentContext = '';
    this.addBotMessage("Conversation cleared! How can I help you with your watch customization today?", "greeting");
  }

  // Get current context
  public getCurrentContext(): string {
    return this.currentContext;
  }

  // Advanced compatibility checking
  public checkCompatibility(componentIds: string[]): { compatible: boolean; issues: string[]; recommendations: string[] } {
    const components = watchComponents.filter(comp => componentIds.includes(comp.id));
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check if all components can work together
    for (let i = 0; i < components.length; i++) {
      for (let j = i + 1; j < components.length; j++) {
        const comp1 = components[i];
        const comp2 = components[j];
        
        if (!comp1.compatibility.includes(comp2.id) && !comp2.compatibility.includes(comp1.id)) {
          issues.push(`${comp1.name} may not be fully compatible with ${comp2.name}`);
        }
      }
    }

    // Generate recommendations
    if (issues.length === 0) {
      recommendations.push("Great combination! All selected components work perfectly together.");
    } else {
      recommendations.push("Consider checking our compatibility guide for alternative options.");
      recommendations.push("Our experts can suggest compatible alternatives that maintain your design vision.");
    }

    return {
      compatible: issues.length === 0,
      issues,
      recommendations
    };
  }

  // Calculate total price for selected components
  public calculatePrice(componentIds: string[]): { total: number; breakdown: Array<{name: string; price: number}> } {
    const selectedComponents = watchComponents.filter(comp => componentIds.includes(comp.id));
    const breakdown = selectedComponents.map(comp => ({
      name: comp.name,
      price: comp.price
    }));
    
    const total = selectedComponents.reduce((sum, comp) => sum + comp.price, 0);
    
    return { total, breakdown };
  }

  // Get personalized recommendations based on conversation
  public getRecommendations(): WatchComponent[] {
    const recommendations: WatchComponent[] = [];
    
    // Based on conversation context, suggest relevant components
    switch (this.currentContext) {
      case 'cases':
        recommendations.push(...watchComponents.filter(comp => comp.type === 'case').slice(0, 2));
        break;
      case 'dials':
        recommendations.push(...watchComponents.filter(comp => comp.type === 'dial').slice(0, 2));
        break;
      case 'hands':
        recommendations.push(...watchComponents.filter(comp => comp.type === 'hands').slice(0, 2));
        break;
      case 'bezels':
        recommendations.push(...watchComponents.filter(comp => comp.type === 'bezel').slice(0, 2));
        break;
      default:
        // General recommendations - one from each category
        recommendations.push(
          watchComponents.find(comp => comp.type === 'case')!,
          watchComponents.find(comp => comp.type === 'dial')!,
          watchComponents.find(comp => comp.type === 'hands')!,
          watchComponents.find(comp => comp.type === 'bezel')!
        );
    }
    
    return recommendations.filter(Boolean);
  }
}

// Export for use in other modules
export { SeikoWatchChatbot, ChatMessage, ChatResponse, WatchComponent };

// Example usage and testing
if (require.main === module) {
  const chatbot = new SeikoWatchChatbot();
  
  console.log("=== Seiko Watch Customizer Chatbot Demo ===\n");
  
  // Simulate conversation
  const testQuestions = [
    "Hello!",
    "What cases do you have?",
    "Is the SKX007 case compatible with a blue dial?",
    "How much would a complete watch cost?",
    "Do you offer assembly services?",
    "What warranty do you provide?"
  ];
  
  testQuestions.forEach((question, index) => {
    console.log(`User: ${question}`);
    const response = chatbot.processMessage(question);
    console.log(`Bot: ${response.message}`);
    
    if (response.suggestions && response.suggestions.length > 0) {
      console.log(`Suggestions: ${response.suggestions.join(', ')}`);
    }
    
    if (response.relatedProducts && response.relatedProducts.length > 0) {
      console.log(`Related Products: ${response.relatedProducts.map(p => p.name).join(', ')}`);
    }
    
    console.log(`Category: ${response.category} | Confidence: ${(response.confidence * 100).toFixed(1)}%\n`);
  });
  
  // Test compatibility checking
  console.log("=== Compatibility Test ===");
  const compatibilityTest = chatbot.checkCompatibility(["case_skx007", "dial_black", "hands_standard"]);
  console.log("Compatible:", compatibilityTest.compatible);
  console.log("Issues:", compatibilityTest.issues);
  console.log("Recommendations:", compatibilityTest.recommendations);
  
  // Test price calculation
  console.log("\n=== Price Calculation ===");
  const priceTest = chatbot.calculatePrice(["case_skx007", "dial_black", "hands_standard", "bezel_dive"]);
  console.log("Total Price: $" + priceTest.total.toFixed(2));
  console.log("Breakdown:");
  priceTest.breakdown.forEach(item => {
    console.log(`  ${item.name}: $${item.price.toFixed(2)}`);
  });
}