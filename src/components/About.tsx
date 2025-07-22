import React from 'react'
import { Award, Users, Eye } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const About: React.FC = () => {
  const { t } = useLanguage()

  const features = [
    {
      icon: Award,
      title: '10+',
      subtitle: t('about.experience'),
      description: t('about.experience.desc')
    },
    {
      icon: Users,
      title: '5000+',
      subtitle: t('about.customers'),
      description: t('about.customers.desc')
    },
    {
      icon: Eye,
      title: '1000+',
      subtitle: t('about.products'),
      description: t('about.products.desc')
    }
  ]

  return (
    <section id="about" className="section-padding bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="animate-fade-in-up">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556306535-38febf6782e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80"
                alt="About VisionCraft"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
            </div>
          </div>

          {/* Content */}
          <div className="animate-slide-in-right">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('about.title')}
            </h2>
            <h3 className="text-xl text-primary-600 dark:text-primary-400 mb-6">
              {t('about.subtitle')}
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {t('about.description')}
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon size={24} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {feature.title}
                  </div>
                  <div className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-2">
                    {feature.subtitle}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About