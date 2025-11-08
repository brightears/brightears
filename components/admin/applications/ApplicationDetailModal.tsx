'use client'

import React, { useState, useEffect } from 'react'
import { XMarkIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { ApplicationStatus } from '@prisma/client'

interface ApplicationDetail {
  id: string
  applicantName: string
  email: string
  phone: string
  lineId: string
  stageName: string
  bio: string
  category: string
  genres: string[]
  profilePhotoUrl: string | null
  website: string | null
  socialMediaLinks: string | null
  yearsExperience: number | null
  equipmentOwned: string | null
  portfolioLinks: string | null
  baseLocation: string | null
  hourlyRateExpectation: string | null
  interestedInMusicDesign: boolean
  designFee: string | null
  monthlyFee: string | null
  status: ApplicationStatus
  submittedAt: string
  reviewedAt: string | null
  reviewNotes: string | null
}

interface ApplicationDetailModalProps {
  applicationId: string
  onClose: () => void
  onUpdate: () => void
}

const ApplicationDetailModal = ({ applicationId, onClose, onUpdate }: ApplicationDetailModalProps) => {
  const [application, setApplication] = useState<ApplicationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)

  const [reviewNotes, setReviewNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchApplication()
  }, [applicationId])

  const fetchApplication = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/applications/${applicationId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch application')
      }

      const data = await response.json()
      setApplication(data)
    } catch (err) {
      console.error('Error fetching application:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    try {
      setActionLoading(true)

      const response = await fetch(`/api/admin/applications/${applicationId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewNotes })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to approve')
      }

      alert('Application approved! Artist profile created successfully.')
      onUpdate()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to approve application')
    } finally {
      setActionLoading(false)
      setShowApproveModal(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason || rejectionReason.length < 10) {
      alert('Please provide a rejection reason (minimum 10 characters)')
      return
    }

    try {
      setActionLoading(false)

      const response = await fetch(`/api/admin/applications/${applicationId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectionReason, reviewNotes })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to reject')
      }

      alert('Application rejected.')
      onUpdate()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reject application')
    } finally {
      setActionLoading(false)
      setShowRejectModal(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-gray/50 backdrop-blur-sm">
        <div className="bg-white rounded-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-cyan mx-auto"></div>
        </div>
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-gray/50 backdrop-blur-sm">
        <div className="bg-white rounded-xl p-8 max-w-md">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-dark-gray text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  const isPending = application.status === 'PENDING'

  return (
    <>
      {/* Main Detail Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-dark-gray/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal content */}
          <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-dark-gray/10 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-playfair font-bold text-deep-teal">
                Application Details
              </h2>
              <button
                onClick={onClose}
                className="text-dark-gray/60 hover:text-dark-gray"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Status badge */}
              <div>
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    application.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-700'
                      : application.status === 'APPROVED'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {application.status}
                </span>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <InfoField label="Applicant Name" value={application.applicantName} />
                <InfoField label="Stage Name" value={application.stageName} />
                <InfoField label="Email" value={application.email} />
                <InfoField label="Phone" value={application.phone} />
                <InfoField label="LINE ID" value={application.lineId} />
                <InfoField label="Category" value={application.category} />
                <InfoField label="Base Location" value={application.baseLocation || 'Not specified'} />
                <InfoField label="Years Experience" value={application.yearsExperience?.toString() || 'Not specified'} />
              </div>

              {/* Bio */}
              <div>
                <h3 className="text-sm font-medium text-dark-gray/60 mb-2">Bio</h3>
                <p className="text-dark-gray bg-dark-gray/5 p-4 rounded-lg">
                  {application.bio}
                </p>
              </div>

              {/* Genres */}
              <div>
                <h3 className="text-sm font-medium text-dark-gray/60 mb-2">Genres / Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {application.genres.map((genre, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-brand-cyan/10 text-brand-cyan text-sm rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              {application.hourlyRateExpectation && (
                <InfoField
                  label="Hourly Rate Expectation"
                  value={`฿${parseFloat(application.hourlyRateExpectation).toLocaleString()}`}
                />
              )}

              {/* Music Design Service */}
              {application.interestedInMusicDesign && (
                <div className="bg-soft-lavender/10 border border-soft-lavender/20 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-soft-lavender mb-2">
                    Music Design Service Interest
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {application.designFee && (
                      <div>
                        <span className="text-dark-gray/60">Design Fee: </span>
                        <span className="font-medium">฿{parseFloat(application.designFee).toLocaleString()}</span>
                      </div>
                    )}
                    {application.monthlyFee && (
                      <div>
                        <span className="text-dark-gray/60">Monthly Fee: </span>
                        <span className="font-medium">฿{parseFloat(application.monthlyFee).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Links */}
              {(application.website || application.socialMediaLinks || application.portfolioLinks) && (
                <div className="space-y-2">
                  {application.website && (
                    <InfoField
                      label="Website"
                      value={
                        <a
                          href={application.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-cyan hover:underline"
                        >
                          {application.website}
                        </a>
                      }
                    />
                  )}
                  {application.socialMediaLinks && (
                    <InfoField label="Social Media" value={application.socialMediaLinks} />
                  )}
                  {application.portfolioLinks && (
                    <InfoField label="Portfolio" value={application.portfolioLinks} />
                  )}
                </div>
              )}

              {/* Equipment */}
              {application.equipmentOwned && (
                <div>
                  <h3 className="text-sm font-medium text-dark-gray/60 mb-2">Equipment Owned</h3>
                  <p className="text-dark-gray bg-dark-gray/5 p-4 rounded-lg text-sm">
                    {application.equipmentOwned}
                  </p>
                </div>
              )}

              {/* Review Notes (if reviewed) */}
              {application.reviewNotes && (
                <div>
                  <h3 className="text-sm font-medium text-dark-gray/60 mb-2">Review Notes</h3>
                  <p className="text-dark-gray bg-dark-gray/5 p-4 rounded-lg text-sm">
                    {application.reviewNotes}
                  </p>
                </div>
              )}
            </div>

            {/* Actions (only for PENDING) */}
            {isPending && (
              <div className="border-t border-dark-gray/10 px-6 py-4 flex gap-4 bg-dark-gray/5">
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="flex-1 px-6 py-3 bg-white border-2 border-red-500 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                  <XCircleIcon className="h-5 w-5" />
                  Reject
                </button>
                <button
                  onClick={() => setShowApproveModal(true)}
                  className="flex-1 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircleIcon className="h-5 w-5" />
                  Approve & Create Artist
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Approve Confirmation Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark-gray/50 backdrop-blur-sm" onClick={() => setShowApproveModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-playfair font-bold text-deep-teal mb-4">
              Approve Application
            </h3>
            <p className="text-dark-gray/60 mb-4">
              This will create an Artist profile for {application.stageName}. Are you sure?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-dark-gray/60 mb-2">
                Review Notes (Optional)
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-dark-gray/20 rounded-lg focus:ring-2 focus:ring-brand-cyan"
                placeholder="Notes about this approval..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-dark-gray/20 text-dark-gray rounded-lg hover:bg-dark-gray/5"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {actionLoading ? 'Approving...' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark-gray/50 backdrop-blur-sm" onClick={() => setShowRejectModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-playfair font-bold text-deep-teal mb-4">
              Reject Application
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-dark-gray/60 mb-2">
                Rejection Reason * (Min 10 characters)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-dark-gray/20 rounded-lg focus:ring-2 focus:ring-brand-cyan"
                placeholder="Explain why this application is being rejected..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-dark-gray/20 text-dark-gray rounded-lg hover:bg-dark-gray/5"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Helper component
const InfoField = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <h3 className="text-sm font-medium text-dark-gray/60 mb-1">{label}</h3>
    <p className="text-dark-gray">{value}</p>
  </div>
)

export default ApplicationDetailModal
