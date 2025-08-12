'use client'

import { useState } from 'react'

interface Review {
  id: string
  bookingId: string
  reviewerId: string
  reviewerName: string
  reviewerEmail: string
  rating: number
  comment?: string
  commentTh?: string | null
  punctuality?: number
  performance?: number
  professionalism?: number
  valueForMoney?: number
  isVerified: boolean
  isPublic: boolean
  createdAt: string
  artistResponse?: string | null
  respondedAt?: string | null
  eventType: string
  eventDate: string
  venue: string
}

interface ReviewStats {
  totalReviews: number
  averageRating: number
  responseRate: number
  ratingBreakdown: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

interface ReviewsManagerProps {
  artistId: string
  reviews: Review[]
  stats: ReviewStats
  locale: string
}

export default function ReviewsManager({ artistId, reviews, stats, locale }: ReviewsManagerProps) {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [responseText, setResponseText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filter, setFilter] = useState('all')

  const filteredReviews = filter === 'all' 
    ? reviews 
    : filter === 'responded'
    ? reviews.filter(r => r.artistResponse)
    : reviews.filter(r => !r.artistResponse)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const stars = []
    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`${starSize} ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }
    return stars
  }

  const handleSubmitResponse = async (reviewId: string) => {
    if (!responseText.trim()) return
    
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/reviews/${reviewId}/response`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response: responseText }),
      })

      if (response.ok) {
        // Refresh the page or update state
        window.location.reload()
      } else {
        alert('Error submitting response')
      }
    } catch (error) {
      alert('Error submitting response')
    }
    setIsSubmitting(false)
    setSelectedReview(null)
    setResponseText('')
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-pure-white rounded-lg shadow-md p-6">
          <div className="text-3xl font-bold text-brand-cyan mb-2">
            {stats.averageRating.toFixed(1)}
          </div>
          <div className="flex items-center mb-2">
            {renderStars(Math.round(stats.averageRating), 'sm')}
          </div>
          <div className="text-sm text-gray-500">Average Rating</div>
        </div>

        <div className="bg-pure-white rounded-lg shadow-md p-6">
          <div className="text-3xl font-bold text-earthy-brown mb-2">
            {stats.totalReviews}
          </div>
          <div className="text-sm text-gray-500">Total Reviews</div>
        </div>

        <div className="bg-pure-white rounded-lg shadow-md p-6">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {stats.responseRate}%
          </div>
          <div className="text-sm text-gray-500">Response Rate</div>
        </div>

        <div className="bg-pure-white rounded-lg shadow-md p-6">
          <div className="text-3xl font-bold text-soft-lavender mb-2">
            {reviews.filter(r => !r.artistResponse).length}
          </div>
          <div className="text-sm text-gray-500">Pending Responses</div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-pure-white rounded-lg shadow-md p-6">
        <h3 className="font-playfair text-lg font-semibold text-dark-gray mb-4">
          Rating Distribution
        </h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map(rating => {
            const count = stats.ratingBreakdown[rating as keyof typeof stats.ratingBreakdown]
            const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0
            
            return (
              <div key={rating} className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm">{rating}</span>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-12 text-sm text-gray-600">{count}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { key: 'all', label: 'All Reviews', count: reviews.length },
            { key: 'pending', label: 'Pending Response', count: reviews.filter(r => !r.artistResponse).length },
            { key: 'responded', label: 'Responded', count: reviews.filter(r => r.artistResponse).length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                filter === tab.key
                  ? 'border-brand-cyan text-brand-cyan'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-pure-white rounded-lg shadow-md">
            <div className="text-6xl mb-4">⭐</div>
            <h3 className="text-lg font-medium text-dark-gray mb-2">No reviews found</h3>
            <p className="text-gray-500">
              {filter === 'pending' 
                ? "All reviews have been responded to!"
                : "Complete more bookings to receive reviews from clients."
              }
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-pure-white rounded-lg shadow-md p-6">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-brand-cyan rounded-full flex items-center justify-center">
                    <span className="text-pure-white font-bold">
                      {review.reviewerName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-dark-gray">{review.reviewerName}</h4>
                      {review.isVerified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{review.eventType}</span>
                      <span>•</span>
                      <span>{formatDate(review.eventDate)}</span>
                      <span>•</span>
                      <span>{review.venue}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center mb-1">
                    {renderStars(review.rating)}
                    <span className="ml-2 font-medium text-dark-gray">{review.rating}.0</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(review.createdAt)}
                  </div>
                </div>
              </div>

              {/* Detailed Ratings */}
              {review.punctuality && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h5 className="text-sm font-medium text-dark-gray mb-3">Detailed Ratings</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Punctuality</span>
                      <div className="flex items-center mt-1">
                        {renderStars(review.punctuality || 0)}
                        <span className="ml-1">{review.punctuality}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Performance</span>
                      <div className="flex items-center mt-1">
                        {renderStars(review.performance || 0)}
                        <span className="ml-1">{review.performance}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Professionalism</span>
                      <div className="flex items-center mt-1">
                        {renderStars(review.professionalism || 0)}
                        <span className="ml-1">{review.professionalism}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Value for Money</span>
                      <div className="flex items-center mt-1">
                        {renderStars(review.valueForMoney || 0)}
                        <span className="ml-1">{review.valueForMoney}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Review Comment */}
              {review.comment && (
                <div className="mb-4">
                  <p className="text-dark-gray leading-relaxed">"{review.comment}"</p>
                </div>
              )}

              {/* Artist Response */}
              {review.artistResponse ? (
                <div className="bg-blue-50 border-l-4 border-brand-cyan p-4">
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium text-brand-cyan">Your Response</span>
                    <span className="ml-2 text-xs text-gray-500">
                      {review.respondedAt && formatDate(review.respondedAt)}
                    </span>
                  </div>
                  <p className="text-dark-gray text-sm">{review.artistResponse}</p>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-600">No response yet</span>
                  <button
                    onClick={() => setSelectedReview(review)}
                    className="bg-brand-cyan text-pure-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-cyan/90"
                  >
                    Respond
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Response Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div 
              className="fixed inset-0 bg-dark-gray bg-opacity-50" 
              onClick={() => setSelectedReview(null)}
            />
            <div className="relative bg-pure-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-playfair text-lg font-semibold text-dark-gray">
                    Respond to Review
                  </h3>
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="px-6 py-4">
                {/* Original Review */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center">
                      {renderStars(selectedReview.rating)}
                      <span className="ml-2 font-medium">{selectedReview.rating}.0</span>
                    </div>
                    <span className="text-gray-500">•</span>
                    <span className="font-medium">{selectedReview.reviewerName}</span>
                  </div>
                  <p className="text-dark-gray">"{selectedReview.comment}"</p>
                </div>

                {/* Response Form */}
                <div>
                  <label htmlFor="response" className="block text-sm font-medium text-dark-gray mb-2">
                    Your Response
                  </label>
                  <textarea
                    id="response"
                    rows={4}
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-cyan focus:border-brand-cyan"
                    placeholder="Thank the client and address any concerns professionally..."
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {responseText.length}/500 characters
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setSelectedReview(null)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSubmitResponse(selectedReview.id)}
                        disabled={isSubmitting || !responseText.trim() || responseText.length > 500}
                        className="bg-brand-cyan text-pure-white px-4 py-2 rounded-md font-medium hover:bg-brand-cyan/90 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Sending...' : 'Send Response'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Response Tips */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">💡 Response Tips</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Thank the client for their feedback</li>
                    <li>• Address any specific concerns professionally</li>
                    <li>• Keep responses positive and constructive</li>
                    <li>• Show that you value client feedback</li>
                    <li>• Responses are public and help build trust</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}