import e from "express";
import User from "../models/User.js";
import JobApplication from "../models/JobApplication.js";
import Job from "../models/Job.js";
import { v2 } from "cloudinary";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";


// Get user Data
export const getUserData = async (req, res) => {
  const userId = req.auth.userId;

  console.log("User ID from request:", userId); // Log the user ID

  try {
    const user = await User.findById(userId);

    if (!user) {
      console.log("User not found in database"); // Log if user is not found
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.log("Error fetching user:", error.message); // Log any errors
    res.json({ success: false, message: error.message });
  }
};

// Apply For a Job
export const applyForJob = async (req, res) => {
  const { jobId } = req.body;
  const userId = req.auth.userId;

  try {
    const isAlreadyApplied = await JobApplication.findOne({ userId, jobId });

    if (isAlreadyApplied) {
      return res.json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const jobData = await Job.findById(jobId);

    if (!jobData) {
      return res.json({ success: false, message: "Job not found" });
    }

    await JobApplication.create({
      companyId: jobData.companyId,
      userId,
      jobId,
      date: Date.now(),
    });

    res.json({ success: true, message: "Applied Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get User applied applications
export const getUserJobApplications = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const applications = await JobApplication.find({ userId })
      .populate("companyId", "name email image")
      .populate("jobId", "title description location level salary")
      .exec();

    if (!applications) {
      return res.json({
        success: false,
        message: "No applications found for this User",
      });
    }

    return res.json({ success: true, applications });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update User Profile (resume)
// export const updateUserResume = async (req, res) => {
//   try {
//     const userId = req.auth.userId;
//     const resumeFile = req.file;

//     console.log("Resume file:", resumeFile);

//     const userData = await User.findById(userId);

//     if (resumeFile) {
//       const resumeUpload = await v2.uploader.upload(resumeFile.path, {
//         resource_type: "raw",
//         folder: "resumes",
//       });
//       userData.resume = resumeUpload.secure_url;
//     }
//     await userData.save();

//     return res.json({ success: true, message: "Resume Updated Successfully" });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

export const updateUserResume = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const file = req.file; // upload.single("resume")

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No resume file uploaded",
      });
    }

    // Upload PDF to Cloudinary (RAW)
    const uploadResult = await uploadToCloudinary(file, "resumes");

    if (!uploadResult?.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Resume upload failed",
      });
    }

    // Delete local file after upload
    fs.unlinkSync(file.path);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.resume = uploadResult.secure_url;
    await user.save();

    return res.json({
      success: true,
      message: "Resume uploaded successfully",
      resume: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("updateUserResume error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//to get profile completion status
export const getProfileStatus = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.json({
        success: true,
        profileCompleted: false,
      });
    }

    return res.json({
      success: true,
      profileCompleted: user.profileCompleted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const completeUserProfile = async (req, res) => {
  try {
    const userId = req.auth.userId;
    console.log("User ID:", userId);

    const {
     
      phone,
      college,
      course,
      branch,
      graduationYear,
      linkedin,
      github,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        
        phone,
        college,
        course,
        branch,
        graduationYear,
        linkedin,
        github,
        profileCompleted: true, // 🔥 VERY IMPORTANT
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      message: "User profile saved successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


