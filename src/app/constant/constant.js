export const compressionProducts=[
    {
      id: 1,
      title: "Compression Half Sleeves T-shirt",
      price: 499,
      image: "/products/compression/compression-half-sleeves-1.jpeg" // Updated
    },
    {
      id: 2,
      title: "Compression Full Sleeves T-shirt",
      price: 699,
      image: "/products/compression/compression-full-sleeves-1.jpeg"
    },
    {
      id: 3,
      title: "Compression Half Sleeves High Neck T-shirt",
      price: 599,
      image: "/products/compression/compression-high-neck-1.jpeg"
    },
    {
      id: 4,
      title: "Compression Sleeveless Tank",
      price: 449,
      image: "/products/compression/compression-tank-1.jpeg"
    },
    
  ];


 export const categories = [
    "Compression Combos", "Compression Fit", "Crop Top", "Joggers", 
    "Leggings/Joggers", "Man", "Shorts", "Socks", "Stringers", 
    "T-Shirt", 
  ];

  export const allProducts = [
  {
    id: 1,
    title: "Compression Half Sleeves T-shirt",
    price: 499,
    originalPrice: 799,
    category: "Compression Fit",
    image: "/products/compression/compression-half-sleeves-1.jpeg",
    images: [
      "/products/compression/compression-half-sleeves-2.jpeg"
    ],
    description: "High-performance compression fit for intense workouts",
    size: ["S", "M", "L", "XL"],
    rating: 4.5,
    reviews: 128,
    inStock: true,
    color: "black"
  },
  {
    id: 2,
    title: "Compression Full Sleeves T-shirt",
    price: 699,
    originalPrice: 999,
    category: "Compression Fit",
    image: "/products/compression/compression-full-sleeves-1.jpeg",
    images: [
      "/products/compression/compression-full-sleeves-2.jpeg"
    ],
    description: "Comfortable fit with moisture-wicking fabric",
    size: ["S", "M", "L", "XL"],
    rating: 4.3,
    reviews: 89,
    inStock: true,
    color: "navy"
  },
  {
    id: 3,
    title: "Compression Half Sleeves High Neck T-shirt",
    price: 599,
    originalPrice: 899,
    category: "Compression Fit",
    image: "/products/compression/compression-high-neck-1.jpeg",
    images: [
      "/products/compression/compression-high-neck-2.jpeg",
      "/products/compression/compression-high-neck-3.jpeg"
    ],
    description: "Lightweight jacket perfect for warm-up sessions",
    size: ["S", "M", "L", "XL"],
    rating: 4.7,
    reviews: 156,
    inStock: true,
    color: "gray"
  },
  {
    id: 4,
    title: "Compression Sleeveless Tank",
    price: 449,
    originalPrice: 649,
    category: "Compression Fit",
    image: "/products/compression/compression-tank-1.jpeg",
    images: [
      "/products/compression/compression-tank-2.jpeg"
    ],
    description: "Classic stringer design for bodybuilding",
    size: ["S", "M", "L", "XL"],
    rating: 4.4,
    reviews: 73,
    inStock: true,
    color: "white"
  },
  {
    id: 5,
    title: "Performance Joggers",
    price: 699,
    originalPrice: 999,
    category: "joggers",
    image: "/categories/joggers.jpeg",
    images: [
      "/categories/joggers.jpeg"
    ],
    description: "Comfortable fit with moisture-wicking fabric",
    size: ["S", "M", "L", "XL"],
    rating: 4.2,
    reviews: 45,
    inStock: true,
    color: "black"
  },
  {
    id: 6,
    title: "Training Jacket",
    price: 899,
    originalPrice: 1299,
    category: "jacket",
    image: "/categories/jacket.jpeg",
    images: [
      "/categories/jacket.jpeg"
    ],
    description: "Lightweight jacket perfect for warm-up sessions",
    size: ["S", "M", "L", "XL"],
    rating: 4.6,
    reviews: 92,
    inStock: true,
    color: "blue"
  },
  // Add more products as needed
];


export const slides = [
  {
    mobile: "/slideshow.png",
    desktop: "/slideshow.png",
    link: "https://www.instagram.com/blackwizardsports?igsh=OHpzbnBudTR5ODB4",
  },
  {
    mobile: "/slideshow.png",
    desktop: "/slideshow.png",
    link: "https://www.instagram.com/blackwizardsports?igsh=OHpzbnBudTR5ODB4",
  },
];




export const BASE_URL = "http://localhost:3001/api";
