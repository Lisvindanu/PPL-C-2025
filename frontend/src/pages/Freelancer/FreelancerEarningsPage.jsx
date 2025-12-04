import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/organisms/Navbar'
import paymentService from '../../services/paymentService'
import { authService } from '../../services/authService'

export default function FreelancerEarningsPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [balanceData, setBalanceData] = useState(null)
  const [earningsData, setEarningsData] = useState(null)
  const [dateRange, setDateRange] = useState({
    start_date: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (balanceData !== null) {
      fetchEarnings()
    }
  }, [dateRange])

  const checkAuth = async () => {
    const user = authService.getCurrentUser()
    if (!user || user.role !== 'freelancer') {
      alert('Halaman ini hanya untuk freelancer')
      navigate('/dashboard')
      return
    }
    await Promise.all([fetchBalance(), fetchEarnings()])
  }

  const fetchBalance = async () => {
    const result = await paymentService.getUserBalance()
    if (result.success) {
      setBalanceData(result.data)
    } else {
      console.error('Failed to fetch balance:', result.message)
    }
  }

  const fetchEarnings = async () => {
    setLoading(true)
    const result = await paymentService.getFreelancerEarnings(dateRange)
    if (result.success) {
      setEarningsData(result.data)
    } else {
      console.error('Failed to fetch earnings:', result.message)
    }
    setLoading(false)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount || 0)
  }

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({ ...prev, [field]: value }))
  }

  const handleWithdraw = () => {
    navigate('/withdrawal/create')
  }

  if (loading && !earningsData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Earnings Analytics</h1>
          <p className="mt-2 text-gray-600">Track your income and balance</p>
        </div>

        {/* Balance Cards */}
        {balanceData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Balance</p>
                  <p className="mt-2 text-3xl font-bold text-green-600">
                    {formatCurrency(balanceData.available_balance)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <button
                onClick={handleWithdraw}
                className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Withdraw Funds
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending in Escrow</p>
                  <p className="mt-2 text-3xl font-bold text-yellow-600">
                    {formatCurrency(balanceData.pending_escrow)}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">Funds held for 7 days</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Withdrawn</p>
                  <p className="mt-2 text-3xl font-bold text-blue-600">
                    {formatCurrency(balanceData.total_withdrawn)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">Lifetime withdrawals</p>
            </div>
          </div>
        )}

        {/* Date Range Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Period</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.start_date}
                onChange={(e) => handleDateRangeChange('start_date', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.end_date}
                onChange={(e) => handleDateRangeChange('end_date', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Earnings Summary */}
        {earningsData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {earningsData.summary?.total_orders || 0}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm font-medium text-gray-600">Total Earned</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {formatCurrency(earningsData.summary?.total_earned)}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm font-medium text-gray-600">Platform Fees</p>
                <p className="mt-2 text-2xl font-bold text-red-600">
                  {formatCurrency(earningsData.summary?.platform_fees)}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {formatCurrency(earningsData.summary?.average_order_value)}
                </p>
              </div>
            </div>

            {/* Monthly Earnings */}
            {earningsData.monthly_earnings && earningsData.monthly_earnings.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Monthly Earnings</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Month
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Orders
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gross Earnings
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Platform Fees
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Net Earnings
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {earningsData.monthly_earnings.map((month, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {month.month}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {month.order_count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(month.total_amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                            {formatCurrency(month.platform_fees)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                            {formatCurrency(month.net_earnings)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
