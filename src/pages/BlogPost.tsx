import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, User, Share2 } from 'lucide-react';
import { blogs } from '@/data/blogs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const blog = blogs.find(b => b.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!blog) {
    return (
      <div className="min-h-screen relative bg-background">
        <Navbar />
        <main className="relative z-10 pt-24 pb-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">Article Not Found</h1>
            <Link to="/blog">
              <Button className="bg-gradient-neon">Back to Blog</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedPosts = blogs.filter(b => b.category === blog.category && b.id !== blog.id).slice(0, 2);

  return (
    <div className="min-h-screen relative bg-background">
      <Navbar />

      <main className="relative z-10 pt-24 pb-16">
        <article className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-neon-purple transition-colors font-body"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-video rounded-2xl overflow-hidden mb-8"
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-40" />
          </motion.div>

          {/* Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center gap-4 mb-6"
          >
            <span className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan rounded-full text-sm font-display">
              {blog.category}
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {new Date(blog.date).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {blog.readTime} read
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              {blog.author}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="font-display text-3xl md:text-5xl font-bold mb-8"
          >
            {blog.title}
          </motion.h1>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-invert prose-lg max-w-none mb-12"
          >
            <div className="text-foreground font-body leading-relaxed whitespace-pre-wrap">
              {blog.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph.startsWith('**') && paragraph.endsWith('**') 
                    ? <strong className="text-neon-cyan font-display">{paragraph.slice(2, -2)}</strong>
                    : paragraph.startsWith('- ') 
                      ? <span className="block pl-4 border-l-2 border-neon-pink/50">{paragraph.slice(2)}</span>
                      : paragraph
                  }
                </p>
              ))}
            </div>
          </motion.div>

          {/* Share */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 pb-8 border-b border-border/50"
          >
            <span className="text-muted-foreground font-body">Share this article:</span>
            <button 
              onClick={() => navigator.share?.({ title: blog.title, url: window.location.href })}
              className="p-2 rounded-full bg-neon-purple/20 hover:bg-neon-purple/30 transition-colors"
            >
              <Share2 className="w-4 h-4 text-neon-purple" />
            </button>
          </motion.div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12"
            >
              <h3 className="font-display text-2xl font-bold mb-6">
                Related <span className="text-neon-purple">Articles</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedPosts.map(post => (
                  <Link key={post.id} to={`/blog/${post.slug}`}>
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="glass-card rounded-xl p-4 border border-border/50 hover:border-neon-purple/50 transition-all flex gap-4"
                    >
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-display font-bold mb-2 line-clamp-2">{post.title}</h4>
                        <span className="text-xs text-muted-foreground">{post.readTime}</span>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </article>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default BlogPost;
