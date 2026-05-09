import React, { useCallback, useState } from 'react';
import { UploadCloud, File, X, Loader2 } from 'lucide-react';

export default function CsvUploader({ onUpload, isLoading }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const parseCsv = (text) => {
    // Very simple CSV parser assuming commas and basic quotes
    const lines = text.split('\n');
    if (lines.length < 2) return [];
    
    // Assume first row might be header, but let's just grab all rows and filter out short ones
    const reviews = [];
    // Skip header if we think it's a header (e.g. contains "review" or "text")
    let startIndex = 0;
    if (lines[0].toLowerCase().includes('review') || lines[0].toLowerCase().includes('text')) {
      startIndex = 1;
    }

    for (let i = startIndex; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line) continue;
      
      // If the line is quoted, extract the content inside the quote, else just take the first column
      if (line.startsWith('"')) {
        const endIndex = line.indexOf('"', 1);
        if (endIndex !== -1) {
          reviews.push(line.substring(1, endIndex));
          continue;
        }
      }
      
      // Fallback: split by comma and take first valid string
      const cols = line.split(',');
      if (cols.length > 0 && cols[0].trim().length > 3) {
        reviews.push(cols[0].trim());
      } else if (cols.length > 1 && cols[1].trim().length > 3) {
         reviews.push(cols[1].trim());
      }
    }
    return reviews;
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type !== "text/csv" && !droppedFile.name.endsWith('.csv')) {
        setError("Please upload a valid CSV file.");
        return;
      }
      setFile(droppedFile);
      processFile(droppedFile);
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith('.csv')) {
        setError("Please upload a valid CSV file.");
        return;
      }
      setFile(selectedFile);
      processFile(selectedFile);
    }
  };

  const processFile = (fileToProcess) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const parsedReviews = parseCsv(text);
      if (parsedReviews.length === 0) {
        setError("Could not extract any reviews from the CSV. Make sure it's formatted correctly.");
        return;
      }
      onUpload(parsedReviews);
    };
    reader.onerror = () => {
      setError("Failed to read file.");
    };
    reader.readAsText(fileToProcess);
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
  };

  return (
    <div className="w-full">
      {!file ? (
        <div 
          className={`relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-2xl transition-all ${
            dragActive ? 'border-blue-500 bg-blue-50 glow' : 'border-slate-300 bg-white/50 hover:bg-slate-50 hover:border-blue-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            accept=".csv"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <UploadCloud className={`w-12 h-12 mb-4 ${dragActive ? 'text-blue-600' : 'text-slate-400'}`} />
          <h3 className="text-lg font-semibold text-slate-700 mb-1">Upload CSV for Bulk Analysis</h3>
          <p className="text-sm text-slate-500">Drag & drop your CSV file here or click to browse</p>
          <p className="text-xs text-slate-400 mt-4">Make sure reviews are in the first column.</p>
          
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <File size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isLoading && <Loader2 className="animate-spin text-blue-600 mr-2" />}
            <button 
              onClick={clearFile}
              disabled={isLoading}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
