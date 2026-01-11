import { motion } from 'framer-motion';
import { Clock, User, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogs } from '@/data/blogs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InteractiveBackground from '@/components/InteractiveBackground';
import WhatsAppButton from '@/components/WhatsAppButton';

const Blog = () => {
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
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-neon-purple/20 text-neon-purple text-sm font-display font-semibold mb-4">
              📚 Blog
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
              Knowledge <span className="text-gradient-neon">Hub</span>
            </h1>
            <p className="text-muted-foreground font-body max-w-2xl mx-auto">
              Tips, tricks, and insights about streaming, tools, and digital services.
            </p>
          </motion.div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link to={`/blog/${blog.slug}`}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="glass-card rounded-2xl overflow-hidden border border-border/50 hover:border-neon-purple/50 transition-all duration-300 h-full"
                  >
                    {/* Image */}
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-neon-cyan/20 backdrop-blur-sm text-neon-cyan rounded-full text-xs font-display">
                          {blog.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h2 className="font-display text-xl font-bold mb-3 group-hover:text-neon-purple transition-colors line-clamp-2">
                        {blog.title}
                      </h2>
                      <p className="text-muted-foreground text-sm font-body mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(blog.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {blog.readTime}
                          </span>
                        </div>
                        <motion.span
                          className="text-neon-purple flex items-center gap-1"
                          whileHover={{ x: 5 }}
                        >
                          Read
                          <ArrowRight className="w-3 h-3" />
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Blog;
