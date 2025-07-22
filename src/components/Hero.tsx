import React from 'react'
import { ChevronRight, Phone } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const Hero: React.FC = () => {
  const { t } = useLanguage()

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Eyewear Collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4">
              {t('hero.title')}
            </h1>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium text-accent-400 mb-6">
              {t('hero.subtitle')}
            </h2>
          </div>
          
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
              {t('hero.description')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <a
              href="#products"
              className="group btn-primary inline-flex items-center justify-center"
            >
              {t('hero.cta.primary')}
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contact"
              className="btn-secondary inline-flex items-center justify-center bg-white/10 border-white text-white hover:bg-white hover:text-gray-900"
            >
              <Phone className="mr-2 w-5 h-5" />
              {t('hero.cta.secondary')}
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">10+</div>
              <div className="text-sm sm:text-base text-gray-300">{t('about.experience')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">5000+</div>
              <div className="text-sm sm:text-base text-gray-300">{t('about.customers')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">1000+</div>
              <div className="text-sm sm:text-base text-gray-300">{t('about.products')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  )
}

export default Hero