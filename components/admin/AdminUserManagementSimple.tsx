'use client'

import { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon,
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

export default function AdminUserManagementSimple({ locale }: AdminUserManagementProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)

  useEffect(() => {
    fetchUsers()
  }, [searchQuery, roleFilter, currentPage])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (roleFilter) params.set('role', roleFilter)
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
            </div>
            <button className="bg-brand-cyan text-white px-4 py-2 rounded-lg hover:bg-brand-cyan/90 flex items-center">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add User
            </button>
          </div>
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
            </div>

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

            {/* Results Count */}
            <div className="flex items-center text-sm text-dark-gray/70 col-span-2">
              {totalUsers} users found
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-cyan mx-auto"></div>
              <p className="text-dark-gray/70 mt-2">Loading users...</p>
            </div>
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
                        Joined
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
                                  Artist: {user.artist.stageName}
                                </div>
                              )}
                              {user.corporate && (
                                <div className="text-xs text-purple-600">
                                  Corp: {user.corporate.companyName}
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
                          <div className="flex items-center">
                            {user.isActive ? (
                              <CheckCircleIcon className="w-4 h-4 text-green-500 mr-1" />
                            ) : (
                              <XCircleIcon className="w-4 h-4 text-red-500 mr-1" />
                            )}
                            <span className="text-xs">
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div>Joined: {formatDate(user.createdAt)}</div>
                            {user.lastActiveAt && (
                              <div className="text-xs text-gray-500">
                                Last: {formatDate(user.lastActiveAt)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="text-brand-cyan hover:text-brand-cyan/80">
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            <button className="text-earthy-brown hover:text-earthy-brown/80">
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            {user.role !== 'ADMIN' && (
                              <button className="text-red-600 hover:text-red-800">
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * 20 + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(currentPage * 20, totalUsers)}</span> of{' '}
                        <span className="font-medium">{totalUsers}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
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
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}