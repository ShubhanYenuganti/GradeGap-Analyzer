const { createCanvas } = require('canvas');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function prepareFileBuffer(fileUrl, mimetype) {
  const fileBuffer = await fetch(fileUrl).then(res => res.arrayBuffer());
  const buffer = Buffer.from(fileBuffer);

  if (mimetype === 'application/pdf') {
    console.log('📄 Processing PDF purely in Node.js...');
    
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

    const pdfDoc = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
    const pageBuffers = [];

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = createCanvas(viewport.width, viewport.height);
      const context = canvas.getContext('2d');

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      await page.render(renderContext).promise;

      const pageBuffer = canvas.toBuffer('image/png');
      pageBuffers.push(pageBuffer);
    }

    console.log(`✅ Converted PDF into ${pageBuffers.length} images!`);
    return { pageBuffers, cleanMimetype: 'image/png' }; // <-- Always an array
  } 
  else if (mimetype.startsWith('image/')) {
    console.log('🖼️ Received image directly.');
    return { pageBuffers: [buffer], cleanMimetype: 'image/png' }; // <-- Always an array
  }
  
  // 🛡️ Default safeguard:
  console.error('❌ Unsupported mimetype:', mimetype);
  return { pageBuffers: [], cleanMimetype: 'image/png' };
}

module.exports = { prepareFileBuffer };
