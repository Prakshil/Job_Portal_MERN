const express = require("express");
const {
  postJob,
  getAllJobs,
  getjobbyId,
  getAdminalljob,
  getRecruiterJobs,
} = require("../controllers/jobcontroller");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/post", auth, postJob);
router.get("/get", getAllJobs); // Public route for job seekers
router.get("/recruiter", auth, getRecruiterJobs); // Get jobs created by current recruiter
router.get("/getadminjobs", auth, getAdminalljob);
router.get("/get/:id", getjobbyId);
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const Job = require("../models/jobSchema");
    const deletedJob = await Job.findOneAndDelete({ 
      _id: req.params.id, 
      created_by: req.user._id 
    });
    
    if (!deletedJob) {
      return res.status(404).json({ error: "Job not found or unauthorized" });
    }
    
    res.json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
