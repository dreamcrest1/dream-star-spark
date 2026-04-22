import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageCircle, Instagram, Youtube } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InteractiveBackground from '@/components/InteractiveBackground';
import WhatsAppButton from '@/components/WhatsAppButton';
import SEO from '@/components/SEO';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const Contact = () => {
  const { settings } = useSiteSettings();
  const contact = settings.contact || {};
  const social = settings.social || {};
  const seo = settings.seo || {};
  const siteName = seo.siteName || 'Dreamstar Solution';

  const contactItems = [
    {
      icon: Phone,
      label: 'Main Phone',
      value: contact.mainPhone,
      href: `tel:${String(contact.mainPhone || '').replace(/\s/g, '')}`,
      color: 'neon-pink',
    },
    {
      icon: Mail,
      label: 'Email',
      value: contact.email,
      href: `mailto:${contact.email}`,
      color: 'neon-cyan',
    },
    {
      icon: MapPin,
      label: 'Address',
      value: contact.fullAddress,
      href: `https://maps.google.com/?q=${encodeURIComponent(contact.fullAddress || '')}`,
      color: 'neon-purple',
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: contact.mainPhone,
      href: `https://wa.me/${contact.whatsapp || ''}`,
      color: 'neon-orange',
    },
  ].filter((i) => i.value);

  const phones: string[] = contact.phones || [];

  return (
    <div className="min-h-screen relative">
      <SEO
        title={`Contact Us – Get in Touch with ${siteName}`}
        description={`Contact ${siteName} for OTT subscriptions and digital services. Call ${contact.mainPhone || ''} or email ${contact.email || ''}.`}
        keywords="contact dreamstar solution, OTT support India, customer service, WhatsApp support"
      />
      <InteractiveBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Contact <span className="text-neon-pink">Us</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Get in touch with {siteName}. We're here to help you 24/7!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
            {contactItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`group p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-${item.color}/30 hover:border-${item.color} transition-all duration-300`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-${item.color}/20`}>
                    <item.icon className={`w-6 h-6 text-${item.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                    <p className="font-body text-lg text-foreground group-hover:text-neon-cyan transition-colors break-words">
                      {item.value}
                    </p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          {phones.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-4xl mx-auto mb-16"
            >
              <h2 className="font-display text-2xl font-bold text-center text-foreground mb-8">
                All Support <span className="text-neon-cyan">Numbers</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {phones.map((phone) => (
                  <motion.a
                    key={phone}
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    whileHover={{ scale: 1.05 }}
                    className="p-4 rounded-lg bg-background/50 border border-neon-pink/20 hover:border-neon-cyan text-center transition-all"
                  >
                    <Phone className="w-5 h-5 text-neon-pink mx-auto mb-2" />
                    <p className="font-body text-sm text-foreground">{phone}</p>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-md mx-auto text-center mb-16"
          >
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              Follow <span className="text-neon-purple">Us</span>
            </h2>
            <div className="flex justify-center gap-4">
              {social.instagram && (
                <motion.a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white"
                >
                  <Instagram className="w-8 h-8" />
                </motion.a>
              )}
              {social.youtube && (
                <motion.a
                  href={social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  className="p-4 rounded-xl bg-red-600 text-white"
                >
                  <Youtube className="w-8 h-8" />
                </motion.a>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Contact;
