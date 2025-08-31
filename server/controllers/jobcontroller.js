const Job = require("../models/jobSchema");
const Company = require("../models/companySchema");

const postJob = async (req, res) => {
  try {
    console.log("[postJob] User from auth middleware:", req.user ? { id: req.user._id, email: req.user.email, role: req.user.role } : "No user");
    console.log("[postJob] Request body:", req.body);

    const {
      title,
      description,
      requirements,
      salary,
      experienceLevel,
      location,
      jobType,
      position,
      companyId,
    } = req.body;
    
    const userId = req.user._id; // Fixed: should be _id

    // Verify that the company belongs to the current user
    const company = await Company.findOne({ _id: companyId, userId: userId });
    if (!company) {
      return res.status(403).json({ 
        error: "You can only create jobs for companies you own" 
      });
    }

    console.log("[postJob] Creating job for company:", company.name);

    const newJob = new Job({
      title,
      description,
      requirements: Array.isArray(requirements) ? requirements : [requirements].filter(Boolean),
      salary,
      experienceLevel,
      location,
      jobType,
      position,
      company: companyId,
      created_by: userId,
    });
    
    const savedJob = await newJob.save();
    console.log("[postJob] Job created successfully:", savedJob._id);

    res.status(201).json({ 
      success: true,
      message: "New job created successfully.", 
      job: savedJob 
    });
  } catch (error) {
    console.log("[postJob] Error:", error);
    res.status(500).json({ error: error.message });
  }
};
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('company', 'name').populate('created_by', 'name email');
    if (!jobs || jobs.length === 0) {
      return res.status(200).json({ 
        success: true,
        message: "No jobs found", 
        jobs: [] 
      });
    }

    res.status(200).json({ 
      success: true,
      message: "get all jobs success", 
      jobs 
    });
  } catch (error) {
    console.log("[getAllJobs] Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get jobs created by the current recruiter
const getRecruiterJobs = async (req, res) => {
  try {
    console.log("[getRecruiterJobs] Getting jobs for recruiter:", req.user._id);
    
    const Application = require("../models/applicationSchema");
    
    const jobs = await Job.find({ created_by: req.user._id })
      .populate('company', 'name location')
      .populate('created_by', 'name email')
      .sort({ createdAt: -1 });
    
    // Add application counts to each job
    const jobsWithApplications = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await Application.countDocuments({ job: job._id });
        return {
          ...job.toObject(),
          applicationCount
        };
      })
    );
    
    console.log("[getRecruiterJobs] Found jobs:", jobsWithApplications.length);
    
    res.status(200).json({ 
      success: true,
      message: "Jobs retrieved successfully", 
      jobs: jobsWithApplications
    });
  } catch (error) {
    console.log("[getRecruiterJobs] Error:", error);
    res.status(500).json({ error: error.message });
  }
};
const getjobbyId = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.status(200).json({ message: "get job by id success", job });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
// admin kitne job create kra hai abhi tk
const getAdminalljob = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json({ message: "get admin all jobs success", jobs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
module.exports = { postJob, getAllJobs, getjobbyId, getAdminalljob, getRecruiterJobs };
