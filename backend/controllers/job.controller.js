import { Job } from "../models/job.model.js";

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Somethin is missing.",
                success: false
            })
        };
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
// student k liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications"
        });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
    }
}
// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateJob = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { 
            title, 
            description, 
            requirements, 
            salary, 
            location, 
            jobType, 
            experience, 
            position, 
            companyId 
        } = req.body;

        // Handle requirements - it might be an array or a string
        let requirementsArray = requirements;
        
        // If requirements is a string, split it into array
        if (typeof requirements === 'string') {
            requirementsArray = requirements.split(',').map(req => req.trim()).filter(req => req !== '');
        }
        
        // If requirements is already an array, ensure it's properly formatted
        if (Array.isArray(requirementsArray)) {
            requirementsArray = requirementsArray.map(req => typeof req === 'string' ? req.trim() : req).filter(req => req !== '');
        }

        const updatedJob = await Job.findByIdAndUpdate(
            id,
            {
                title,
                description,
                requirements: requirementsArray,
                salary,
                location,
                jobType,
                experienceLevel: experience,
                position,
                company: companyId
            },
            { new: true, runValidators: true }
        ).populate('company', 'name');

        if (!updatedJob) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            job: updatedJob
        });

    } catch (error) {
        next(error);
    }
};