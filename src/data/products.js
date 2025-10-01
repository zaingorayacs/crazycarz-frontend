const products = [
  {
    id: 1,
    name: "Sport Coupe",
    category: "sports",
    company: "tesla",
    originalPrice: 45999,
    discount: 10, // discounted = 41,399
    rating: 4.6,
    reviews: 245,
    stock: 15,
    description:
      "Sleek sports car with advanced aerodynamics and powerful engine.",
    image:
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2Fyc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 2,
    name: "Luxury Sedan",
    category: "luxury",
    company: "bmw",
    originalPrice: 52499,
    discount: 15, // discounted = 44,624
    rating: 4.8,
    reviews: 310,
    stock: 12,
    description:
      "Premium sedan with leather interior and state-of-the-art technology.",
    image:
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNhcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 3,
    name: "Electric SUV",
    category: "electric",
    company: "tesla",
    originalPrice: 61999,
    discount: 12, // discounted = 54,159
    rating: 4.7,
    reviews: 198,
    stock: 8,
    description:
      "Zero-emission SUV with extended range and spacious interior.",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y2Fyc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 4,
    name: "Compact Hatchback",
    category: "compact",
    company: "honda",
    originalPrice: 23999,
    discount: 8, // discounted = 22,079
    rating: 4.3,
    reviews: 127,
    stock: 20,
    description:
      "Fuel-efficient city car with modern features and easy parking.",
    image:
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNhcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 5,
    name: "Off-Road Truck",
    category: "trucks",
    originalPrice: 58999,
    discount: 20, // discounted = 47,199
    rating: 4.5,
    reviews: 152,
    stock: 6,
    description:
      "Rugged pickup with 4x4 capability and heavy-duty towing capacity.",
    image:
      "https://images.unsplash.com/photo-1519245659620-e859806a8d3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fGNhcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 6,
    name: "Convertible Roadster",
    category: "sports",
    originalPrice: 72999,
    discount: 18, // discounted = 59,859
    rating: 4.9,
    reviews: 278,
    stock: 4,
    description:
      "Open-top driving experience with high-performance engine and handling.",
    image:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2FycyUyMGNvbnZlcnRpYmxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 7,
    name: "Hybrid Crossover",
    category: "hybrid",
    originalPrice: 38999,
    discount: 14, // discounted = 33,539
    rating: 4.4,
    reviews: 189,
    stock: 18,
    description:
      "Efficient hybrid crossover with excellent fuel economy and spacious interior.",
    image:
      "https://images.unsplash.com/photo-1549317336-206569e8475c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNhcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 8,
    name: "Supercar",
    category: "sports",
    originalPrice: 129999,
    discount: 5, // discounted = 123,499
    rating: 4.9,
    reviews: 89,
    stock: 3,
    description:
      "High-performance supercar with cutting-edge technology and breathtaking speed.",
    image:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGNhcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 9,
    name: "Family Minivan",
    category: "family",
    originalPrice: 32999,
    discount: 11, // discounted = 29,369
    rating: 4.2,
    reviews: 156,
    stock: 14,
    description:
      "Spacious minivan perfect for families with advanced safety features and comfort.",
    image:
      "https://images.unsplash.com/photo-1558618047-7c8c1e0a47df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNhcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 10,
    name: "Classic Muscle Car",
    category: "sports",
    originalPrice: 67999,
    discount: 16, // discounted = 57,119
    rating: 4.7,
    reviews: 203,
    stock: 7,
    description:
      "Iconic muscle car with powerful V8 engine and classic American styling.",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNhcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
  },
];

export default products;
