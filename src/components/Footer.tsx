import React from 'react'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const Footer: React.FC = () => {
  const { t } = useLanguage()

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'Youtube' }
  ]

  const quickLinks = [
    { key: 'nav.home', href: '#home' },
    { key: 'nav.about', href: '#about' },
    { key: 'nav.products', href: '#products' },
    { key: 'nav.services', href: '#services' },
    { key: 'nav.contact', href: '#contact' }
  ]

  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-primary-400 mb-4">
              VisionCraft Eyewear
            </h3>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.links')}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors duration-300"
                  >
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.contact')}</h4>
            <div className="space-y-3 text-gray-300">
              <p className="text-sm">123 Phố Huế, Quận Hai Bà Trưng, Hà Nội</p>
              <p className="text-sm">+84 24 3xxx xxxx</p>
              <p className="text-sm">info@visioncraft.vn</p>
              <p className="text-sm">T2-T7: 9:00 - 21:00<br />CN: 9:00 - 18:00</p>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 my-8" />
        
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 sm:mb-0">
            {t('footer.rights')}
          </p>
          <div className="flex space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-primary-400 transition-colors duration-300">
              {t('footer.privacy')}
            </a>
            <a href="#" className="hover:text-primary-400 transition-colors duration-300">
              {t('footer.terms')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer