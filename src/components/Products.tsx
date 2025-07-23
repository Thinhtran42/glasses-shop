import React, { useState } from 'react'
import { Eye, Sun, Glasses, Package } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import VirtualTryOn from './VirtualTryOn'
import ProductDetail from './ProductDetail'

const Products: React.FC = () => {
  const { t } = useLanguage()
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const products = [
    {
      id: 1,
      icon: Sun,
      title: t('products.sunglasses'),
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: t('products.sunglasses.desc'),
      detailProduct: {
        id: 1,
        name: 'Premium Sunglasses Collection',
        category: 'Kính râm',
        price: 2500000,
        originalPrice: 3000000,
        description: 'Bộ sưu tập kính râm cao cấp với công nghệ chống tia UV 100%, thiết kế thời trang và chất liệu titan siêu nhẹ. Phù hợp cho mọi hoạt động ngoài trời.',
        features: [
          'Chống tia UV 100%',
          'Chất liệu titan siêu nhẹ',
          'Thiết kế chống trầy xước',
          'Phù hợp mọi khuôn mặt',
          'Bảo hành 2 năm'
        ],
        images: [
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        ],
        rating: 4.8,
        reviews: 124,
        inStock: true,
        colors: ["#000000", "#8B4513", "#FFD700"],
        sizes: ["S", "M", "L"],
        variants: [
          {
            color: "#000000",
            colorName: "Black",
            sizes: [
              { size: "S", price: 2500000, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: true },
              { size: "M", price: 2500000, image: "https://images.unsplash.com/photo-1609969606652-e817b9aed7a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: true },
              { size: "L", price: 2600000, image: "https://images.unsplash.com/photo-1606916459390-1a2df3e26dd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: false }
            ]
          },
          {
            color: "#8B4513",
            colorName: "Brown",
            sizes: [
              { size: "S", price: 2400000, image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: true },
              { size: "M", price: 2400000, image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: true },
              { size: "L", price: 2500000, image: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: true }
            ]
          },
          {
            color: "#FFD700",
            colorName: "Gold",
            sizes: [
              { size: "S", price: 2600000, image: "https://images.unsplash.com/photo-1577803645773-f96470509666?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: false },
              { size: "M", price: 2600000, image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: true },
              { size: "L", price: 2700000, image: "https://images.unsplash.com/photo-1615887563886-8e9362b5db77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: true }
            ]
          }
        ]
      }
    },
    {
      id: 2,
      icon: Eye,
      title: t('products.prescription'),
      image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: t('products.prescription.desc'),
      detailProduct: {
        id: 2,
        name: 'Prescription Glasses Pro',
        category: 'Kính cận',
        price: 1800000,
        originalPrice: 2200000,
        description: 'Kính cận chất lượng cao với tròng kính chống phản chiếu, chống mỏi mắt. Thiết kế hiện đại phù hợp cho công việc và học tập.',
        features: [
          'Tròng kính chống phản chiếu',
          'Chống ánh sáng xanh',
          'Siêu mỏng, siêu nhẹ',
          'Độ bền cao',
          'Thiết kế thời trang'
        ],
        images: [
          'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1486401899868-0e435ed85128?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        ],
        rating: 4.9,
        reviews: 89,
        inStock: true,
        colors: ["#000000", "#8B4513", "#FF6B6B"],
        sizes: ["S", "M", "L", "XL"],
        variants: [
          {
            color: "#000000",
            colorName: "Black",
            sizes: [
              { size: "S", price: 1800000, image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: true },
              { size: "M", price: 1800000, image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: true },
              { size: "L", price: 1900000, image: "https://images.unsplash.com/photo-1486401899868-0e435ed85128?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: true },
              { size: "XL", price: 2000000, image: "https://images.unsplash.com/photo-1502767089025-6572583495f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: false }
            ]
          },
          {
            color: "#8B4513",
            colorName: "Brown",
            sizes: [
              { size: "S", price: 1850000, image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: false },
              { size: "M", price: 1850000, image: "https://images.unsplash.com/photo-1610883868605-e03c4c210b13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: true },
              { size: "L", price: 1950000, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: true },
              { size: "XL", price: 2050000, image: "https://images.unsplash.com/photo-1607854680851-5ea2e10bb0e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: true }
            ]
          },
          {
            color: "#FF6B6B",
            colorName: "Red",
            sizes: [
              { size: "S", price: 1900000, image: "https://images.unsplash.com/photo-1591076485667-48c6f8b4b3a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: true },
              { size: "M", price: 1900000, image: "https://images.unsplash.com/photo-1635175980644-dc958e74a47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: true },
              { size: "L", price: 2000000, image: "https://images.unsplash.com/photo-1625204253444-2bd4d6b2b0b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: false },
              { size: "XL", price: 2100000, image: "https://images.unsplash.com/photo-1622377950897-6bb7ebf3f5d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: true }
            ]
          }
        ]
      }
    },
    {
      id: 3,
      icon: Glasses,
      title: t('products.frames'),
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: t('products.frames.desc'),
      detailProduct: {
        id: 3,
        name: 'Designer Frame Collection',
        category: 'Gọng kính',
        price: 1200000,
        originalPrice: 1500000,
        description: 'Bộ sưu tập gọng kính thời trang cao cấp từ các thương hiệu nổi tiếng. Chất liệu cao cấp, thiết kế đa dạng phù hợp mọi phong cách.',
        features: [
          'Chất liệu acetate cao cấp',
          'Thiết kế đa dạng',
          'Thoải mái suốt ngày dài',
          'Màu sắc phong phú',
          'Phù hợp mọi độ tuổi'
        ],
        images: [
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        ],
        rating: 4.7,
        reviews: 156,
        inStock: true,
        colors: ["#000000", "#8B4513", "#4A90E2", "#50C878"],
        sizes: ["S", "M"],
        variants: [
          {
            color: "#000000",
            colorName: "Black",
            sizes: [
              { size: "S", price: 1200000, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: true },
              { size: "M", price: 1200000, image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: true }
            ]
          },
          {
            color: "#8B4513",
            colorName: "Brown",
            sizes: [
              { size: "S", price: 1250000, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: true },
              { size: "M", price: 1250000, image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: false }
            ]
          },
          {
            color: "#4A90E2",
            colorName: "Blue",
            sizes: [
              { size: "S", price: 1300000, image: "https://images.unsplash.com/photo-1486401899868-0e435ed85128?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: true },
              { size: "M", price: 1300000, image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: true }
            ]
          },
          {
            color: "#50C878",
            colorName: "Green",
            sizes: [
              { size: "S", price: 1350000, image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: false },
              { size: "M", price: 1350000, image: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: true }
            ]
          }
        ]
      }
    },
    {
      id: 4,
      icon: Package,
      title: t('products.accessories'),
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: t('products.accessories.desc'),
      detailProduct: {
        id: 4,
        name: 'Eyewear Accessories Kit',
        category: 'Phụ kiện',
        price: 350000,
        originalPrice: 450000,
        description: 'Bộ phụ kiện chăm sóc kính mắt hoàn chỉnh bao gồm hộp đựng, khăn lau, dung dịch vệ sinh và các phụ kiện cần thiết khác.',
        features: [
          'Hộp đựng cao cấp',
          'Khăn lau microfiber',
          'Dung dịch vệ sinh chuyên dụng',
          'Dây đeo kính',
          'Bộ vít sửa chữa'
        ],
        images: [
          'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        ],
        rating: 4.6,
        reviews: 203,
        inStock: true,
        colors: ["#000000", "#8B4513", "#4A90E2"],
        sizes: ["Standard"],
        variants: [
          {
            color: "#000000",
            colorName: "Black",
            sizes: [
              { size: "Standard", price: 350000, image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: true }
            ]
          },
          {
            color: "#8B4513",
            colorName: "Brown",
            sizes: [
              { size: "Standard", price: 380000, image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: true }
            ]
          },
          {
            color: "#4A90E2",
            colorName: "Blue",
            sizes: [
              { size: "Standard", price: 400000, image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", inStock: false }
            ]
          }
        ]
      }
    }
  ]

  const handleProductClick = (product: any) => {
    setSelectedProduct(product.detailProduct)
    setIsDetailOpen(true)
  }

  const closeProductDetail = () => {
    setIsDetailOpen(false)
    setSelectedProduct(null)
  }

  return (
    <section id="products" className="section-padding bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('products.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('products.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              onClick={() => handleProductClick(product)}
              className="card group hover:scale-105 animate-fade-in-up cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden rounded-t-xl">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 left-4 bg-primary-600 text-white p-2 rounded-lg">
                  <product.icon size={20} />
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {product.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                  {product.description}
                </p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    handleProductClick(product)
                  }}
                  className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-300"
                >
                  {t('products.view')} →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            isOpen={isDetailOpen}
            onClose={closeProductDetail}
          />
        )}

        {/* AI Face Analysis CTA */}
        <div className="mt-16 text-center animate-fade-in-up">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 sm:p-12 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }} />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                🧠 AI Face Analysis & Glasses Recommendation
              </h3>
              <p className="text-lg mb-8 text-purple-100 max-w-2xl mx-auto">
                Sử dụng công nghệ AI để phân tích khuôn mặt và nhận gợi ý kính phù hợp với bạn
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <VirtualTryOn />
                <div className="text-sm text-purple-200">
                  ✨ Miễn phí • 🎯 Chính xác • 📱 Dễ sử dụng
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Products