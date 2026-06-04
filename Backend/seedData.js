// seedData.js
require('dotenv').config();  // Make sure this is at the VERY TOP
const mongoose = require('mongoose');

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  description: String,
  price: Number,
  originalPrice: Number,
  discount: Number,
  image: String,
  compatiblePrinters: String,
  stock: Number,
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);

const sampleProducts = [
  // HP Products
  {
    name: "HP 61 Black Ink Cartridge",
    brand: "hp",
    description: "Original HP ink cartridge for HP Deskjet printers",
    price: 1100,
    originalPrice: 2800,
    discount: 61,
    image: "https://picsum.photos/id/20/300/300",
    compatiblePrinters: "HP Deskjet 1000, 1050, 1510, 2000, 2050",
    stock: 50,
  },
  {
    name: "HP 61 Tri-color Ink Cartridge",
    brand: "hp",
    description: "Original HP tri-color ink cartridge",
    price: 1200,
    originalPrice: 3000,
    discount: 60,
    image: "https://picsum.photos/id/21/300/300",
    compatiblePrinters: "HP Deskjet 1000, 1050, 1510, 2000, 2050",
    stock: 45,
  },
  {
    name: "HP 62 Black Ink Cartridge",
    brand: "hp",
    description: "High-yield black ink cartridge",
    price: 1500,
    originalPrice: 3500,
    discount: 57,
    image: "https://picsum.photos/id/22/300/300",
    compatiblePrinters: "HP Envy 4500, 5540, 5640, OfficeJet 5740",
    stock: 30,
  },
  {
    name: "HP 62 Tri-color Ink Cartridge",
    brand: "hp",
    description: "High-yield tri-color ink cartridge",
    price: 1600,
    originalPrice: 3800,
    discount: 58,
    image: "https://picsum.photos/id/23/300/300",
    compatiblePrinters: "HP Envy 4500, 5540, 5640, OfficeJet 5740",
    stock: 28,
  },
  {
    name: "HP 63 Black Ink Cartridge",
    brand: "hp",
    description: "Standard black ink cartridge",
    price: 950,
    originalPrice: 2200,
    discount: 57,
    image: "https://picsum.photos/id/24/300/300",
    compatiblePrinters: "HP Deskjet 1112, 2132, 3630, Envy 4520",
    stock: 60,
  },
  {
    name: "HP 63 Tri-color Ink Cartridge",
    brand: "hp",
    description: "Standard tri-color ink cartridge",
    price: 1050,
    originalPrice: 2500,
    discount: 58,
    image: "https://picsum.photos/id/25/300/300",
    compatiblePrinters: "HP Deskjet 1112, 2132, 3630, Envy 4520",
    stock: 55,
  },
  {
    name: "HP 64 Black Ink Cartridge",
    brand: "hp",
    description: "Premium black ink cartridge",
    price: 1300,
    originalPrice: 2900,
    discount: 55,
    image: "https://picsum.photos/id/26/300/300",
    compatiblePrinters: "HP Envy 5055, 6055, 7155, Tango",
    stock: 35,
  },
  {
    name: "HP 64 Tri-color Ink Cartridge",
    brand: "hp",
    description: "Premium tri-color ink cartridge",
    price: 1450,
    originalPrice: 3300,
    discount: 56,
    image: "https://picsum.photos/id/27/300/300",
    compatiblePrinters: "HP Envy 5055, 6055, 7155, Tango",
    stock: 32,
  },
  {
    name: "HP 65 Black Ink Cartridge",
    brand: "hp",
    description: "Value black ink cartridge",
    price: 850,
    originalPrice: 2000,
    discount: 57,
    image: "https://picsum.photos/id/28/300/300",
    compatiblePrinters: "HP Deskjet 2622, 2632, 3720, 3755",
    stock: 70,
  },
  {
    name: "HP 65 Tri-color Ink Cartridge",
    brand: "hp",
    description: "Value tri-color ink cartridge",
    price: 950,
    originalPrice: 2300,
    discount: 59,
    image: "https://picsum.photos/id/29/300/300",
    compatiblePrinters: "HP Deskjet 2622, 2632, 3720, 3755",
    stock: 65,
  },
  
  // Canon Products
  {
    name: "Canon PG-245 Black Ink Cartridge",
    brand: "canon",
    description: "Original Canon black ink cartridge",
    price: 1050,
    originalPrice: 2500,
    discount: 58,
    image: "https://picsum.photos/id/30/300/300",
    compatiblePrinters: "Canon Pixma MG2420, MG2520, MG2920, MX492",
    stock: 40,
  },
  {
    name: "Canon CL-246 Color Ink Cartridge",
    brand: "canon",
    description: "Original Canon color ink cartridge",
    price: 1150,
    originalPrice: 2800,
    discount: 59,
    image: "https://picsum.photos/id/31/300/300",
    compatiblePrinters: "Canon Pixma MG2420, MG2520, MG2920",
    stock: 38,
  },
  {
    name: "Canon PG-275 Black Ink Cartridge",
    brand: "canon",
    description: "High-yield black ink cartridge",
    price: 1400,
    originalPrice: 3200,
    discount: 56,
    image: "https://picsum.photos/id/32/300/300",
    compatiblePrinters: "Canon Pixma TS3120, TS5120, TS6120",
    stock: 25,
  },
  {
    name: "Canon CL-276 Color Ink Cartridge",
    brand: "canon",
    description: "High-yield color ink cartridge",
    price: 1550,
    originalPrice: 3600,
    discount: 57,
    image: "https://picsum.photos/id/33/300/300",
    compatiblePrinters: "Canon Pixma TS3120, TS5120, TS6120",
    stock: 22,
  },
  
  // Epson Products
  {
    name: "Epson 220 Black Ink Cartridge",
    brand: "epson",
    description: "Original Epson black ink cartridge",
    price: 980,
    originalPrice: 2300,
    discount: 57,
    image: "https://picsum.photos/id/35/300/300",
    compatiblePrinters: "Epson Expression XP-330, XP-430, XP-530",
    stock: 55,
  },
  {
    name: "Epson 220 Color Ink Cartridge",
    brand: "epson",
    description: "Original Epson color ink cartridge",
    price: 1080,
    originalPrice: 2600,
    discount: 58,
    image: "https://picsum.photos/id/36/300/300",
    compatiblePrinters: "Epson Expression XP-330, XP-430, XP-530",
    stock: 52,
  },
  {
    name: "Epson 410 Black Ink Cartridge",
    brand: "epson",
    description: "High-capacity black ink cartridge",
    price: 1900,
    originalPrice: 4200,
    discount: 55,
    image: "https://picsum.photos/id/37/300/300",
    compatiblePrinters: "Epson WorkForce Pro WF-3720, WF-4730",
    stock: 18,
  },
];

