import React, { useState } from 'react'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  MessageCircle,
  FileText
} from 'lucide-react'

const OrderStatus = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState(null)

  const getStatusSteps = (status) => {
    const steps = [
      { id: 'pending', label: 'Menunggu Konfirmasi', icon: Clock, color: 'text-yellow-500' },
      { id: 'accepted', label: 'Diterima', icon: CheckCircle, color: 'text-green-500' },
      { id: 'in_progress', label: 'Sedang Dikerjakan', icon: AlertTriangle, color: 'text-blue-500' },
      { id: 'completed', label: 'Selesai', icon: CheckCircle, color: 'text-green-600' }
    ]

    const currentStepIndex = steps.findIndex(step => step.id === status)
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentStepIndex,
      current: index === currentStepIndex
    }))
  }

  const getTimelineEvents = (order) => {
    const events = [
      {
        id: 'created',
        title: 'Pesanan Dibuat',
        description: `Pesanan #${order.id} telah dibuat`,
        time: order.createdAt,
        icon: FileText,
        color: 'text-blue-500'
      }
    ]

    if (order.status !== 'pending') {
      events.push({
        id: 'accepted',
        title: 'Pesanan Diterima',
        description: `${order.freelancer} telah menerima pesanan Anda`,
        time: order.createdAt,
        icon: CheckCircle,
        color: 'text-green-500'
      })
    }

    if (order.status === 'in_progress' || order.status === 'completed') {
      events.push({
        id: 'started',
        title: 'Pengerjaan Dimulai',
        description: 'Freelancer telah mulai mengerjakan pesanan',
        time: order.createdAt,
        icon: ExclamationTriangleIcon,
        color: 'text-blue-500'
      })
    }

    if (order.status === 'completed') {
      events.push({
        id: 'completed',
        title: 'Pesanan Selesai',
        description: 'Pesanan telah selesai dan siap untuk review',
        time: order.deadline,
        icon: CheckCircle,
        color: 'text-green-600'
      })
    }

    return events
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <ClockIcon className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-text mb-2">Tidak Ada Pesanan</h3>
        <p className="text-textMuted">Buat pesanan terlebih dahulu untuk melihat status</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => {
        const steps = getStatusSteps(order.status)
        const timelineEvents = getTimelineEvents(order)
        
        return (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-text">#{order.id}</h3>
                  <p className="text-sm text-textMuted">{order.service} - {order.freelancer}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-textMuted">Total: ${order.price}</p>
                  <p className="text-sm text-textMuted">Deadline: {new Date(order.deadline).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-8">
                <h4 className="text-sm font-medium text-text mb-4">Status Pesanan</h4>
                <div className="flex items-center space-x-4">
                  {steps.map((step, index) => {
                    const Icon = step.icon
                    return (
                      <div key={step.id} className="flex items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                          step.completed 
                            ? 'bg-green-100 border-green-500' 
                            : step.current 
                            ? 'bg-blue-100 border-blue-500' 
                            : 'bg-gray-100 border-gray-300'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            step.completed 
                              ? 'text-green-600' 
                              : step.current 
                              ? 'text-blue-600' 
                              : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="ml-3">
                          <p className={`text-sm font-medium ${
                            step.completed || step.current ? 'text-text' : 'text-textMuted'
                          }`}>
                            {step.label}
                          </p>
                        </div>
                        {index < steps.length - 1 && (
                          <div className={`w-8 h-0.5 mx-4 ${
                            step.completed ? 'bg-green-500' : 'bg-gray-300'
                          }`} />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-text mb-4">Timeline</h4>
                <div className="space-y-4">
                  {timelineEvents.map((event, index) => {
                    const Icon = event.icon
                    return (
                      <div key={event.id} className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-primary' : 'bg-gray-100'
                        }`}>
                          <Icon className={`w-4 h-4 ${
                            index === 0 ? 'text-white' : 'text-gray-500'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-text">{event.title}</p>
                          <p className="text-sm text-textMuted">{event.description}</p>
                          <p className="text-xs text-textMuted mt-1">
                            {new Date(event.time).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors">
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    <span>Chat</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-text rounded-lg hover:bg-gray-50 transition-colors">
                    <DocumentTextIcon className="w-4 h-4" />
                    <span>Detail</span>
                  </button>
                </div>
                
                <div className="text-sm text-textMuted">
                  {order.status === 'pending' && 'Menunggu konfirmasi freelancer'}
                  {order.status === 'accepted' && 'Pesanan telah diterima'}
                  {order.status === 'in_progress' && 'Sedang dalam pengerjaan'}
                  {order.status === 'completed' && 'Pesanan telah selesai'}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default OrderStatus
