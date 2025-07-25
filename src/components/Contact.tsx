import React from 'react'
import { MapPin, Phone, Mail, Clock, Navigation, PhoneCall, Send, LucideIcon } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

// Define interface for contact info
interface ContactInfoItem {
  icon: LucideIcon
  title: string
  value: string
  color: string
  action?: () => void
  actionLabel?: string
  actionIcon?: LucideIcon
  actionTitle?: string
}

const Contact: React.FC = () => {
  const { t } = useLanguage()

  // Thông tin cửa hàng
  const storeLocation = {
    name: 'VisionCraft Eyewear',
    address: '123 Phố Huế, Quận Hai Bà Trưng, Hà Nội',
    lat: 21.014430193979996,
    lng: 105.85240731476271
  }

  // Hàm mở chỉ đường Google Maps
  const openDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${storeLocation.lat},${storeLocation.lng}&travelmode=driving`
    window.open(url, '_blank')
  }

  // Hàm mở Google Maps tại vị trí cửa hàng
  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${storeLocation.lat},${storeLocation.lng}`
    window.open(url, '_blank')
  }

  // Hàm gọi điện thoại
  const makePhoneCall = () => {
    window.open('tel:+842430000000', '_self')
  }

  // Hàm gửi email
  const sendEmail = () => {
    window.open('mailto:info@visioncraft.vn?subject=Liên hệ VisionCraft Eyewear', '_blank')
  }

  const contactInfo: ContactInfoItem[] = [
    {
      icon: MapPin,
      title: t('contact.address'),
      value: t('contact.address.value'),
      color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
      action: openDirections,
      actionLabel: 'Chỉ đường',
      actionIcon: Navigation,
      actionTitle: 'Chỉ đường đến cửa hàng'
    },
    {
      icon: Phone,
      title: t('contact.phone'),
      value: '+84 24 3xxx xxxx',
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      action: makePhoneCall,
      actionLabel: 'Gọi ngay',
      actionIcon: PhoneCall,
      actionTitle: 'Gọi điện ngay'
    },
    {
      icon: Mail,
      title: t('contact.email'),
      value: 'info@visioncraft.vn',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      action: sendEmail,
      actionLabel: 'Gửi email',
      actionIcon: Send,
      actionTitle: 'Gửi email'
    },
    {
      icon: Clock,
      title: t('contact.hours'),
      value: t('contact.hours.value'),
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
    }
  ]

  return (
    <section id="contact" className="section-padding bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('contact.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="card p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {t('contact.info.title')}
              </h3>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start justify-between group">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`p-3 rounded-lg ${item.color}`}>
                        <item.icon size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {item.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {item.value}
                        </p>
                      </div>
                    </div>
                    {item.action && (
                      <button
                        onClick={item.action}
                        className="ml-4 p-2 rounded-lg bg-accent-500 text-white hover:bg-accent-600 transition-colors duration-300 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                        title={item.actionTitle}
                      >
                        {item.actionIcon && <item.actionIcon size={16} />}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="animate-slide-in-right">
            <div className="card p-0 overflow-hidden h-full min-h-[400px]">
              {/* Option 1: Simple iframe embed với marker */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.6951404106414!2d105.85240731476271!3d21.014430193979996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab953357c995%3A0x92d5aee775e25a24!2sVisionCraft%20Eyewear%20-%20123%20Pho%20Hue%2C%20Hai%20Ba%20Trung%2C%20Hanoi%2C%20Vietnam!5e0!3m2!1sen!2s!4v1640000000000!5m2!1sen!2s&markers=color:red%7Clabel:V%7C21.014430193979996,105.85240731476271"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="VisionCraft Eyewear Location"
              ></iframe>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-16 animate-fade-in-up">
          <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl p-8 sm:p-12 text-white text-center">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              {t('contact.cta.title')}
            </h3>
            <p className="text-lg mb-6 text-accent-100">
              {t('contact.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+84243xxxxxx"
                className="inline-flex items-center px-6 py-3 bg-white text-accent-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <Phone className="mr-2 w-5 h-5" />
                {t('contact.cta.call')}
              </a>
              <a
                href="mailto:info@visioncraft.vn"
                className="inline-flex items-center px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-accent-600 transition-colors duration-300"
              >
                <Mail className="mr-2 w-5 h-5" />
                {t('contact.cta.email')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact