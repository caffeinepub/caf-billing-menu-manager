export interface PublicMenuItem {
  name: string;
  price: number; // in rupees
}

export interface PublicMenuCategory {
  name: string;
  emoji: string;
  items: PublicMenuItem[];
}

export const PUBLIC_MENU: PublicMenuCategory[] = [
  {
    name: "Tea",
    emoji: "🍵",
    items: [
      { name: "Small Tea", price: 10 },
      { name: "Normal Tea", price: 20 },
      { name: "Masala Tea", price: 25 },
      { name: "Ginger Tea", price: 25 },
      { name: "Elaichi Tea", price: 25 },
      { name: "Kesar Tea", price: 40 },
      { name: "Malai Tea", price: 30 },
      { name: "Green Tea", price: 30 },
      { name: "Black Tea", price: 20 },
      { name: "Lemon Tea", price: 20 },
      { name: "Darjeeling Tea", price: 35 },
      { name: "Lemon Iced Tea (300 ML)", price: 60 },
    ],
  },
  {
    name: "Coffee",
    emoji: "☕",
    items: [
      { name: "Milk Coffee", price: 40 },
      { name: "Cappuccino", price: 60 },
      { name: "Americano", price: 50 },
      { name: "Iced Americano", price: 70 },
      { name: "Cold Coffee", price: 70 },
    ],
  },
  {
    name: "Sandwich",
    emoji: "🥪",
    items: [
      { name: "Veg Sandwich", price: 60 },
      { name: "Cheese Corn Sandwich", price: 85 },
      { name: "Paneer Sandwich", price: 100 },
      { name: "Double Jumbo Sandwich", price: 120 },
    ],
  },
  {
    name: "Toast",
    emoji: "🍞",
    items: [
      { name: "Butter Toast", price: 40 },
      { name: "Peri Peri Toast", price: 50 },
      { name: "Jam Toast", price: 40 },
      { name: "Malai Toast", price: 50 },
    ],
  },
  {
    name: "Light Snacks",
    emoji: "🍜",
    items: [
      { name: "Wai Wai (Soup)", price: 45 },
      { name: "Wai Wai (Dry)", price: 45 },
      { name: "Maggi (Soup)", price: 45 },
      { name: "Maggi (Dry)", price: 45 },
      { name: "Butter Maggi", price: 55 },
      { name: "Vegetables Maggi", price: 60 },
      { name: "Cheese Maggi", price: 65 },
      { name: "Corn Maggi", price: 70 },
      { name: "Cheese Corn Maggi", price: 75 },
      { name: "Pasta (Red)", price: 85 },
      { name: "Pasta (White)", price: 85 },
    ],
  },
  {
    name: "Momos",
    emoji: "🥟",
    items: [
      { name: "Veg Momo (Steam – 8 pcs)", price: 50 },
      { name: "Veg Momo (Fry – 6 pcs)", price: 60 },
      { name: "Cheese Momo (Steam – 8 pcs)", price: 70 },
      { name: "Cheese Momo (Fry – 6 pcs)", price: 80 },
      { name: "Corn Cheese Momo (Steam – 8 pcs)", price: 80 },
      { name: "Corn Cheese Momo (Fry – 6 pcs)", price: 90 },
      { name: "Paneer Momo (Steam – 8 pcs)", price: 90 },
      { name: "Paneer Momo (Fry – 6 pcs)", price: 100 },
      { name: "Kurkure Momo", price: 80 },
      { name: "Chilli Momo", price: 80 },
    ],
  },
  {
    name: "Burgers",
    emoji: "🍔",
    items: [
      { name: "Veg Burger", price: 60 },
      { name: "Cheese Burger", price: 70 },
      { name: "Paneer Burger", price: 90 },
    ],
  },
  {
    name: "Starters",
    emoji: "🍟",
    items: [
      { name: "French Fries", price: 70 },
      { name: "Peri Peri Fries", price: 85 },
      { name: "American Corn", price: 80 },
      { name: "Chilli Potato", price: 90 },
      { name: "Baby Corn Chilli", price: 100 },
      { name: "Paneer Pakora (6 pcs)", price: 90 },
      { name: "Smileys (6 pcs)", price: 75 },
      { name: "Potato Cheese Shots (7 pcs)", price: 70 },
    ],
  },
  {
    name: "Refreshers",
    emoji: "🥤",
    items: [
      { name: "Masala Coke", price: 50 },
      { name: "Fresh Lime Soda", price: 50 },
      { name: "Mojito", price: 75 },
    ],
  },
  {
    name: "Beverages",
    emoji: "💧",
    items: [
      { name: "Water (500 ML)", price: 10 },
      { name: "Water (1 Litre)", price: 20 },
      { name: "Water (2 Litre)", price: 30 },
      { name: "Soft Drink", price: 40 },
    ],
  },
  {
    name: "Combo",
    emoji: "🎁",
    items: [
      { name: "Masala / Ginger Tea + Butter Toast", price: 55 },
      { name: "Normal Tea + Malai Toast", price: 65 },
      { name: "Veg Sandwich + Normal Tea", price: 75 },
      { name: "Maggi + Milk Coffee", price: 80 },
      { name: "French Fries + Cold Coffee", price: 135 },
      { name: "Corn Cheese Sandwich + Cold Coffee", price: 150 },
      { name: "Veg Momo + Lemon Iced Tea", price: 105 },
      { name: "Paneer Pakora (6 pcs) + Masala Tea", price: 110 },
      { name: "Pasta + Cold Coffee", price: 150 },
      { name: "Veg Burger + Smileys (6 pcs) + Tea", price: 140 },
      { name: "Chilli Potato + Green Tea", price: 115 },
      { name: "Paneer Sandwich + Peri Peri Fries", price: 180 },
      { name: "Cheese Burger + Peri Peri Fries + Cold Coffee", price: 210 },
    ],
  },
];
