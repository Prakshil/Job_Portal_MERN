const Application = require("../models/applicationSchema");
const Job = require("../models/jobSchema");

// Apply for a job
const applyjob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user._id;

    console.log("[applyjob] Job ID:", jobId);
    console.log("[applyjob] User ID:", userId);

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Check if user already applied for this job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId
    });

    if (existingApplication) {
      return res.status(400).json({ error: "You have already applied for this job" });
    }

    // Create new application
    const newApplication = new Application({
      job: jobId,
      applicant: userId,
      status: "pending"
    });

    const savedApplication = await newApplication.save();
    console.log("[applyjob] Application saved:", savedApplication._id);

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: savedApplication
    });

  } catch (error) {
    console.error("[applyjob] Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get user's applications
const getUserApplications = async (req, res) => {
  try {
    const userId = req.user._id;

    const applications = await Application.find({ applicant: userId })
      .populate({
        path: 'job',
        populate: {
          path: 'company',
          select: 'name logo'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications: applications
    });

  } catch (error) {
    console.error("[getUserApplications] Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get applications for a specific job (for recruiters)
const getJobApplications = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.user._id;

    // Verify that the job belongs to the current recruiter
    const job = await Job.findOne({ _id: jobId, created_by: userId });
    if (!job) {
      return res.status(403).json({ error: "Unauthorized access to job applications" });
    }

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email phoneNumber')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications: applications
    });

  } catch (error) {
    console.error("[getJobApplications] Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update application status (for recruiters)
const updateApplicationStatus = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { status } = req.body;
    const userId = req.user._id;

    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Find application and verify ownership
    const application = await Application.findById(applicationId).populate('job');
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Verify that the job belongs to the current recruiter
    if (application.job.created_by.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application: application
    });

  } catch (error) {
    console.error("[updateApplicationStatus] Error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { 
  applyjob, 
  getUserApplications, 
  getJobApplications, 
  updateApplicationStatus 
};
