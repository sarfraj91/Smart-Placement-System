import express from "express";
import { applyForJob, getUserData, getUserJobApplications, updateUserResume,completeUserProfile } from "../controller/userController.js";
import upload from "../config/multer.js";

const router = express.Router();

// Get User Data

router.get("/user", getUserData)

// Apply for a Job

router.post("/apply", applyForJob)

// Get applied jobs data
router.get("/applications", getUserJobApplications)

// Update the resume

router.post('/update-resume', upload.single("resume"), updateUserResume)

//to  profile completion 

router.put("/completeProfile", completeUserProfile);




export default router;