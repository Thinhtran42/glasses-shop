import React, { createContext, useContext, useState, ReactNode } from 'react'

interface LanguageContextType {
  language: 'vi' | 'en'
  setLanguage: (lang: 'vi' | 'en') => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  vi: {
    // Header
    'nav.home': 'Trang chủ',
    'nav.about': 'Giới thiệu',
    'nav.products': 'Sản phẩm',
    'nav.services': 'Dịch vụ',
    'nav.contact': 'Liên hệ',
    
    // Hero
    'hero.title': 'VisionCraft Eyewear',
    'hero.subtitle': 'Shop Kính Mắt Cao Cấp Hà Nội',
    'hero.description': 'Khám phá bộ sưu tập kính mắt thời trang và chất lượng cao từ các thương hiệu nổi tiếng thế giới. Chúng tôi mang đến cho bạn phong cách và sự bảo vệ hoàn hảo cho đôi mắt.',
    'hero.cta.primary': 'Khám phá ngay',
    'hero.cta.secondary': 'Liên hệ tư vấn',
    
    // About
    'about.title': 'Về VisionCraft Eyewear',
    'about.subtitle': 'Hơn 10 năm kinh nghiệm trong ngành kính mắt',
    'about.description': 'VisionCraft Eyewear là địa chỉ tin cậy cho những ai yêu thích kính mắt thời trang và chất lượng tại Hà Nội. Với đội ngũ chuyên gia giàu kinh nghiệm và bộ sưu tập đa dạng từ các thương hiệu nổi tiếng, chúng tôi cam kết mang đến cho khách hàng trải nghiệm mua sắm tuyệt vời nhất.',
    'about.experience': 'Năm kinh nghiệm',
    'about.experience.desc': 'Kinh nghiệm lâu năm trong ngành kính mắt',
    'about.customers': 'Khách hàng hài lòng',
    'about.customers.desc': 'Khách hàng tin tưởng và hài lòng',
    'about.products': 'Sản phẩm chất lượng',
    'about.products.desc': 'Sản phẩm chất lượng cao từ các thương hiệu nổi tiếng',
    
    // Products
    'products.title': 'Sản phẩm nổi bật',
    'products.subtitle': 'Bộ sưu tập kính mắt cao cấp',
    'products.sunglasses': 'Kính râm',
    'products.sunglasses.desc': 'Bộ sưu tập kính râm thời trang từ các thương hiệu nổi tiếng',
    'products.prescription': 'Kính cận',
    'products.prescription.desc': 'Kính cận chất lượng cao với tròng kính hiện đại',
    'products.frames': 'Gọng kính',
    'products.frames.desc': 'Gọng kính đa dạng phù hợp mọi khuôn mặt và phong cách',
    'products.accessories': 'Phụ kiện',
    'products.accessories.desc': 'Phụ kiện kính mắt: hộp đựng, khăn lau, dây đeo',
    'products.view': 'Xem chi tiết',
    
    // Services
    'services.title': 'Dịch vụ của chúng tôi',
    'services.subtitle': 'Cam kết chất lượng và sự hài lòng',
    'services.consultation': 'Tư vấn chuyên nghiệp',
    'services.consultation.desc': 'Đội ngũ chuyên gia tư vấn kính phù hợp với khuôn mặt và nhu cầu',
    'services.warranty': 'Bảo hành chính hãng',
    'services.warranty.desc': 'Bảo hành toàn diện cho tất cả sản phẩm kính và phụ kiện',
    'services.delivery': 'Giao hàng tận nơi',
    'services.delivery.desc': 'Giao hàng miễn phí trong nội thành Hà Nội cho đơn hàng trên 500K',
    'services.fitting': 'Điều chỉnh kính',
    'services.fitting.desc': 'Dịch vụ điều chỉnh và bảo dưỡng kính chuyên nghiệp',
    'services.cta.title': 'Sẵn sàng trải nghiệm dịch vụ tuyệt vời?',
    'services.cta.description': 'Hãy ghé thăm showroom hoặc liên hệ với chúng tôi ngay hôm nay!',
    'services.cta.button': 'Liên hệ ngay',
    
    // Virtual Try-On
    'virtual.try.button': 'Thử kính trực tuyến',
    'virtual.try.title': 'Thử Kính Trực Tuyến',
    'virtual.try.subtitle': 'Sử dụng AI để xem kính có phù hợp với khuôn mặt bạn không',
    'virtual.try.camera.title': 'Chụp ảnh hoặc bật camera',
    'virtual.try.glasses.title': 'Chọn kính để thử',
    'virtual.try.camera.start': 'Bật Camera',
    'virtual.try.camera.capture': 'Chụp ảnh',
    'virtual.try.camera.stop': 'Tắt Camera',
    'virtual.try.camera.retake': 'Chụp lại',
    'virtual.try.download': 'Tải về',
    'virtual.try.upload': 'Upload kính',
    'virtual.try.analyzing': 'Đang phân tích khuôn mặt bằng AI...',
    'virtual.try.analysis.complete': 'Phân tích hoàn thành',
    'virtual.try.face.shape': 'Khuôn mặt',
    'virtual.try.compatibility': 'Độ phù hợp',
    'virtual.try.suggestions': 'Gợi ý',
    
    // Contact
    'contact.title': 'Liên hệ với chúng tôi',
    'contact.subtitle': 'Ghé thăm showroom hoặc liên hệ trực tuyến',
    'contact.address': 'Địa chỉ',
    'contact.address.value': '123 Phố Huế, Quận Hai Bà Trưng, Hà Nội',
    'contact.phone': 'Điện thoại',
    'contact.email': 'Email',
    'contact.hours': 'Giờ mở cửa',
    'contact.hours.value': 'T2-T7: 9:00 - 21:00, CN: 9:00 - 18:00',
    'contact.info.title': 'Thông tin liên hệ',
    'contact.cta.title': 'Ghé thăm showroom của chúng tôi ngay hôm nay!',
    'contact.cta.description': 'Trải nghiệm trực tiếp bộ sưu tập kính mắt cao cấp và nhận tư vấn từ chuyên gia',
    'contact.cta.call': 'Gọi ngay',
    'contact.cta.email': 'Gửi email',
    
    // Footer
    'footer.description': 'VisionCraft Eyewear - Địa chỉ tin cậy cho kính mắt thời trang và chất lượng tại Hà Nội.',
    'footer.links': 'Liên kết nhanh',
    'footer.contact': 'Liên hệ',
    'footer.privacy': 'Chính sách bảo mật',
    'footer.terms': 'Điều khoản dịch vụ',
    'footer.follow': 'Theo dõi chúng tôi',
    'footer.rights': 'Bản quyền thuộc về VisionCraft Eyewear. Tất cả các quyền được bảo lưu.'
  },
  en: {
    // Header
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.products': 'Products',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    
    // Hero
    'hero.title': 'VisionCraft Eyewear',
    'hero.subtitle': 'Premium Eyewear Shop in Hanoi',
    'hero.description': 'Discover our collection of fashionable and high-quality eyewear from world-renowned brands. We provide you with perfect style and protection for your eyes.',
    'hero.cta.primary': 'Explore Now',
    'hero.cta.secondary': 'Contact Us',
    
    // About
    'about.title': 'About VisionCraft Eyewear',
    'about.subtitle': 'Over 10 years of experience in eyewear industry',
    'about.description': 'VisionCraft Eyewear is a trusted destination for fashion and quality eyewear enthusiasts in Hanoi. With our experienced team of experts and diverse collection from renowned brands, we are committed to providing customers with the best shopping experience.',
    'about.experience': 'Years Experience',
    'about.experience.desc': 'Long-standing experience in the eyewear industry',
    'about.customers': 'Happy Customers',
    'about.customers.desc': 'Trusted and satisfied customers',
    'about.products': 'Quality Products',
    'about.products.desc': 'High-quality products from renowned brands',
    
    // Products
    'products.title': 'Featured Products',
    'products.subtitle': 'Premium eyewear collection',
    'products.sunglasses': 'Sunglasses',
    'products.sunglasses.desc': 'Fashionable sunglasses collection from renowned brands',
    'products.prescription': 'Prescription Glasses',
    'products.prescription.desc': 'High-quality prescription glasses with modern lenses',
    'products.frames': 'Frames',
    'products.frames.desc': 'Diverse frames suitable for all face shapes and styles',
    'products.accessories': 'Accessories',
    'products.accessories.desc': 'Eyewear accessories: cases, cleaning cloths, straps',
    'products.view': 'View Details',
    
    // Services
    'services.title': 'Our Services',
    'services.subtitle': 'Quality commitment and satisfaction',
    'services.consultation': 'Professional Consultation',
    'services.consultation.desc': 'Expert team to advise glasses suitable for your face and needs',
    'services.warranty': 'Authentic Warranty',
    'services.warranty.desc': 'Comprehensive warranty for all eyewear products and accessories',
    'services.delivery': 'Home Delivery',
    'services.delivery.desc': 'Free delivery within Hanoi for orders over 500K VND',
    'services.fitting': 'Eyewear Adjustment',
    'services.fitting.desc': 'Professional eyewear adjustment and maintenance service',
    'services.cta.title': 'Ready to experience excellent service?',
    'services.cta.description': 'Visit our showroom or contact us today!',
    'services.cta.button': 'Contact Now',
    
    // Virtual Try-On
    'virtual.try.button': 'Try Glasses Online',
    'virtual.try.title': 'Virtual Try-On',
    'virtual.try.subtitle': 'Use AI to see if glasses suit your face',
    'virtual.try.camera.title': 'Take photo or turn on camera',
    'virtual.try.glasses.title': 'Choose glasses to try',
    'virtual.try.camera.start': 'Turn On Camera',
    'virtual.try.camera.capture': 'Take Photo',
    'virtual.try.camera.stop': 'Turn Off Camera',
    'virtual.try.camera.retake': 'Retake',
    'virtual.try.download': 'Download',
    'virtual.try.upload': 'Upload Glasses',
    'virtual.try.analyzing': 'Analyzing face with AI...',
    'virtual.try.analysis.complete': 'Analysis Complete',
    'virtual.try.face.shape': 'Face Shape',
    'virtual.try.compatibility': 'Compatibility',
    'virtual.try.suggestions': 'Suggestions',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Visit our showroom or contact us online',
    'contact.address': 'Address',
    'contact.address.value': '123 Pho Hue Street, Hai Ba Trung District, Hanoi',
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.hours': 'Opening Hours',
    'contact.hours.value': 'Mon-Sat: 9:00 - 21:00, Sun: 9:00 - 18:00',
    'contact.info.title': 'Contact Information',
    'contact.cta.title': 'Visit our showroom today!',
    'contact.cta.description': 'Experience our premium eyewear collection and get expert consultation',
    'contact.cta.call': 'Call Now',
    'contact.cta.email': 'Send Email',
    
    // Footer
    'footer.description': 'VisionCraft Eyewear - Your trusted destination for fashionable and quality eyewear in Hanoi.',
    'footer.links': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.follow': 'Follow Us',
    'footer.rights': 'Copyright © VisionCraft Eyewear. All rights reserved.'
  }
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'vi' | 'en'>('vi')

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['vi']] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}