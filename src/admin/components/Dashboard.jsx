import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import { 
  Search, 
  Filter, 
  LayoutDashboard, 
  ChevronDown,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  Download
} from "lucide-react";
import Loader from "./Loader";
import Card from "./ui/Card";
import Badge from "./ui/Badge";

// Main App component to render the Dashboard
export default function App() {
  return <Dashboard />;
}

// Mock data for the dashboard cards
const mockCardData = [
  {
    title: "Total Orders",
    value: "1,250",
    change: "+15%",
    trend: "up",
    icon: ShoppingCart,
    color: "blue",
  },
  {
    title: "Revenue",
    value: "$45,231",
    change: "+20%",
    trend: "up",
    icon: DollarSign,
    color: "green",
  },
  {
    title: "New Customers",
    value: "543",
    change: "+10%",
    trend: "up",
    icon: Users,
    color: "purple",
  },
  {
    title: "Products",
    value: "89",
    change: "+5%",
    trend: "up",
    icon: Package,
    color: "orange",
  },
];

// Mock data for the line chart
const mockChartData = [
  { name: "Jan", orders: 4000, revenue: 2400 },
  { name: "Feb", orders: 3000, revenue: 1398 },
  { name: "Mar", orders: 2000, revenue: 9800 },
  { name: "Apr", orders: 2780, revenue: 3908 },
  { name: "May", orders: 1890, revenue: 4800 },
  { name: "Jun", orders: 2390, revenue: 3800 },
  { name: "Jul", orders: 3490, revenue: 4300 },
];

// Mock data for the bar chart
const mockBarChartData = [
  { name: "Electronics", sales: 4000 },
  { name: "Apparel", sales: 3000 },
  { name: "Books", sales: 2000 },
  { name: "Home Goods", sales: 2780 },
];

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const filterDropdownRef = useRef(null);

  // Simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 second loading time
    return () => clearTimeout(timer);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target)
      ) {
        setIsFilterDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterDropdownRef]);

  if (isLoading) {
    return (
      <Loader />
    );
  }

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500 text-blue-700 dark:text-blue-400',
      green: 'bg-green-500 text-green-700 dark:text-green-400',
      purple: 'bg-purple-500 text-purple-700 dark:text-purple-400',
      orange: 'bg-orange-500 text-orange-700 dark:text-orange-400',
    };
    return colors[color] || colors.blue;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <LayoutDashboard className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <Badge variant="success" size="lg">
          Live Data
        </Badge>
      </div>

      {/* Search Bar and Filter Button Section */}
      <div
        className="flex items-center gap-x-4 mb-8 relative"
        ref={filterDropdownRef}
      >
        {/* Search Input Field */}
        <div className="relative flex-1">
          <input
            type="search"
            className="w-full pl-10 pr-4 py-2 text-sm text-gray-900 bg-white dark:bg-gray-800 dark:text-white rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Search..."
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-500 dark:text-gray-400" />
          </div>
        </div>

        {/* Filter Dropdown Button */}
        <button
          type="button"
          onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
          className="flex-shrink-0 flex items-center gap-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          aria-label="Filter"
        >
          <Filter size={18} />
          <span className="hidden sm:inline">Filters</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              isFilterDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Filters Dropdown */}
        {isFilterDropdownOpen && (
          <div className="absolute top-full right-0 mt-2 w-56 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10">
            <ul className="space-y-1">
              <li>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  Last 7 Days
                </button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  Last 30 Days
                </button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  Last 90 Days
                </button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  Custom Range
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mockCardData.map((card, index) => {
          const Icon = card.icon;
          const TrendIcon = card.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <Card key={index} hover className="relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {card.title}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {card.value}
                  </h3>
                  <div className="flex items-center gap-1">
                    <TrendIcon size={14} className={card.trend === 'up' ? 'text-green-600' : 'text-red-600'} />
                    <span className={`text-sm font-medium ${card.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {card.change}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${getColorClasses(card.color)} bg-opacity-10`}>
                  <Icon size={24} />
                </div>
              </div>
              {/* Decorative gradient */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${getColorClasses(card.color).split(' ')[0]}`}></div>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales Trend Chart */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full border-0 shadow-lg">
            <Card.Header className="flex items-center justify-between">
              <div>
                <Card.Title className="text-lg font-semibold">Sales & Revenue Trend</Card.Title>
                <Card.Description>Monthly performance overview</Card.Description>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Calendar size={16} />
                </button>
                <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Download size={16} />
                </button>
              </div>
            </Card.Header>
            <Card.Content>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={mockChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip />
                  <Legend iconType="circle" />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="url(#colorOrders)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card.Content>
          </Card>
        </motion.div>

        {/* Sales by Category Bar Chart */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="h-full border-0 shadow-lg">
            <Card.Header className="flex items-center justify-between">
              <div>
                <Card.Title className="text-lg font-semibold">Sales by Category</Card.Title>
                <Card.Description>Product category breakdown</Card.Description>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Filter size={16} />
                </button>
                <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Download size={16} />
                </button>
              </div>
            </Card.Header>
            <Card.Content>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={mockBarChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={1}/>
                      <stop offset="95%" stopColor="#1d4ed8" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip />
                  <Bar 
                    dataKey="sales" 
                    fill="url(#barGradient)" 
                    radius={[8, 8, 0, 0]}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card.Content>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};
