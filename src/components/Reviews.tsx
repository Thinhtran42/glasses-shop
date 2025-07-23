import React, { useState, useEffect } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight, User, X, MessageCircle } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

interface Review {
  id: number
  name: string
  avatar?: string
  rating: number
  comment: string
  product?: string
  date: string
  verified: boolean
}

const Reviews: React.FC = () => {
  const { t } = useLanguage()
  const [currentReview, setCurrentReview] = useState(0)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [userReviews, setUserReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: '',
    product: ''
  })

  const reviews: Review[] = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      rating: 5,
      comment: "Dịch vụ tuyệt vời! Nhân viên tư vấn rất nhiệt tình và chuyên nghiệp. Kính đúng như mong đợi, chất lượng cao và thiết kế đẹp mắt.",
      product: "Premium Sunglasses Collection",
      date: "2024-12-15",
      verified: true
    },
    {
      id: 2,
      name: "Trần Thị Minh",
      rating: 5,
      comment: "Mua kính cận tại đây rất hài lòng. Quy trình đo mắt chính xác, kính làm nhanh và đúng độ. Giá cả hợp lý, sẽ giới thiệu bạn bè.",
      product: "Prescription Glasses Pro",
      date: "2024-12-10",
      verified: true
    },
    {
      id: 3,
      name: "Lê Hoàng Nam",
      rating: 4,
      comment: "Showroom đẹp, nhiều mẫu để lựa chọn. Nhân viên tư vấn tận tình. Chỉ có điều thời gian chờ hơi lâu do khách đông.",
      product: "Designer Frame Collection",
      date: "2024-12-05",
      verified: true
    },
    {
      id: 4,
      name: "Phạm Thị Lan",
      rating: 5,
      comment: "Chất lượng sản phẩm tuyệt vời, đóng gói cẩn thận. Mua online nhưng vẫn được tư vấn kỹ càng qua điện thoại. Rất recommend!",
      product: "Premium Sunglasses Collection",
      date: "2024-11-28",
      verified: true
    },
    {
      id: 5,
      name: "Đỗ Văn Tùng",
      rating: 4,
      comment: "Kính đẹp, đúng mô tả. Dịch vụ hậu mãi tốt, có bảo hành rõ ràng. Sẽ quay lại mua thêm cho gia đình.",
      date: "2024-11-20",
      verified: true
    },
    {
      id: 6,
      name: "Vũ Thị Hà",
      rating: 5,
      comment: "Lần đầu mua kính online nhưng rất an tâm. Sản phẩm chất lượng cao, đúng như hình ảnh. Giao hàng nhanh, đóng gói cẩn thận.",
      product: "Designer Frame Collection",
      date: "2024-11-15",
      verified: true
    }
  ]

  // Load user reviews from localStorage on component mount
  useEffect(() => {
    const savedReviews = localStorage.getItem('userReviews')
    if (savedReviews) {
      setUserReviews(JSON.parse(savedReviews))
    }
  }, [])

  // Combine sample reviews with user reviews
  const allReviews = [...userReviews, ...reviews]

  // Save user reviews to localStorage
  const saveUserReviews = (newUserReviews: Review[]) => {
    localStorage.setItem('userReviews', JSON.stringify(newUserReviews))
    setUserReviews(newUserReviews)
  }

  // Handle form submission
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newReview.name.trim() || !newReview.comment.trim()) {
      alert('Vui lòng điền đầy đủ thông tin!')
      return
    }

    const reviewToAdd: Review = {
      id: Date.now(), // Simple ID generation
      name: newReview.name.trim(),
      rating: newReview.rating,
      comment: newReview.comment.trim(),
      product: newReview.product.trim() || undefined,
      date: new Date().toISOString().split('T')[0],
      verified: false // User reviews are not verified by default
    }

    const updatedUserReviews = [reviewToAdd, ...userReviews]
    saveUserReviews(updatedUserReviews)
    
    // Reset form
    setNewReview({
      name: '',
      rating: 5,
      comment: '',
      product: ''
    })
    setShowReviewForm(false)
    setCurrentReview(0) // Show the new review first
  }

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % allReviews.length)
  }

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + allReviews.length) % allReviews.length)
  }

  const getVisibleReviews = () => {
    const result = []
    for (let i = 0; i < 3; i++) {
      const index = (currentReview + i) % allReviews.length
      result.push(allReviews[index])
    }
    return result
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={`${
          i < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ))
  }

  const overallStats = {
    totalReviews: allReviews.length,
    averageRating: allReviews.length > 0 ? (allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length).toFixed(1) : '0.0',
    ratingDistribution: {
      5: allReviews.filter(r => r.rating === 5).length,
      4: allReviews.filter(r => r.rating === 4).length,
      3: allReviews.filter(r => r.rating === 3).length,
      2: allReviews.filter(r => r.rating === 2).length,
      1: allReviews.filter(r => r.rating === 1).length,
    }
  }

  return (
    <section id="reviews" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('reviews.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('reviews.subtitle')}
          </p>
        </div>

        {/* Overall Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-12 shadow-lg">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Rating Summary */}
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                {overallStats.averageRating}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(parseFloat(overallStats.averageRating)))}
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {t('reviews.basedOn')} {overallStats.totalReviews} {t('reviews.reviews')}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-3">
                    {rating}
                  </span>
                  <Star size={14} className="text-yellow-400 fill-current" />
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(overallStats.ratingDistribution[rating as keyof typeof overallStats.ratingDistribution] / overallStats.totalReviews) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                    {overallStats.ratingDistribution[rating as keyof typeof overallStats.ratingDistribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Carousel */}
        <div className="relative">
          <div className="grid md:grid-cols-3 gap-6">
            {getVisibleReviews().map((review, index) => (
              <div
                key={`${review.id}-${currentReview}-${index}`}
                className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 ${
                  !review.verified ? 'border-2 border-primary-200 dark:border-primary-800' : ''
                }`}
              >
                {/* New Review Badge */}
                {!review.verified && (
                  <div className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs px-3 py-1 rounded-full mb-3 inline-block">
                    Đánh giá mới
                  </div>
                )}
                
                {/* Quote Icon */}
                <Quote size={24} className="text-primary-500 mb-4" />
                
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {renderStars(review.rating)}
                </div>

                {/* Comment */}
                <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-4">
                  "{review.comment}"
                </p>

                {/* Product */}
                {review.product && (
                  <p className="text-sm text-primary-600 dark:text-primary-400 mb-4 font-medium">
                    {t('reviews.product')}: {review.product}
                  </p>
                )}

                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    {review.avatar ? (
                      <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full" />
                    ) : (
                      <User size={20} className="text-primary-600 dark:text-primary-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {review.name}
                      </h4>
                      {review.verified && (
                        <span className="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 text-xs px-2 py-1 rounded">
                          {t('reviews.verified')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(review.date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevReview}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
          
          <button
            onClick={nextReview}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          >
            <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {allReviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentReview(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentReview
                  ? 'bg-primary-600 scale-125'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-primary-300'
              }`}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t('reviews.cta')}
          </p>
          <button 
            onClick={() => setShowReviewForm(true)}
            className="bg-primary-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors inline-flex items-center space-x-2"
          >
            <MessageCircle size={20} />
            <span>{t('reviews.writeReview')}</span>
          </button>
        </div>

        {/* Review Form Modal */}
        {showReviewForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Viết đánh giá của bạn
                </h3>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-6">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    value={newReview.name}
                    onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Nhập họ và tên của bạn"
                    required
                  />
                </div>

                {/* Rating Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Đánh giá *
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                        className="focus:outline-none"
                      >
                        <Star
                          size={32}
                          className={`transition-colors ${
                            rating <= newReview.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300 dark:text-gray-600'
                          } hover:text-yellow-400`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Đã chọn: {newReview.rating} sao
                  </p>
                </div>

                {/* Product Input (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sản phẩm (tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={newReview.product}
                    onChange={(e) => setNewReview(prev => ({ ...prev, product: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Tên sản phẩm bạn đã mua (không bắt buộc)"
                  />
                </div>

                {/* Comment Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nhận xét *
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm hoặc dịch vụ..."
                    required
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {newReview.comment.length}/500 ký tự
                  </p>
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    Gửi đánh giá
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Reviews
