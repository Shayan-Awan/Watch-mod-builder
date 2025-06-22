export type ComponentType = 'case' | 'dial' | 'hands' | 'bezel';

export interface WatchComponent {
  id: string;
  name: string;
  description: string;
  price: number;
  imagePath: string;
  modelPath?: string;
  color?: string;
  material?: string;
  compatibility?: string[];
}

// Watch Cases
const cases: WatchComponent[] = [
  {
    id: "case_skx007",
    name: "SKX007 Case",
    description: "Classic diver's watch case with 42.5mm diameter and 200m water resistance",
    price: 89.99,
    imagePath: "/models/watch/cases/skx007.svg",
    material: "Stainless Steel",
    compatibility: ["dial_black", "dial_blue", "dial_green", "dial_orange"]
  },


  {
    id: "case_sarb033",
    name: "SARB033 Case",
    description: "Elegant mid-size 38mm dress watch case with display caseback",
    price: 119.99,
    imagePath: "/models/watch/cases/sarb033.svg",
    material: "Stainless Steel",
    compatibility: ["dial_white", "dial_black", "dial_cream"]
  },
  {
    id: "case_turtle",
    name: "Turtle Case",
    description: "Cushion-shaped 44mm case with iconic turtle profile and 200m water resistance",
    price: 99.99,
    imagePath: "/models/watch/cases/turtle.svg",
    material: "Stainless Steel",
    compatibility: ["dial_black", "dial_blue", "dial_green"]
  },


  {
    id: "case_presage",
    name: "Presage Case",
    description: "Refined 40.5mm case with elegant profile and 100m water resistance",
    price: 129.99,
    imagePath: "/models/watch/cases/presage.svg",
    material: "Stainless Steel with Gold PVD",
    compatibility: ["dial_white", "dial_cream", "dial_blue"]
  }
];

// Watch Dials
const dials: WatchComponent[] = [
  {
    id: "dial_black",
    name: "Black Sunburst Dial",
    description: "Classic black sunburst dial with applied indices",
    price: 49.99,
    imagePath: "/models/watch/dials/black.svg",
    color: "#000000"
  },
  {
    id: "dial_blue",
    name: "Blue Sunburst Dial",
    description: "Deep blue sunburst dial with luminous markers",
    price: 54.99,
    imagePath: "/models/watch/dials/blue.svg",
    color: "#14213D"
  },
  {
    id: "dial_green",
    name: "Green Sunburst Dial",
    description: "Emerald green sunburst dial with date window",
    price: 54.99,
    imagePath: "/models/watch/dials/green.svg",
    color: "#285943"
  },
  {
    id: "dial_white",
    name: "White Porcelain Dial",
    description: "Clean white porcelain dial with roman numerals",
    price: 59.99,
    imagePath: "/models/watch/dials/white.svg",
    color: "#FFFFFF"
  },

  //had some issues with the pricing orignially but got it figured out
  {
    id: "dial_cream",
    name: "Cream Vintage Dial",
    description: "Vintage-style cream dial with patina indices",
    price: 64.99,
    imagePath: "/models/watch/dials/cream.svg",
    color: "#F5EFE0"
  },
  {
    id: "dial_orange",
    name: "Orange Dive Dial",
    description: "Vibrant orange dive dial with black indices",
    price: 54.99,
    imagePath: "/models/watch/dials/orange.svg",
    color: "#FCA311"
  }
];

// Watch Hands


const hands: WatchComponent[] = [
  {
    id: "hands_standard",
    name: "Standard Hands",
    description: "Classic hour, minute and second hands with luminous coating",
    price: 29.99,
    imagePath: "/models/watch/hands/standard.svg",
    material: "Polished Steel"
  },
  {
    id: "hands_sword",
    name: "Sword Hands",
    description: "Straight sword-style hands with luminous fill",
    price: 34.99,
    imagePath: "/models/watch/hands/sword.svg",
    material: "Brushed Steel"
  },
  {
    id: "hands_cathedral",
    name: "Cathedral Hands",
    description: "Vintage cathedral-style hands with luminous fill",
    price: 39.99,
    imagePath: "/models/watch/hands/cathedral.svg",
    material: "Polished Steel"
  },
  {
    id: "hands_gold",
    name: "Gold Dauphine Hands",
    description: "Elegant dauphine-style hands in gold finish",
    price: 44.99,
    imagePath: "/models/watch/hands/gold.svg",
    material: "Gold-Plated Brass"
  },
  {
    id: "hands_snowflake",
    name: "Snowflake Hands",
    description: "Distinctive snowflake-style hands with large luminous area",
    price: 39.99,
    imagePath: "/models/watch/hands/snowflake.svg",
    material: "Brushed Steel"
  }
];

// Watch Bezels
const bezels: WatchComponent[] = [
  {
    id: "bezel_steel",
    name: "Polished Steel Bezel",
    description: "Classic polished steel fixed bezel",
    price: 39.99,
    imagePath: "/models/watch/bezels/steel.svg",
    material: "Polished Stainless Steel"
  },
  {
    id: "bezel_dive",
    name: "Dive Timing Bezel",
    description: "120-click unidirectional rotating dive timing bezel",
    price: 49.99,
    imagePath: "/models/watch/bezels/dive.svg",
    material: "Stainless Steel with Aluminum Insert"
  },
  {
    id: "bezel_gmt",
    name: "GMT Bezel",
    description: "24-hour GMT bezel for tracking multiple time zones",
    price: 59.99,
    imagePath: "/models/watch/bezels/gmt.svg",
    material: "Stainless Steel with Ceramic Insert"
  },
  {
    id: "bezel_fluted",
    name: "Fluted Bezel",
    description: "Decorative fluted bezel with polished finish",
    price: 69.99,
    imagePath: "/models/watch/bezels/fluted.svg",
    material: "Polished Stainless Steel"
  },
  {
    id: "bezel_gold",
    name: "Gold Bezel",
    description: "Luxurious gold-tone fixed bezel",
    price: 79.99,
    imagePath: "/models/watch/bezels/gold.svg",
    material: "Gold PVD-Coated Stainless Steel"
  }
];

export const watchComponents = {
  case: cases,
  dial: dials,
  hands: hands,
  bezel: bezels
};

// Function to calculate total price of a configuration
export const calculateTotalPrice = (config: { [key in ComponentType]: string }): number => {
  let total = 0;
  
  // Sum up the price of each selected component
  Object.entries(config).forEach(([type, id]) => {
    const component = watchComponents[type as ComponentType].find(c => c.id === id);
    if (component) {
      total += component.price;
    }
  });
  
  return total;
};
