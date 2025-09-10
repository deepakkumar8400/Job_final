// routes/parseResume.js (Backend API Route)
import express from 'express';
import PDFServicesSdk from '@adobe/pdfservices-node-sdk';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Helper function to parse the form data
function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
}

// Helper function to extract text from the parsed JSON
function extractTextFromJson(structuredData) {
  let text = '';
  
  if (structuredData.elements) {
    for (const element of structuredData.elements) {
      if (element.Text) {
        text += element.Text + '\n';
      }
    }
  }
  
  return text;
}

// Helper function to parse resume text into structured data
function parseResumeText(text) {
  // This is a simplified parser - you would want to enhance this
  // with more sophisticated NLP or pattern matching
  const lines = text.split('\n');
  
  const result = {
    contact: {},
    skills: [],
    experience: [],
    education: []
  };
  
  let currentSection = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;
    
    // Detect sections
    if (trimmedLine.match(/^(experience|work history)/i)) {
      currentSection = 'experience';
      continue;
    } else if (trimmedLine.match(/^(education)/i)) {
      currentSection = 'education';
      continue;
    } else if (trimmedLine.match(/^(skills|technical skills)/i)) {
      currentSection = 'skills';
      continue;
    }
    
    // Extract email
    const emailMatch = trimmedLine.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i);
    if (emailMatch) {
      result.contact.email = emailMatch[0];
    }
    
    // Extract phone
    const phoneMatch = trimmedLine.match(/(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/);
    if (phoneMatch) {
      result.contact.phone = phoneMatch[0];
    }
    
    // Process based on current section
    if (currentSection === 'skills' && trimmedLine.length > 2) {
      // Split skills by commas, slashes, or other delimiters
      const skills = trimmedLine.split(/[,/|•]+/).map(s => s.trim()).filter(s => s.length > 0);
      result.skills = [...result.skills, ...skills];
    }
    
    // You would add more sophisticated parsing for experience and education here
  }
  
  return result;
}

router.post('/', async (req, res) => {
  try {
    // Parse the form data
    const { fields, files } = await parseForm(req);
    
    const uploadedFile = files.file;
    if (!uploadedFile) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Set up credentials (should be stored in environment variables)
    const credentials = PDFServicesSdk.Credentials
      .serviceAccountCredentialsBuilder()
      .withClientId(process.env.ADOBE_CLIENT_ID)
      .withClientSecret(process.env.ADOBE_CLIENT_SECRET)
      .withPrivateKey(process.env.ADOBE_PRIVATE_KEY)
      .withOrganizationId(process.env.ADOBE_ORGANIZATION_ID)
      .withAccountId(process.env.ADOBE_ACCOUNT_ID)
      .build();

    // Create an ExecutionContext using credentials
    const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);

    // Build the extractPDF operation
    const extractPDFOperation = PDFServicesSdk.ExtractPDF.Operation.createNew();
    const input = PDFServicesSdk.FileRef.createFromLocalFile(uploadedFile.filepath);

    extractPDFOperation.setInput(input);

    // Set options for what to extract
    extractPDFOperation.addElementToExtract(PDFServicesSdk.ExtractPDF.ElementType.TEXT);
    
    // Execute the operation
    const result = await extractPDFOperation.execute(executionContext);
    
    // Save the result to a temporary file
    const tempDir = '/tmp';
    const outputFilePath = path.join(tempDir, `extract-${uuidv4()}.zip`);
    await result.saveAsFile(outputFilePath);
    
    // For simplicity, we'll just read the text content
    // In a real implementation, you would extract the ZIP and parse the JSON
    const textContent = "This would be the extracted text from the PDF";
    
    // Parse the text to extract structured information
    const parsedData = parseResumeText(textContent);
    
    // Add some demo data for display purposes
    const enhancedData = {
      contact: {
        name: "John Doe",
        email: parsedData.contact.email || "john.doe@example.com",
        phone: parsedData.contact.phone || "+1 (555) 123-4567",
        location: "San Francisco, CA"
      },
      skills: parsedData.skills.length > 0 ? parsedData.skills : ["JavaScript", "React", "Node.js"],
      experience: [
        {
          title: "Senior Developer",
          company: "Tech Company Inc.",
          startDate: "Jan 2020",
          endDate: "Present",
          description: "Developed web applications using modern frameworks."
        }
      ],
      education: [
        {
          degree: "B.S. Computer Science",
          institution: "University of Example",
          year: "2018"
        }
      ]
    };
    
    // Clean up temporary files
    fs.unlinkSync(uploadedFile.filepath);
    if (fs.existsSync(outputFilePath)) {
      fs.unlinkSync(outputFilePath);
    }
    
    // Send the parsed data back to the client
    res.status(200).json(enhancedData);
  } catch (error) {
    console.error('Error parsing PDF:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to parse PDF' 
    });
  }
});

export default router;