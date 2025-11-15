import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderService } from '../services/orderService'

export const useOrder = (orderId) => {
  const queryClient = useQueryClient()

  // Get order detail
  const query = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrderById(orderId),
    enabled: !!orderId
  })

  // Accept order mutation
  const acceptMutation = useMutation({
    mutationFn: () => orderService.acceptOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries(['order', orderId])
      queryClient.invalidateQueries(['orders'])
    }
  })

  // Reject order mutation
  const rejectMutation = useMutation({
    mutationFn: (reason) => orderService.rejectOrder(orderId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['order', orderId])
      queryClient.invalidateQueries(['orders'])
    }
  })

  // Complete order mutation
  const completeMutation = useMutation({
    mutationFn: (data) => orderService.completeOrder(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['order', orderId])
      queryClient.invalidateQueries(['orders'])
    }
  })

  // Cancel order mutation
  const cancelMutation = useMutation({
    mutationFn: (reason) => orderService.cancelOrder(orderId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['order', orderId])
      queryClient.invalidateQueries(['orders'])
    }
  })

  return {
    // Data
    order: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
    
    // Actions
    acceptOrder: acceptMutation.mutate,
    rejectOrder: rejectMutation.mutate,
    completeOrder: completeMutation.mutate,
    cancelOrder: cancelMutation.mutate,
    
    // Loading states
    isAccepting: acceptMutation.isPending,
    isRejecting: rejectMutation.isPending,
    isCompleting: completeMutation.isPending,
    isCancelling: cancelMutation.isPending
  }
}

// Hook for fetching list of orders
export const useOrders = ({ page = 1, limit = 10, status = null } = {}) => {
  const query = useQuery({
    queryKey: ['orders', page, limit, status],
    queryFn: () => orderService.getOrders({ page, limit, status })
  })

  return {
    orders: query.data?.data?.items || [],
    pagination: query.data?.data?.pagination,
    isLoading: query.isLoading,
    error: query.error
  }
}

// Hook for creating new order
export const useCreateOrder = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(['orders'])
    }
  })

  return {
    createOrder: mutation.mutate,
    isCreating: mutation.isPending,
    error: mutation.error,
    data: mutation.data
  }
}
