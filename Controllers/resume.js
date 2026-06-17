const ResumeModel = require('../Models/resume')
const multer = require('multer');
const pdfParse = require('pdf-parse');
const path = require('path');
const {CohereClient} = require('cohere-ai');

const cohere = new CohereClient({
    token: "SmcMvAH5lGrAjejLjup9fRgffjkzMsWkxvxujygl",
});


exports.addResume = async(req,res)=>{
    try{
        const{ job_desc, user} = req.body
        const pdfBuffer= req.file.buffer || null;
        const pdfPath = req.file.path;
        const fs=require('fs');
        const dataBuffer =fs.readFileSync(pdfPath);
        const pdfData = await pdfParse(dataBuffer);
       const response = await cohere.chat({
                    model: "command-a-03-2025",
                    message: `
                You are a resume screening assistant.

                Return the score and a brief explanation in this format:
                score: XX
                Reason: .....

                Resume:
                ${pdfData.text}

                Job Description:
                ${job_desc}

                `,
                    temperature: 0.3,
                });
        let result = response.text;
        //console.log(result);
         const match = result.match(/score:\s*(\d+)/i);
         const score = match ? parseInt(match[1],10): null;

         const reasonMatch = result.match(/Reason:\s*([\s\S]*)/);
         const reason = reasonMatch ? reasonMatch[1].trim() : null;
                
         const newResume = new ResumeModel({
            user,
            resume_name: req.file.originalname,
            job_desc,
            score,
            feedback: reason
         })

         await newResume.save();
         fs.unlinkSync(pdfPath); //remove temp file
         res.status(200).json({ message: "your analysys are ready", data: newResume });
       
         
         


    }catch(error){
        console.log(error)
        res.status(500).json({ error: 'Server Error', message: error.message})
    }
}
exports.getAllResumesForUser = async (req, res) => {
        try{
            const { user } = req.params;
            let resumes = await ResumeModel.find({ user: user }).sort({createdAt: -1});
            return res.status(200).json({message: 'your previous history', resume: resumes});
        }
        
        catch(error){
            console.log(error)
            res.status(500).json({ error: 'Server Error', message: error.message})
        }

}
exports.getAllResumeForAdmin = async (req, res) =>{
    try{
        let resumes = await ResumeModel.find({}).sort({createdAt: -1}).populate('user');
        return res.status(200).json({message: 'All resume here', resume: resumes});
    }catch(error){
        console.log(error)
        res.status(500).json({ error: 'Server Error', message: error.message})
    }
}