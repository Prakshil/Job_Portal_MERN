const express = require("express");
const router = express.Router();
const { 
  applyjob, 
  getUserApplications, 
  getJobApplications, 
  updateApplicationStatus 
} = require("../controllers/applicationcontroller");
const auth = require("../middlewares/auth");

// User routes
router.post("/apply/:id", auth, applyjob);
router.get("/my-applications", auth, getUserApplications);

// Recruiter routes  
router.get("/job/:jobId", auth, getJobApplications);
router.put("/status/:id", auth, updateApplicationStatus);

module.exports = router;
