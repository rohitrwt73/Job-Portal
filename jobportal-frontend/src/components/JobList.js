"use client"

import { useEffect, useState } from "react"
import { MapPin, Building2, DollarSign, Clock, Briefcase, Heart } from "lucide-react"
import { Button } from "../components/ui/button"
import jobService from "../services/jobService" // ✅ default import

function JobList() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [savedJobs, setSavedJobs] = useState(new Set())

  useEffect(() => {
    jobService
      .getAllJobs()
      .then((response) => {
        setJobs(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error)
        setLoading(false)
      })
  }, [])

  const toggleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs)
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId)
    } else {
      newSavedJobs.add(jobId)
    }
    setSavedJobs(newSavedJobs)
  }

  if (loading) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading amazing job opportunities...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              <Briefcase className="h-4 w-4" />
              <span>Latest Opportunities</span>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Featured Jobs
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover your next career opportunity from our curated list of premium job openings
          </p>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-blue-100/50"
            >
              {/* Job Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Building2 className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="font-medium">{job.company || "Not specified"}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleSaveJob(job.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Heart className={`h-5 w-5 ${savedJobs.has(job.id) ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
              </div>

              {/* Job Description */}
              <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">{job.description}</p>

              {/* Job Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-teal-500" />
                  <span>{job.location || "Not specified"}</span>
                </div>

                {job.salary && (
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                    <span>{job.salary}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-orange-500" />
                    <span>{job.posted || "Recently posted"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                      {job.type || "Full-time"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300">
                  Apply Now
                </Button>
                <Button
                  variant="outline"
                  className="px-6 border-blue-200 hover:bg-blue-50 transition-colors bg-transparent"
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Section */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 hover:bg-blue-50 px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Load More Jobs
          </Button>
          <p className="mt-4 text-gray-600">Showing {jobs.length} of many available positions</p>
        </div>
      </div>
    </section>
  )
}

export default JobList
