import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { products, type Product } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InteractiveBackground from '@/components/InteractiveBackground';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Category mapping from URL slugs to actual category names
const categoryMap: Record<string, string> = {
  'ai-tools': 'AI Tools',
  'video-editing': 'Video Editing',
  'office': 'Office Essentials',
  'lead-gen': 'Lead Generation',
  'digital-assets': 'Cloud Services',
  'indian-ott': 'Indian OTT',
  'international-ott': 'International OTT',
  'software': 'Software',
  'writing-tools': 'Writing Tools',
  'seo': 'SEO',
};

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [showFilters, setShowFilters] = useState(false);

  // Set category from URL on mount
  useEffect(() => {
    if (categoryFromUrl) {
      const mappedCategory = categoryMap[categoryFromUrl];
      if (mappedCategory) {
        setSelectedCategory(mappedCategory);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categoryFromUrl]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))];
    return cats.sort();
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.salePrice || a.regularPrice) - (b.salePrice || b.regularPrice));
        break;
      case 'price-high':
        result.sort((a, b) => (b.salePrice || b.regularPrice) - (a.salePrice || a.regularPrice));
        break;
      case 'discount':
        result.sort((a, b) => {
          const discountA = a.salePrice ? ((a.regularPrice - a.salePrice) / a.regularPrice) * 100 : 0;
          const discountB = b.salePrice ? ((b.regularPrice - b.salePrice) / b.regularPrice) * 100 : 0;
          return discountB - discountA;
        });
        break;
      default:
        result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen relative">
      <InteractiveBackground />
      <Navbar />
      
      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              All <span className="text-neon-cyan">Products</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our complete collection of {products.length}+ premium digital products
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            {/* Search Bar */}
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-neon-pink/30 focus:border-neon-cyan"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-neon-pink/30 hover:border-neon-cyan md:hidden"
              >
                <Filter className="w-5 h-5" />
              </Button>
            </div>

            {/* Filters Row */}
            <div className={`flex flex-wrap gap-4 ${showFilters ? 'flex' : 'hidden md:flex'}`}>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[200px] bg-background/50 border-neon-pink/30">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[200px] bg-background/50 border-neon-pink/30">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="discount">Biggest Discount</SelectItem>
                </SelectContent>
              </Select>

              {(searchQuery || selectedCategory !== 'all') && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="text-neon-pink hover:text-neon-cyan"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Results count */}
            <p className="text-sm text-muted-foreground mt-4">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </motion.div>

          {/* Products Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          {/* No results */}
          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-xl text-muted-foreground mb-4">No products found</p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="bg-gradient-neon text-foreground"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Products;
