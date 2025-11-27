import * as exifr from 'exifr';
import { PDFDocument } from 'pdf-lib';

export const extractMetadata = async (file: File): Promise<any> => {
  const fileType = file.type;

  try {
    // Handle images
    if (fileType.startsWith('image/')) {
      const metadata = await exifr.parse(file, { 
        tiff: true,
        exif: true,
        gps: true,
        iptc: true,
        icc: true,
        xmp: true
      });

      if (!metadata || Object.keys(metadata).length === 0) {
        return { message: 'No EXIF data found in this image' };
      }

      return metadata;
    }

    // Handle PDFs
    if (fileType === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      const metadata: any = {};
      
      const title = pdfDoc.getTitle();
      const author = pdfDoc.getAuthor();
      const subject = pdfDoc.getSubject();
      const creator = pdfDoc.getCreator();
      const producer = pdfDoc.getProducer();
      const creationDate = pdfDoc.getCreationDate();
      const modificationDate = pdfDoc.getModificationDate();

      if (title) metadata.Title = title;
      if (author) metadata.Author = author;
      if (subject) metadata.Subject = subject;
      if (creator) metadata.Creator = creator;
      if (producer) metadata.Producer = producer;
      if (creationDate) metadata['Creation Date'] = creationDate.toISOString();
      if (modificationDate) metadata['Modification Date'] = modificationDate.toISOString();

      metadata['Number of Pages'] = pdfDoc.getPageCount();

      if (Object.keys(metadata).length === 0) {
        return { message: 'No metadata found in this PDF' };
      }

      return metadata;
    }

    // For DOCX and XLSX, we can't easily extract metadata in the browser
    // without additional complex libraries, so we'll return a message
    if (fileType.includes('wordprocessingml') || fileType.includes('spreadsheetml')) {
      return { 
        message: 'Metadata extraction for Office documents is limited in browser',
        fileType: fileType
      };
    }

    return { error: 'Unsupported file type for metadata extraction' };
  } catch (error) {
    console.error('Error extracting metadata:', error);
    return { error: 'Failed to extract metadata from this file' };
  }
};

export const removeMetadata = async (file: File): Promise<File> => {
  const fileType = file.type;

  try {
    // Handle images
    if (fileType.startsWith('image/')) {
      // For images, we'll create a new canvas, draw the image, and export without metadata
      return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);

          canvas.toBlob((blob) => {
            if (blob) {
              const cleanedFile = new File([blob], file.name, { type: fileType });
              resolve(cleanedFile);
            } else {
              reject(new Error('Failed to create cleaned image'));
            }
          }, fileType);
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
      });
    }

    // Handle PDFs
    if (fileType === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Remove all metadata
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setCreator('');
      pdfDoc.setProducer('');
      pdfDoc.setKeywords([]);

      const pdfBytes = await pdfDoc.save();
      const outputBuffer = new ArrayBuffer(pdfBytes.length);
      const view = new Uint8Array(outputBuffer);
      view.set(pdfBytes);
      const blob = new Blob([outputBuffer], { type: 'application/pdf' });
      return new File([blob], file.name, { type: 'application/pdf' });
    }

    // For other file types, return the original file
    // (We can't easily strip metadata from DOCX/XLSX in browser)
    return file;
  } catch (error) {
    console.error('Error removing metadata:', error);
    throw error;
  }
};
