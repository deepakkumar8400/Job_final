import mongoose from "mongoose";
import { Company } from "../models/company.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from '../utils/dataUri.js';

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            })
        };
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location, industry, size } = req.body;
        
        let logo;
        // Check if a file was uploaded
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            logo = cloudResponse.secure_url;
        }

        const updateData = { 
            name, 
            description, 
            website, 
            location, 
            industry, 
            size 
        };
        
        // Only add logo to update data if it was provided
        if (logo) {
            updateData.logo = logo;
        }

        const company = await Company.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true, runValidators: true }
        );

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }
        
        return res.status(200).json({
            message: "Company information updated successfully.",
            success: true,
            company // Return the updated company
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const deleteCompany = async (req, res) => {
  try {
    const companyId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ 
        message: "Invalid company ID", 
        success: false 
      });
    }

    console.log("Delete request for company:", companyId);

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    // Cloudinary delete (if logo exists)
    if (company.logo) {
      try {
        const urlParts = company.logo.split("/");
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExtension.split(".")[0];

        await cloudinary.uploader.destroy(publicId);
        console.log("Deleted Cloudinary image:", publicId);
      } catch (cloudinaryError) {
        console.log("Cloudinary error:", cloudinaryError);
        // continue even if logo deletion fails
      }
    }

    await Company.findByIdAndDelete(companyId);

    return res.status(200).json({
      message: "Company deleted successfully.",
      success: true,
      deletedCompanyId: companyId,
    });
  } catch (error) {
    console.error("Delete company error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};
