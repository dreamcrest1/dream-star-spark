import { motion } from 'framer-motion';
import { Shield, AlertCircle, Clock, CreditCard, Wrench, RefreshCw, HelpCircle } from 'lucide-react';
import { siteContent } from '@/data/siteContent';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InteractiveBackground from '@/components/InteractiveBackground';
import WhatsAppButton from '@/components/WhatsAppButton';

const Terms = () => {
  const { terms, company } = siteContent;

  const policyHighlights = [
    { icon: Shield, title: 'All Sales Final', desc: 'No refunds except as specified', color: 'neon-pink' },
    { icon: RefreshCw, title: 'Free Replacements', desc: 'For non-functional services', color: 'neon-cyan' },
    { icon: Clock, title: '1 Year Warranty', desc: 'On lifetime services', color: 'neon-purple' },
    { icon: CreditCard, title: 'AMC Available', desc: '25-30% annual charge', color: 'neon-orange' },
  ];

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
              Terms & <span className="text-neon-cyan">Conditions</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Please read our policies carefully before making a purchase from {company.name}
            </p>
          </motion.div>

          {/* Policy Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {policyHighlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className={`p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-${item.color}/30 text-center`}
              >
                <item.icon className={`w-8 h-8 text-${item.color} mx-auto mb-2`} />
                <h3 className="font-display text-sm font-bold text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-card/50 backdrop-blur-sm border border-neon-pink/20 rounded-2xl p-8">
              <h2 className="font-display text-2xl font-bold text-neon-pink mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6" />
                {terms.refundPolicy.title}
              </h2>

              <div className="prose prose-invert max-w-none">
                {terms.refundPolicy.content.split('\n').map((line, index) => {
                  const trimmedLine = line.trim();
                  if (!trimmedLine) return null;

                  // Check if it's a numbered item
                  const numberMatch = trimmedLine.match(/^(\d+)\.\s+\*\*(.+)\*\*$/);
                  if (numberMatch) {
                    return (
                      <motion.h3
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.02 }}
                        className="font-display text-lg font-bold text-neon-cyan mt-6 mb-2 flex items-center gap-3"
                      >
                        <span className="w-8 h-8 rounded-full bg-neon-cyan/20 flex items-center justify-center text-sm">
                          {numberMatch[1]}
                        </span>
                        {numberMatch[2]}
                      </motion.h3>
                    );
                  }

                  // Regular content line
                  if (trimmedLine.startsWith('-')) {
                    return (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.02 }}
                        className="text-muted-foreground ml-11 mb-1 list-disc"
                      >
                        {trimmedLine.substring(1).trim()}
                      </motion.li>
                    );
                  }

                  return (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.02 }}
                      className="text-muted-foreground ml-11 mb-2"
                    >
                      {trimmedLine}
                    </motion.p>
                  );
                })}
              </div>

              {/* Important Notice */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 p-4 rounded-xl bg-neon-orange/10 border border-neon-orange/30"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-neon-orange flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-display font-bold text-neon-orange mb-1">Important Notice</h4>
                    <p className="text-sm text-muted-foreground">
                      By purchasing from {company.name}, you agree to all the terms and conditions stated above. 
                      Our policies are designed to ensure fair service while maintaining affordable pricing for all customers.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Need Help */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6 p-4 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-6 h-6 text-neon-cyan flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-display font-bold text-neon-cyan mb-1">Need Help?</h4>
                    <p className="text-sm text-muted-foreground">
                      If you have any questions about our policies, please contact us at{' '}
                      <a href={`tel:${siteContent.contact.mainPhone.replace(/\s/g, '')}`} className="text-neon-pink hover:underline">
                        {siteContent.contact.mainPhone}
                      </a>{' '}
                      or email us at{' '}
                      <a href={`mailto:${siteContent.contact.email}`} className="text-neon-pink hover:underline">
                        {siteContent.contact.email}
                      </a>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Terms;
