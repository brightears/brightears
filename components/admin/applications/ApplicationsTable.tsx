'use client'

import React, { useState, useEffect } from 'react'
import { ArtistCategory, ApplicationStatus } from '@prisma/client'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import ApplicationDetailModal from './ApplicationDetailModal'

interface Application {
  id: string
  applicantName: string
  email: string
  phone: string
  lineId: string
  stageName: string
  category: ArtistCategory
  status: ApplicationStatus
  submittedAt: string
  reviewedAt: string | null
  profilePhotoUrl: string | null
  baseLocation: string | null
}

interface ApplicationsTableProps {
  locale: string
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700'
}

const statusLabels = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
}

const ApplicationsTable = ({ locale }: ApplicationsTableProps) => {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  // Modal
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [statusFilter, categoryFilter, searchQuery, currentPage])

  const fetchApplications = async () => {
    try {
      setLoading(true)

      const params = new URLSearchParams({
        status: statusFilter,
        page: currentPage.toString(),
        limit: '20'
      })

      if (categoryFilter) params.append('category', categoryFilter)
      if (searchQuery) params.append('search', searchQuery)

      const response = await fetch(`/api/admin/applications?${params}`)

      if (!response.ok) {
        throw new Error('Failed to fetch applications')
      }

      const data = await response.json()
      setApplications(data.applications)
      setTotalPages(data.pagination.totalPages)
      setTotalCount(data.pagination.total)
    } catch (err) {
      console.error('Error fetching applications:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchApplications()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleApplicationUpdated = () => {
    fetchApplications()
    setSelectedApplicationId(null)
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-playfair font-bold text-deep-teal">
          Application Management
        </h1>
        <p className="mt-2 text-dark-gray/60">
          Review and approve artist applications ({totalCount} total)
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="md:col-span-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-gray/40" />
              <input
                type="text"
                placeholder="Search by name, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-dark-gray/20 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
              />
            </div>
          </form>

          {/* Status filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-2 border border-dark-gray/20 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* Category filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-2 border border-dark-gray/20 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="DJ">DJ</option>
              <option value="BAND">Band</option>
              <option value="SINGER">Singer</option>
              <option value="MUSICIAN">Musician</option>
              <option value="MC">MC</option>
              <option value="COMEDIAN">Comedian</option>
              <option value="MAGICIAN">Magician</option>
              <option value="DANCER">Dancer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-cyan"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">
            Error: {error}
          </div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center text-dark-gray/60">
            <FunnelIcon className="mx-auto h-12 w-12 text-dark-gray/20 mb-4" />
            <p className="text-lg">No applications found</p>
            <p className="text-sm mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-dark-gray/10">
              <thead className="bg-dark-gray/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-gray/60 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-gray/60 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-gray/60 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-gray/60 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-gray/60 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-dark-gray/60 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-dark-gray/10">
                {applications.map((application) => (
                  <tr key={application.id} className="hover:bg-dark-gray/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {application.profilePhotoUrl ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={application.profilePhotoUrl}
                              alt={application.applicantName}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-brand-cyan/10 flex items-center justify-center">
                              <span className="text-brand-cyan font-medium">
                                {application.applicantName.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-dark-gray">
                            {application.applicantName}
                          </div>
                          <div className="text-sm text-dark-gray/60">
                            {application.stageName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-dark-gray">{application.email}</div>
                      <div className="text-sm text-dark-gray/60">{application.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-brand-cyan/10 text-brand-cyan">
                        {application.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[application.status]}`}>
                        {statusLabels[application.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-gray/60">
                      {formatDate(application.submittedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedApplicationId(application.id)}
                        className="text-brand-cyan hover:text-brand-cyan/80 font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && applications.length > 0 && (
          <div className="bg-dark-gray/5 px-6 py-4 flex items-center justify-between border-t border-dark-gray/10">
            <div className="text-sm text-dark-gray/60">
              Page {currentPage} of {totalPages} ({totalCount} total)
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-dark-gray bg-white border border-dark-gray/20 rounded-lg hover:bg-dark-gray/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-dark-gray bg-white border border-dark-gray/20 rounded-lg hover:bg-dark-gray/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedApplicationId && (
        <ApplicationDetailModal
          applicationId={selectedApplicationId}
          onClose={() => setSelectedApplicationId(null)}
          onUpdate={handleApplicationUpdated}
        />
      )}
    </div>
  )
}

export default ApplicationsTable
