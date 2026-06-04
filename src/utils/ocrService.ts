import Tesseract from 'tesseract.js';

export const ocrService = {
  extractText: async (imageSource: string | HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | File): Promise<string> => {
    try {
      const result = await Tesseract.recognize(imageSource, 'eng', {
        logger: m => console.log(m),
      });
      return result.data.text;
    } catch (error) {
      console.error("OCR Error:", error);
      throw new Error("Failed to extract text from image");
    }
  }
};
