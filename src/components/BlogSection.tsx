import { motion } from 'framer-motion';
import { ArrowRight, Clock, User, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogs } from '@/data/blogs';

const BlogSection = () => {
  const featuredBlogs = blogs.slice(0, 3);

  return (
    <section id="blog" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-neon-purple/20 text-neon-purple text-sm font-display font-semibold mb-4">
            📚 Knowledge Hub
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Latest <span className="text-gradient-neon">Articles</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            Stay updated with the latest tips, tricks, and insights about streaming, tools, and more.
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredBlogs.map((blog, index) => (
            <motion.article
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link to={`/blog/${blog.slug}`}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="glass-card rounded-2xl overflow-hidden border border-border/50 hover:border-neon-purple/50 transition-all duration-300"
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
                    <h3 className="font-display text-lg font-bold mb-3 group-hover:text-neon-purple transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-muted-foreground text-sm font-body mb-4 line-clamp-2">
                      {blog.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(blog.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
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

                  {/* Hover glow */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{
                      opacity: 1,
                      boxShadow: '0 0 30px hsl(280 100% 60% / 0.2), inset 0 0 30px hsl(280 100% 60% / 0.05)',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/blog">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 border border-neon-purple/50 rounded-full font-display font-semibold hover:bg-neon-purple/30 transition-colors"
            >
              View All Articles
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
