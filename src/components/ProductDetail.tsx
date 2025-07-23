import React from 'react'
import { X, ShoppingCart, Heart, Share2, Star, Check } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

interface ProductVariant {
  color: string
  colorName: string
  sizes: Array<{
    size: string
    price: number
    image: string
    inStock: boolean
  }>
}

interface Product {
  id: number
  name: string
  category: string
  price: number
  originalPrice?: number
  description: string
  features: string[]
  images: string[]
  rating: number
  reviews: number
  inStock: boolean
  colors: string[]
  sizes?: string[]
  variants?: ProductVariant[]
}

interface ProductDetailProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, isOpen, onClose }) => {
  const { t } = useLanguage()
  const [selectedImage, setSelectedImage] = React.useState(0)
  const [selectedColor, setSelectedColor] = React.useState(0)
  const [selectedSize, setSelectedSize] = React.useState(0)

  // Get current variant based on selected color and size
  const getCurrentVariant = () => {
    if (!product.variants || !product.colors || product.colors.length === 0) return null
    
    const colorHex = product.colors[selectedColor]
    if (!colorHex) return null
    
    const variant = product.variants.find(v => v.color === colorHex)
    if (!variant) return null
    
    const sizeName = product.sizes?.[selectedSize]
    if (!sizeName) return { variant, sizeInfo: variant.sizes[0] }
    
    const sizeInfo = variant.sizes.find(s => s.size === sizeName)
    return sizeInfo ? { variant, sizeInfo } : null
  }

  const currentVariantData = getCurrentVariant()
  const currentVariant = currentVariantData?.variant
  const currentSizeInfo = currentVariantData?.sizeInfo
  
  // Get all images for the current color variant or fallback to product images
  const currentImages = React.useMemo(() => {
    if (currentVariant) {
      // Get all images from all sizes of the selected color
      const variantImages = currentVariant.sizes.map(size => size.image)
      // Remove duplicates and return
      return [...new Set(variantImages)]
    }
    return product.images
  }, [currentVariant, product.images])
  
  const currentPrice = currentSizeInfo?.price || product.price
  const currentOriginalPrice = product.originalPrice
  const currentInStock = currentSizeInfo?.inStock ?? product.inStock

  // Handle color change
  const handleColorChange = (colorIndex: number) => {
    setSelectedColor(colorIndex)
    setSelectedImage(0) // Reset to first image of new variant
  }

  // Handle size change
  const handleSizeChange = (sizeIndex: number) => {
    setSelectedSize(sizeIndex)
    // When size changes, update the main image to show the specific size image
    if (currentVariant) {
      const newSizeName = product.sizes?.[sizeIndex]
      const newSizeInfo = currentVariant.sizes.find(s => s.size === newSizeName)
      if (newSizeInfo) {
        const imageIndex = currentImages.findIndex(img => img === newSizeInfo.image)
        if (imageIndex !== -1) {
          setSelectedImage(imageIndex)
        }
      }
    }
  }

  // Reset selections when product changes
  React.useEffect(() => {
    setSelectedColor(0)
    setSelectedSize(0)
    setSelectedImage(0)
  }, [product.id])

  // Reset selectedImage if it exceeds available images
  React.useEffect(() => {
    if (selectedImage >= currentImages.length) {
      setSelectedImage(0)
    }
  }, [currentImages, selectedImage])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('product.details')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={currentImages[selectedImage]}
                  alt={`${product.name} - ${product.colors[selectedColor]}`}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>
              
              {/* Thumbnail Images */}
              <div className="flex space-x-2 overflow-x-auto">
                {currentImages.map((image, index) => (
                  <button
                    key={`${selectedColor}-${selectedSize}-${index}`}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-primary-500'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              
              {/* Color/Size Indicator */}
              <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                {product.variants && (
                  <span>
                    {currentVariant?.colorName || 'Màu sắc'}
                    {currentSizeInfo?.size && ` • Size ${currentSizeInfo.size}`}
                  </span>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-2">
                  {product.category}
                </p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {product.name}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {product.rating} ({product.reviews} {t('product.reviews')})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {currentPrice.toLocaleString('vi-VN')}₫
                  </span>
                  {currentOriginalPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      {currentOriginalPrice.toLocaleString('vi-VN')}₫
                    </span>
                  )}
                  {currentOriginalPrice && (
                    <span className="bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 px-2 py-1 rounded text-sm font-medium">
                      -{Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Colors */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  {t('product.color')}
                  {currentVariant?.colorName && (
                    <span className="text-primary-600 dark:text-primary-400 ml-2 text-sm font-normal">
                      - {currentVariant.colorName}
                    </span>
                  )}
                </h3>
                <div className="flex space-x-2">
                  {product.colors.map((color, index) => {
                    const variant = product.variants?.find(v => v.color === color)
                    const isAvailable = variant && variant.sizes.some(s => s.inStock)
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleColorChange(index)}
                        disabled={!isAvailable}
                        className={`relative w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                          selectedColor === index
                            ? 'border-primary-500 scale-110 shadow-lg'
                            : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                        } ${!isAvailable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        style={{ backgroundColor: color }}
                        title={variant?.colorName || `Màu ${index + 1}`}
                      >
                        {!isAvailable && (
                          <div className="absolute inset-0 rounded-full border border-red-500">
                            <div className="absolute top-1/2 left-1/2 w-6 h-0.5 bg-red-500 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Sizes */}
              {product.sizes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    {t('product.size')}
                    {currentSizeInfo?.size && (
                      <span className="text-primary-600 dark:text-primary-400 ml-2 text-sm font-normal">
                        - {currentSizeInfo.size}
                      </span>
                    )}
                  </h3>
                  <div className="flex space-x-2">
                    {product.sizes.map((size, index) => {
                      const colorHex = product.colors[selectedColor]
                      const variant = product.variants?.find(v => v.color === colorHex)
                      const sizeInfo = variant?.sizes.find(s => s.size === size)
                      const isAvailable = sizeInfo?.inStock !== false
                      
                      return (
                        <button
                          key={index}
                          onClick={() => handleSizeChange(index)}
                          disabled={!isAvailable}
                          className={`px-3 py-2 text-sm border rounded-lg transition-all duration-200 ${
                            selectedSize === index
                              ? 'border-primary-500 bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-300 shadow-md'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-300'
                          } ${!isAvailable ? 'opacity-50 cursor-not-allowed line-through' : 'cursor-pointer'}`}
                        >
                          {size}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${currentInStock ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`text-sm font-medium ${
                  currentInStock 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {currentInStock ? t('product.inStock') : t('product.outOfStock')}
                </span>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  disabled={!currentInStock}
                  className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart size={20} />
                  <span>{t('product.addToCart')}</span>
                </button>
                <button className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <Heart size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <Share2 size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {t('product.description')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {t('product.features')}
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                      <Check size={16} className="text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
