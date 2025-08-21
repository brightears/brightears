'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon
} from '@heroicons/react/24/outline'

interface User {
  id: string
  email: string
  name: string
  role: string
  isEmailVerified: boolean
  isActive: boolean
  createdAt: string
  lastActiveAt: string | null
  profileImage: string | null
  artist?: {
    stageName: string
    verificationStatus: string
    completedBookings: number
    totalEarnings: number
  }
  customer?: {
    totalSpent: number
    bookingCount: number
  }
  corporate?: {
    companyName: string
    verificationStatus: string
  }
}

interface UserSearchResponse {
  users: User[]
  pagination: {
    currentPage: number
    totalPages: number
    totalUsers: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

interface AdminUserManagementProps {
  locale: string
}

export default function AdminUserManagement({ locale }: AdminUserManagementProps) {
  const t = useTranslations('dashboard.admin')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [verificationFilter, setVerificationFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [searchQuery, roleFilter, verificationFilter, currentPage])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (roleFilter) params.set('role', roleFilter)
      if (verificationFilter) params.set('verificationStatus', verificationFilter)
      params.set('page', currentPage.toString())
      params.set('limit', '20')

      const response = await fetch(`/api/admin/users?${params}`)
      if (response.ok) {
        const data: UserSearchResponse = await response.json()
        setUsers(data.users)
        setTotalPages(data.pagination.totalPages)
        setTotalUsers(data.pagination.totalUsers)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (userId: string, action: string, data?: any) => {
    try {
      let response
      switch (action) {
        case 'view':
          response = await fetch(`/api/admin/users/${userId}`)
          if (response.ok) {
            const userData = await response.json()
            setSelectedUser(userData.user)
            setShowUserModal(true)
          }
          break
        case 'update':
          response = await fetch(`/api/admin/users/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })
          if (response.ok) {
            fetchUsers()
            setShowUserModal(false)
          }
          break
        case 'deactivate':
          response = await fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE'
          })
          if (response.ok) {
            fetchUsers()
          }
          break
      }
    } catch (error) {
      console.error(`Failed to ${action} user:`, error)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800'
      case 'ARTIST':
        return 'bg-blue-100 text-blue-800'
      case 'CUSTOMER':
        return 'bg-green-100 text-green-800'
      case 'CORPORATE':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-playfair font-bold text-dark-gray mb-2">
                User Management
              </h1>
              <p className="text-dark-gray/70 font-inter">
                Manage platform users and their permissions
              </p>
              <button
              onClick={() => setShowCreateModal(true)}
              className="bg-brand-cyan text-white px-4 py-2 rounded-lg hover:bg-brand-cyan/90 flex items-center"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add User
            </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-cyan focus:border-brand-cyan"
              />
  
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-cyan focus:border-brand-cyan"
            >
              <option value="">All Roles</option>
              <option value="ARTIST">Artists</option>
              <option value="CUSTOMER">Customers</option>
              <option value="CORPORATE">Corporate</option>
              <option value="ADMIN">Admins</option>
            </select>

            {/* Verification Filter */}
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-cyan focus:border-brand-cyan"
            >
              <option value="">All Status</option>
              <option value="VERIFIED">Verified</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center text-sm text-dark-gray/70">
              {totalUsers} users found
          </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-cyan mx-auto"></div>
              <p className="text-dark-gray/70 mt-2">Loading users...</p>
            ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              {user.profileImage ? (
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={user.profileImage}
                                  alt=""
                                />
                              ) : (
                                <UserIcon className="h-6 w-6 text-gray-400" />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              {user.artist && (
                                <div className="text-xs text-blue-600">
                                  {user.artist.stageName}
                                </div>
                              )}
                              {user.corporate && (
                                <div className="text-xs text-purple-600">
                                  {user.corporate.companyName}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center">
                              {user.isActive ? (
                                <CheckCircleIcon className="w-4 h-4 text-green-500 mr-1" />
                              ) : (
                                <XCircleIcon className="w-4 h-4 text-red-500 mr-1" />
                              )}
                              <span className="text-xs">
                                {user.isActive ? 'Active' : 'Inactive'}
                              </span>
                                              {(user.artist || user.corporate) && (
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                getVerificationColor(user.artist?.verificationStatus || user.corporate?.verificationStatus || '')
                              }`}>
                                {user.artist?.verificationStatus || user.corporate?.verificationStatus}
                              </span>
                            )}
                                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div>Joined: {formatDate(user.createdAt)}</div>
                            {user.lastActiveAt && (
                              <div className="text-xs text-gray-500">
                                Last: {formatDate(user.lastActiveAt)}
                                                )}
                                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.artist && (
                            <div>
                              <div>{user.artist.completedBookings} bookings</div>
                              <div className="text-xs text-gray-500">
                                {formatCurrency(user.artist.totalEarnings)}
                                                                )}
                          {user.customer && (
                            <div>
                              <div>{user.customer.bookingCount} bookings</div>
                              <div className="text-xs text-gray-500">
                                {formatCurrency(user.customer.totalSpent)}
                                                                )}
                          {user.role === 'ADMIN' && (
                            <div className="text-xs text-gray-500">Admin user</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleUserAction(user.id, 'view')}
                              className="text-brand-cyan hover:text-brand-cyan/80"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUser(user)
                                setShowUserModal(true)
                              }}
                              className="text-earthy-brown hover:text-earthy-brown/80"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            {user.role !== 'ADMIN' && (
                              <button
                                onClick={() => {
                                  if (confirm('Are you sure you want to deactivate this user?')) {
                                    handleUserAction(user.id, 'deactivate')
                                  }
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            )}
                                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
    
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * 20 + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(currentPage * 20, totalUsers)}</span> of{' '}
                        <span className="font-medium">{totalUsers}</span> results
                      </p>
                              <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === currentPage
                                ? 'z-10 bg-brand-cyan border-brand-cyan text-white'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </nav>
                                      )}
            </>
          )}
        </div>
      </div>

      {/* User Detail/Edit Modal */}
      {showUserModal && selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => setShowUserModal(false)}
          onUpdate={(data) => handleUserAction(selectedUser.id, 'update', data)}
        />
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            fetchUsers()
          }}
        />
      )}
      </div>
    </div>
  )
}

