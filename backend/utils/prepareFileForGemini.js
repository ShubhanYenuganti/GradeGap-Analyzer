const sharp = require('sharp')
const pdf = require('pdf-parse')
const {promises: fs} = require('fs')

async function prepareFileBuffer(fileUrl, mimetype) {
    const fileBuffer = await fetch(fileUrl).then(res => res.arrayBuffer());
    const buffer = Buffer.from(fileBuffer)
    
    if (mimetype == 'application/pdf') {
        // Pdf Input
        const pdfData = await pdf(buffer)

        const pages = pdfData.numpages || 1; // fallback to 1 if not available
        const textLength = pdfData.text.trim().length;
        // Dynamic threshold: e.g., 50 characters minimum per page
        const dynamicThreshold = pages * 50;
        
        
        if (textLength > dynamicThreshold) {
            // If it detects more than 100 actual characters, its a legit text-PDF
            // If not then it will be interpreted as an image scanned as a PDF
            console.log('Good text-based PDF detected')
            return { buffer, cleanMimeType: 'application/pdf'}
        } else {
            console.log('Weak PDF detected, treating as scanned image')
            // For now may further optimize later but send to gemini as a pdf
            return {buffer, cleanMimeType: 'application/pdf'}
        }
    }
    else if (mimetype.startsWith('image/')) {
        // Image input
        const preprocessed = await preprocessImage(buffer);
        return {buffer: preprocessed, cleanMimeType: 'image/png'}
    }
}

async function preprocessImage(buffer) {
    return await sharp(buffer)
        .resize({ width: 1600 })
        .grayscale()
        .normalize()
        .sharpen({ sigma: 1 })
        .threshold(180)
        .toFormat('png')
        .toBuffer();
}

module.exports = { prepareFileBuffer }