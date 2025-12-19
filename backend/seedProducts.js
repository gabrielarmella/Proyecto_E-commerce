import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./src/models/product.model.js"; // 👈 ajustá la ruta si tu modelo está en otro lado

dotenv.config();

const products = [
  // -----------------------------
  // PC GAMER
  // -----------------------------
  {
    name: "PC Gamer Intel i5 12400F + RTX 3060 12GB",
    price: 650000,
    description: "PC armada lista para jugar en 1080p/144Hz. Ideal para eSports.",
    stock: 8,
    category: "pc-gamer",
    brand: "Custom",
    images: ["https://via.placeholder.com/600x400.png?text=PC+Gamer+Intel+i5"],
    tags: ["pc gamer", "rtx 3060", "intel"],
    isFeatured: true,
  },
  {
    name: "PC Gamer Ryzen 5 5600 + RTX 4060 8GB",
    price: 780000,
    description: "Excelente rendimiento en juegos AAA. Alto desempeño y bajo consumo.",
    stock: 6,
    category: "pc-gamer",
    brand: "Custom",
    images: ["https://via.placeholder.com/600x400.png?text=PC+Gamer+Ryzen+5"],
    tags: ["pc gamer", "ryzen 5", "rtx 4060"],
  },

  // -----------------------------
  // NOTEBOOKS
  // -----------------------------
  {
    name: "Lenovo IdeaPad 3 Ryzen 5 5500U 8GB 512GB SSD",
    price: 480000,
    description: "Notebook ideal para trabajo, estudio y tareas generales.",
    stock: 20,
    category: "notebooks",
    brand: "Lenovo",
    images: ["https://via.placeholder.com/600x400.png?text=Lenovo+IdeaPad+3"],
    tags: ["notebook", "lenovo", "ryzen"],
  },
  {
    name: "HP Pavilion 15 i7 12va gen 16GB 512GB SSD",
    price: 620000,
    description: "Laptop de alto rendimiento para multitarea intensa.",
    stock: 12,
    category: "notebooks",
    brand: "HP",
    images: ["https://via.placeholder.com/600x400.png?text=HP+Pavilion+15"],
    tags: ["hp", "intel i7", "notebook"],
  },

  // -----------------------------
  // CONSOLAS
  // -----------------------------
  {
    name: "PlayStation 5 Standard Edition",
    price: 900000,
    description: "La consola más esperada. Gráficos de nueva generación y SSD ultrarrápido.",
    stock: 5,
    category: "consolas",
    brand: "Sony",
    images: ["https://via.placeholder.com/600x400.png?text=PlayStation+5"],
    tags: ["ps5", "playstation", "sony"],
    isFeatured: true,
  },
  {
    name: "Xbox Series X 1TB",
    price: 850000,
    description: "La consola más potente del mercado. Game Pass ready.",
    stock: 7,
    category: "consolas",
    brand: "Microsoft",
    images: ["https://via.placeholder.com/600x400.png?text=Xbox+Series+X"],
    tags: ["xbox", "series x", "microsoft"],
  },
  {
    name: "Nintendo Switch OLED",
    price: 600000,
    description: "Consola híbrida ideal para jugar en casa o en modo portátil.",
    stock: 15,
    category: "consolas",
    brand: "Nintendo",
    images: ["https://via.placeholder.com/600x400.png?text=Switch+OLED"],
    tags: ["switch", "nintendo"],
  },

  // -----------------------------
  // TELEVISORES
  // -----------------------------
  {
    name: "Samsung Smart TV 55'' Crystal UHD 4K",
    price: 520000,
    description: "Panel 4K con colores vivos y gran nitidez.",
    stock: 12,
    category: "televisores",
    brand: "Samsung",
    images: ["https://via.placeholder.com/600x400.png?text=Samsung+55+4K"],
    tags: ["tv", "4k", "samsung"],
  },
  {
    name: "LG OLED C1 55'' 4K",
    price: 900000,
    description: "Uno de los mejores paneles OLED del mercado. Ideal para gamers.",
    stock: 4,
    category: "televisores",
    brand: "LG",
    images: ["https://via.placeholder.com/600x400.png?text=LG+OLED+C1"],
    tags: ["oled", "tv", "gaming"],
  },

  // -----------------------------
  // COMPONENTES DE PC
  // -----------------------------
  {
    name: "NVIDIA GeForce RTX 4070 12GB",
    price: 820000,
    description: "Placa de video de última generación con DLSS 3.",
    stock: 8,
    category: "componentes",
    brand: "NVIDIA",
    images: ["https://via.placeholder.com/600x400.png?text=RTX+4070"],
    tags: ["gpu", "rtx 4070"],
  },
  {
    name: "AMD Ryzen 7 5800X",
    price: 220000,
    description: "Procesador de 8 núcleos ideal para gaming y productividad.",
    stock: 14,
    category: "componentes",
    brand: "AMD",
    images: ["https://via.placeholder.com/600x400.png?text=Ryzen+7+5800X"],
    tags: ["cpu", "ryzen"],
  },
  {
    name: "Kingston Fury Beast 16GB DDR4 3200MHz",
    price: 42000,
    description: "Memoria RAM de alto rendimiento.",
    stock: 30,
    category: "componentes",
    brand: "Kingston",
    images: ["https://via.placeholder.com/600x400.png?text=Fury+Beast+16GB"],
    tags: ["ram", "ddr4"],
  },
  {
    name: "SSD NVMe Samsung 980 1TB",
    price: 72000,
    description: "Velocidad extrema para cargas instantáneas.",
    stock: 25,
    category: "componentes",
    brand: "Samsung",
    images: ["https://via.placeholder.com/600x400.png?text=Samsung+980+1TB"],
    tags: ["ssd", "nvme"],
  },

  // -----------------------------
  // ACCESORIOS GAMER
  // -----------------------------
  {
    name: "HyperX Cloud II Gaming Headset",
    price: 75000,
    description: "Auriculares legendarios para gamers exigentes.",
    stock: 20,
    category: "accesorios",
    brand: "HyperX",
    images: ["https://via.placeholder.com/600x400.png?text=HyperX+Cloud+II"],
    tags: ["auriculares", "gaming"],
  },
  {
    name: "Logitech G502 HERO Mouse Gamer",
    price: 38000,
    description: "Sensor hero 25K. Precisión y comodidad.",
    stock: 35,
    category: "accesorios",
    brand: "Logitech",
    images: ["https://via.placeholder.com/600x400.png?text=Logitech+G502"],
    tags: ["mouse gamer"],
  },
  {
    name: "Silla Gamer RGB Reclinable",
    price: 155000,
    description: "Silla ergonómica con iluminación RGB.",
    stock: 10,
    category: "accesorios",
    brand: "Generic",
    images: ["https://via.placeholder.com/600x400.png?text=Silla+Gamer+RGB"],
    tags: ["silla gamer", "ergonomica"],
  },

  // -----------------------------
  // MONITORES
  // -----------------------------
  {
    name: "Monitor Samsung 27'' 144Hz Curvo",
    price: 190000,
    description: "Pantalla curva ideal para gaming competitivo.",
    stock: 15,
    category: "monitores",
    brand: "Samsung",
    images: ["https://via.placeholder.com/600x400.png?text=Samsung+27+144Hz"],
    tags: ["monitor", "144hz"],
  },
  {
    name: "Monitor LG 24'' IPS Full HD",
    price: 110000,
    description: "Monitor IPS ideal para oficina y estudio.",
    stock: 25,
    category: "monitores",
    brand: "LG",
    images: ["https://via.placeholder.com/600x400.png?text=LG+24+IPS"],
    tags: ["monitor", "ips"],
  }
];

async function seed() {
  try {
    console.log("Conectando a MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Borrando productos existentes...");
    await Product.deleteMany({});

    console.log("Insertando productos...");
    await Product.insertMany(products);

    console.log(`Se insertaron ${products.length} productos ✔️`);
  } catch (err) {
    console.error("Error en el seed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Conexión cerrada.");
    process.exit(0);
  }
}

seed();