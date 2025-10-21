import React from 'react'
import { Bookmark, BookmarkCheck, Briefcase, Clock } from 'lucide-react'

const ServiceCard = ({ service, onSelect }) => {
  const formatPrice = (price, currency, period) => {
    if (period === 'month') {
      return `$${price}/${period}`
    } else if (period === 'project') {
      return `$${price}`
    }
    return `$${price}/${period}`
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="relative h-48 bg-gray-100">
        <img
          src={service.thumbnail}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
          {service.isBookmarked ? (
            <BookmarkCheck className="w-5 h-5 text-primary" />
          ) : (
            <Bookmark className="w-5 h-5 text-text" />
          )}
        </button>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-text mb-2 line-clamp-2">
            {service.title}
          </h3>
          <div className="flex items-center space-x-2">
            <img
              src={service.freelancer.avatar}
              alt={service.freelancer.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-textMuted">{service.freelancer.name}</span>
            <div className="flex items-center space-x-1">
              <span className="text-yellow-400">★</span>
              <span className="text-sm text-textMuted">{service.freelancer.rating}</span>
              <span className="text-sm text-textMuted">({service.freelancer.reviews})</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-textMuted mb-4 line-clamp-3">
          {service.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {service.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primaryLight text-primary text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-textMuted mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Briefcase className="w-4 h-4" />
              <span>{service.type}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{service.posted}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-text">
            {formatPrice(service.price, service.currency, service.period)}
          </div>
          <button
            onClick={onSelect}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primaryDark transition-colors"
          >
            Pesan Sekarang
          </button>
        </div>
      </div>
    </div>
  )
}

export default ServiceCard
