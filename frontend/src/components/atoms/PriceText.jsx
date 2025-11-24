const PriceText = ({ amount, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl font-bold',
    xl: 'text-2xl font-bold'
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <span className={`${sizes[size]} text-gray-900 ${className}`}>
      {formatPrice(amount)}
    </span>
  )
}

export default PriceText