// User Detail/Edit Modal Component
function UserModal({ user, onClose, onUpdate }: { 
  user: User; 
  onClose: () => void; 
  onUpdate: (data: any) => void 
}) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    isEmailVerified: user.isEmailVerified,
    adminNotes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(formData)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-playfair font-bold text-gray-900 mb-4">
          Edit User: {user.name}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
          
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="CUSTOMER">Customer</option>
            <option value="ARTIST">Artist</option>
            <option value="CORPORATE">Corporate</option>
            <option value="ADMIN">Admin</option>
          </select>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              Active
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isEmailVerified}
                onChange={(e) => setFormData({ ...formData, isEmailVerified: e.target.checked })}
                className="mr-2"
              />
              Email Verified
            </label>
          
          <textarea
            placeholder="Admin Notes"
            value={formData.adminNotes}
            onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            rows={3}
          />
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-cyan text-white rounded-lg hover:bg-brand-cyan/90"
            >
              Update User
            </button>
        </form>
      </div>
    </div>
  )
}

// Create User Modal Component
function CreateUserModal({ onClose, onSuccess }: { 
  onClose: () => void; 
  onSuccess: () => void 
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
    isEmailVerified: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        onSuccess()
      }
    } catch (error) {
      console.error('Failed to create user:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-playfair font-bold text-gray-900 mb-4">
          Create New User
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
          
          <input
            type="password"
            placeholder="Password (min 8 characters)"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            minLength={8}
            required
          />
          
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="CUSTOMER">Customer</option>
            <option value="ARTIST">Artist</option>
            <option value="CORPORATE">Corporate</option>
            <option value="ADMIN">Admin</option>
          </select>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isEmailVerified}
              onChange={(e) => setFormData({ ...formData, isEmailVerified: e.target.checked })}
              className="mr-2"
            />
            Mark email as verified
          </label>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-cyan text-white rounded-lg hover:bg-brand-cyan/90"
            >
              Create User
            </button>
        </form>
      </div>
    </div>
  </div>
  )
}