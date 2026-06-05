import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, ScanLine, Info } from 'lucide-react';
import { ocrService } from '../utils/ocrService';
import { analyzeIngredients, type AnalysisResult } from '../utils/analysisEngine';
import { apiService, getDeviceId } from '../utils/apiService';
import { useAppContext } from '../context/AppProvider';
import { ResultsDashboard } from './ResultsDashboard';

const DEMO_IMAGES = [
  { label: 'Gluten Cereal', text: 'whole grain wheat, barley, malt extract, sugar, salt' },
  { label: 'Nut Bar', text: 'almonds, dark chocolate, soy lecithin, natural peanut flavor' },
  { label: 'Safe Chips', text: 'organic potatoes, avocado oil, sea salt' },
  { label: 'Tainted Maize', text: 'maize flour, water, high humidity, mould detected, salt' }
];

export const ScannerView: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { activeAllergens, customAllergens, addScanToHistory } = useAppContext();

  // Start Camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsScanning(true);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not access camera. Please allow permissions or use file upload.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stream]); // Added stream to dependency array to ensure cleanup uses current stream

  // Process Text
  const handleTextExtracted = async (text: string) => {
    setIsProcessing(false);
    stopCamera();
    
    // Analyze
    const analysis = analyzeIngredients(text, activeAllergens, customAllergens);
    setResult(analysis);
    
    // Add to history
    addScanToHistory({
      timestamp: new Date().toISOString(),
      productName: text.substring(0, 20) + '...',
      verdict: analysis.verdict,
      prideTriggered: analysis.prideLoopTriggered,
      triggers: analysis.matchedAllergens.map(m => m.triggerWord)
    });

    // Log to n8n
    apiService.logScan({
      timestamp: new Date().toISOString(),
      verdict: analysis.verdict,
      extractedText: text,
      matchedAllergens: analysis.matchedAllergens.map(m => m.triggerWord),
      prideLoopTriggered: analysis.prideLoopTriggered,
      metadata: {
        deviceId: getDeviceId(),
        clientVersion: '1.0.0'
      }
    });
  };

  const handleCapture = async () => {
    if (!videoRef.current) return;
    setIsProcessing(true);
    
    // Draw video frame to canvas
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      try {
        const text = await ocrService.extractText(canvas);
        await handleTextExtracted(text);
      } catch (err) {
        setIsProcessing(false);
        setError('Failed to extract text from image.');
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsProcessing(true);
    try {
      const text = await ocrService.extractText(file);
      await handleTextExtracted(text);
    } catch (err) {
      setIsProcessing(false);
      setError('Failed to extract text from file.');
    }
  };

  const runDemo = async (demoText: string) => {
    setIsProcessing(true);
    // Simulate slight OCR delay for effect
    setTimeout(() => {
      handleTextExtracted(demoText);
    }, 1500);
  };

  if (result) {
    return <ResultsDashboard result={result} onReset={() => setResult(null)} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Label Scanner</h2>
        <p className="text-gray-400 mt-2">Scan ingredients to check against your allergen profile.</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/20 border border-rose-500/50 rounded-xl text-rose-300 text-center mb-4">
          {error}
        </div>
      )}

      {/* Main Scanner Area */}
      <div className="relative mx-auto max-w-md aspect-[3/4] bg-gray-900 rounded-3xl overflow-hidden border-2 border-gray-800 shadow-2xl flex flex-col items-center justify-center">
        
        {isScanning && !isProcessing && (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {isScanning && !isProcessing && (
          <div className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-center">
            {/* Bounding box */}
            <div className="w-64 h-64 border-2 border-emerald-500/50 rounded-2xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl -mt-1 -ml-1"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl -mt-1 -mr-1"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl -mb-1 -ml-1"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-xl -mb-1 -mr-1"></div>
            </div>
            <p className="text-white mt-4 font-medium bg-black/50 px-4 py-1 rounded-full backdrop-blur-md">Align text within box</p>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <ScanLine className="w-16 h-16 text-emerald-400 animate-pulse mb-4" />
            <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-full bg-emerald-400 animate-scan-laser shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
            </div>
            <p className="text-emerald-400 mt-4 font-bold tracking-widest uppercase">Analyzing...</p>
          </div>
        )}

        {!isScanning && !isProcessing && (
          <div className="flex flex-col items-center justify-center text-gray-500 p-8 text-center z-10">
            <Camera className="w-20 h-20 mb-4 opacity-50" />
            <p className="mb-6 text-lg">Activate camera to scan ingredient labels</p>
            <button 
              onClick={startCamera}
              className="glass-button w-full py-4 rounded-xl text-emerald-400 font-bold text-lg shadow-lg hover:shadow-emerald-500/20 transition-all"
            >
              Start Camera
            </button>
          </div>
        )}

        {/* Capture Button Overlay */}
        {isScanning && !isProcessing && (
          <div className="absolute bottom-6 left-0 w-full flex justify-center z-20">
            <button 
              onClick={handleCapture}
              className="w-20 h-20 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full border-4 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center"
            >
              <div className="w-14 h-14 bg-white rounded-full" />
            </button>
          </div>
        )}
      </div>

      {/* Fallback & Demos */}
      {!isScanning && !isProcessing && (
        <div className="max-w-md mx-auto space-y-4">
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full glass-button py-3 rounded-xl text-gray-300 font-medium flex items-center justify-center"
          >
            <Upload className="w-5 h-5 mr-2" /> Upload Image
          </button>

          <div className="pt-6 border-t border-gray-800/50">
            <div className="flex items-center space-x-2 mb-4 text-cyan-400">
              <Info className="w-5 h-5" />
              <h4 className="font-semibold">Try Demo Scans</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {DEMO_IMAGES.map((demo, idx) => (
                <button
                  key={idx}
                  onClick={() => runDemo(demo.text)}
                  className="glass-button py-3 px-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white truncate"
                >
                  {demo.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
