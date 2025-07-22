import React from 'react'
import { UserCheck, Shield, Truck, Settings } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const Services: React.FC = () => {
  const { t } = useLanguage()

  const services = [
    {
      icon: UserCheck,
      title: t('services.consultation'),
      description: t('services.consultation.desc'),
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
    },
    {
      icon: Shield,
      title: t('services.warranty'),
      description: t('services.warranty.desc'),
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
    },
    {
      icon: Truck,
      title: t('services.delivery'),
      description: t('services.delivery.desc'),
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
    },
    {
      icon: Settings,
      title: t('services.fitting'),
      description: t('services.fitting.desc'),
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
    }
  ]

  return (
    <section id="services" className="section-padding bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('services.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="card group hover:scale-105 animate-fade-in-up text-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300 ${service.color}`}>
                  <service.icon size={28} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center animate-fade-in-up">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 sm:p-12 text-white">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              {t('services.cta.title')}
            </h3>
            <p className="text-lg mb-8 text-primary-100">
              {t('services.cta.description')}
            </p>
            <a
              href="#contact"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              {t('services.cta.button')}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services