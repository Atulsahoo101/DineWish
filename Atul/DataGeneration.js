const fs = require("fs");
const { Parser } = require("json2csv");

// Sample Odia Dishes categorized
const categories = {
  breakfast: ["Pakhala Bhata", "Chhena Poda", "Bara", "Dalma", "Ghugni", "Kanika"],
  lunch: ["Dalma", "Macha Besara", "Santula", "Chingudi Jhola", "Saga Bhaja", "Mansa Tarkari"],
  dinner: ["Mutton Kassa", "Khaja", "Dahi Baigana", "Alu Dum", "Mati Handi Mutton", "Chuna Machha Tarkari"],
  snacks: ["Poda Pitha", "Chhena Gaja", "Ghugni Chat", "Aloo Chop", "Dahibara Aludum"],
  drinks: ["Lassi", "Palm Juice", "Buttermilk", "Tea", "Black Coffee"],
};

// Pairing combinations
const foodCombinations = {
  "Pakhala Bhata": "Badi Chura",
  "Macha Besara": "Chingudi Jhola",
  "Dalma": "Rice & Saga Bhaja",
  "Dahibara Aludum": "Gupchup",
  "Mutton Kassa": "Khaja",
  "Kanika": "Chhena Poda",
  "Ghugni": "Piaji",
  "Poda Pitha": "Tea",
};

// Other random attributes
const sessions = ["Dine-in", "Takeaway", "Online"];
const tastePreferences = ["Spicy", "Sweet", "Mild", "Savory"];
const budgets = ["Low", "Medium", "High"];
const groupSizes = [1, 2, 4, 6, "Family Pack"];

// Function to generate random orders
const generateOrders = (numOrders) => {
  const orders = [];

  for (let i = 0; i < numOrders; i++) {
    const category = Object.keys(categories)[Math.floor(Math.random() * Object.keys(categories).length)];
    const mainDish = categories[category][Math.floor(Math.random() * categories[category].length)];
    const pairedDish = foodCombinations[mainDish] || "None";

    orders.push({
      orderId: i + 1,
      category: category,
      mainDish: mainDish,
      pairedDish: pairedDish,
      session: sessions[Math.floor(Math.random() * sessions.length)],
      taste: tastePreferences[Math.floor(Math.random() * tastePreferences.length)],
      budget: budgets[Math.floor(Math.random() * budgets.length)],
      groupSize: groupSizes[Math.floor(Math.random() * groupSizes.length)],
    });
  }

  return orders;
};

// Generate 5000 orders
const ordersData = generateOrders(5000);

// Convert JSON to CSV
const json2csvParser = new Parser();
const csv = json2csvParser.parse(ordersData);

// Save CSV file
fs.writeFileSync("odia_food_orders.csv", csv, "utf8");
console.log("Generated dataset saved as 'odia_food_orders.csv'");