async function seedDatabase() {
  try {
    // Get the MongoDB URI from environment variables
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      console.error("❌ MONGODB_URI not found in .env file");
      console.log("Please make sure your .env file has:");
      console.log("MONGODB_URI=mongodb+srv://tkgenia1234:giakatufu07@cluster0.pw4wcku.mongodb.net/Rose_db");
      process.exit(1);
    }
    
    console.log("📡 Connecting to MongoDB Atlas...");
    console.log("Using URI:", MONGODB_URI.replace(/\/\/(.*)@/, '//***:***@')); // Hide password in logs
    
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB Atlas!");
    
    // Delete existing products
    const deleted = await Product.deleteMany({});
    console.log(`🗑️  Deleted ${deleted.deletedCount} existing products`);
    
    // Insert new products
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${inserted.length} products successfully!`);
    
    console.log("\n📊 Products by brand:");
    const hpCount = await Product.countDocuments({ brand: "hp" });
    const canonCount = await Product.countDocuments({ brand: "canon" });
    const epsonCount = await Product.countDocuments({ brand: "epson" });
    console.log(`   - HP: ${hpCount} products`);
    console.log(`   - Canon: ${canonCount} products`);
    console.log(`   - Epson: ${epsonCount} products`);
    
    await mongoose.disconnect();
    console.log("\n✅ Database seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    console.log("\n💡 Troubleshooting:");
    console.log("1. Check your internet connection");
    console.log("2. Verify your MongoDB Atlas password in .env file");
    console.log("3. Make sure your IP is whitelisted in MongoDB Atlas");
    process.exit(1);
  }
}

seedDatabase();