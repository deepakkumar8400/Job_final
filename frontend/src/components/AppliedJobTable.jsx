import React, { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'
import { Calendar, Briefcase, Building, Clock, AlertCircle, Search, Filter, BarChart3 } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

const AppliedJobTable = () => {
  const { allAppliedJobs, isLoading } = useSelector(store => store.job)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  // Calculate application statistics
  const applicationStats = {
    total: allAppliedJobs.length,
    pending: allAppliedJobs.filter(job => job.status === 'pending').length,
    accepted: allAppliedJobs.filter(job => job.status === 'accepted').length,
    rejected: allAppliedJobs.filter(job => job.status === 'rejected').length,
  }

  // Filter and sort applied jobs
  const filteredJobs = allAppliedJobs
    .filter(job => {
      const matchesSearch = job.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.job?.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt)
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt)
      }
    })

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'accepted': return 'default'
      case 'pending': return 'secondary'
      case 'rejected': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted': return 'Accepted'
      case 'pending': return 'Pending'
      case 'rejected': return 'Rejected'
      default: return status
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded w-full mb-3"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Application Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Applications Card */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Applications</h3>
          <div className="text-2xl font-bold text-[#7209b7]">{applicationStats.total}</div>
          <p className="text-xs text-gray-500">All applications</p>
        </div>

        {/* Pending Card */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Pending</h3>
          <div className="text-2xl font-bold text-amber-600">{applicationStats.pending}</div>
          <p className="text-xs text-gray-500">Awaiting response</p>
        </div>

        {/* Accepted Card */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Accepted</h3>
          <div className="text-2xl font-bold text-green-600">{applicationStats.accepted}</div>
          <p className="text-xs text-gray-500">Offers received</p>
        </div>

        {/* Rejected Card */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Rejected</h3>
          <div className="text-2xl font-bold text-red-600">{applicationStats.rejected}</div>
          <p className="text-xs text-gray-500">Not selected</p>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-[#7209b7]" />
            Applied Jobs
            <Badge variant="outline" className="ml-2 bg-[#7209b7] text-white">
              {applicationStats.total}
            </Badge>
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search jobs or companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full md:w-64"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status ({applicationStats.total})</SelectItem>
                <SelectItem value="pending">Pending ({applicationStats.pending})</SelectItem>
                <SelectItem value="accepted">Accepted ({applicationStats.accepted})</SelectItem>
                <SelectItem value="rejected">Rejected ({applicationStats.rejected})</SelectItem>
                
              </SelectContent>
            </Select>
            
              
          </div>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            {allAppliedJobs.length === 0 ? (
              <>
                <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-500 mb-6">You haven't applied to any jobs yet. Start applying to see them here.</p>
                <Button className="bg-[#7209b7] hover:bg-[#5f32ad]">
                  Browse Jobs
                </Button>
              </>
            ) : (
              <>
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No matching applications</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {filteredJobs.length} of {allAppliedJobs.length} applications
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BarChart3 className="h-4 w-4" />
                <span>
                  {statusFilter === 'all' ? 'All applications' : `${getStatusText(statusFilter)}: ${filteredJobs.length}`}
                </span>
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="w-[180px]">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Date Applied
                      </div>
                    </TableHead>
                    <TableHead>Job Role</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        Company
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Status
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((appliedJob) => (
                    <TableRow key={appliedJob._id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {new Date(appliedJob?.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(appliedJob?.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{appliedJob.job?.title}</TableCell>
                      <TableCell>{appliedJob.job?.company?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={getStatusBadgeVariant(appliedJob.status)}
                          className="capitalize px-3 py-1"
                        >
                          {getStatusText(appliedJob.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AppliedJobTable