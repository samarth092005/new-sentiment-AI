import React, { useCallback, useState } from 'react';
import {
  UploadCloud,
  File,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export default function CsvUploader({ onUpload, isLoading }) {

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_REVIEWS = 1000;

  // ── Drag handlers ───────────────────────────────────────────────────────
  const handleDrag = useCallback((e) => {

    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }

  }, []);

  // ── CSV Parser ──────────────────────────────────────────────────────────
  const parseCsv = (text) => {

    const lines = text.split('\n');

    if (lines.length < 2) {
      throw new Error('CSV must contain at least one review.');
    }

    const reviews = [];

    // Detect header row
    const header = lines[0].toLowerCase();

    let startIndex = 0;

    if (
      header.includes('review') ||
      header.includes('feedback') ||
      header.includes('comment') ||
      header.includes('text')
    ) {
      startIndex = 1;
    }

    for (let i = startIndex; i < lines.length; i++) {

      let line = lines[i].trim();

      if (!line) continue;

      // Remove wrapping quotes safely
      if (line.startsWith('"') && line.endsWith('"')) {
        line = line.slice(1, -1);
      }

      // Basic CSV split
      const cols = line.split(',');

      let reviewText = '';

      for (const col of cols) {

        if (col.trim().length > 5) {
          reviewText = col.trim();
          break;
        }

      }

      if (reviewText) {
        reviews.push(reviewText);
      }

    }

    // Remove duplicate reviews
    const uniqueReviews = [...new Set(reviews)];

    // Validate actual review-like content
    const validReviewCount = uniqueReviews.filter(
      review =>
        typeof review === 'string' &&
        review.trim().split(' ').length >= 3 &&
        /[a-zA-Z]/.test(review)
    ).length;

    if (validReviewCount < 5) {
      throw new Error(
        'CSV does not appear to contain valid customer feedback data.'
      );
    }

    if (uniqueReviews.length === 0) {
      throw new Error('No valid reviews found in CSV.');
    }

    if (uniqueReviews.length > MAX_REVIEWS) {
      throw new Error(
        `Maximum ${MAX_REVIEWS} reviews allowed per upload.`
      );
    }

    return uniqueReviews;
  };

  // ── File validation ─────────────────────────────────────────────────────
  const validateFile = (selectedFile) => {

    if (
      selectedFile.type !== 'text/csv' &&
      !selectedFile.name.toLowerCase().endsWith('.csv')
    ) {
      throw new Error('Only CSV files are allowed.');
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      throw new Error('CSV file exceeds 5MB upload limit.');
    }

  };

  // ── Process file ────────────────────────────────────────────────────────
  const processFile = (fileToProcess) => {

    const reader = new FileReader();

    reader.onload = (event) => {

      try {

        const text = event.target.result;

        const parsedReviews = parseCsv(text);

        onUpload(parsedReviews);

        // Set file ONLY after successful processing
        setFile(fileToProcess);

      } catch (err) {

        setError(
          err.message || 'CSV parsing failed.'
        );

      }

    };

    reader.onerror = () => {
      setError('Failed to read CSV file.');
    };

    reader.readAsText(fileToProcess);

  };

  // ── Drag & Drop Upload ──────────────────────────────────────────────────
  const handleDrop = useCallback((e) => {

    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {

      try {

        const droppedFile = e.dataTransfer.files[0];

        validateFile(droppedFile);

        processFile(droppedFile);

      } catch (err) {

        setError(err.message);

      }

    }

  }, []);

  // ── Manual Upload ───────────────────────────────────────────────────────
  const handleChange = (e) => {

    e.preventDefault();

    setError(null);

    if (e.target.files && e.target.files[0]) {

      try {

        const selectedFile = e.target.files[0];

        validateFile(selectedFile);

        processFile(selectedFile);

      } catch (err) {

        setError(err.message);

      }

    }

  };

  // ── Clear uploaded file ─────────────────────────────────────────────────
  const clearFile = () => {

    setFile(null);
    setError(null);

  };

  return (

    <div className="w-full">

      {!file ? (

        <div
          className={`relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-2xl transition-all ${dragActive
              ? 'border-blue-500 bg-blue-50 glow'
              : 'border-slate-300 bg-white/50 hover:bg-slate-50 hover:border-blue-400'
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

          <UploadCloud
            className={`w-12 h-12 mb-4 ${dragActive
                ? 'text-blue-600'
                : 'text-slate-400'
              }`}
          />

          <h3 className="text-lg font-semibold text-slate-700 mb-1">
            Upload CSV for Bulk Analysis
          </h3>

          <p className="text-sm text-slate-500 text-center">
            Drag & drop your CSV file here or click to browse
          </p>

          <div className="mt-4 text-xs text-slate-400 text-center space-y-1">
            <p>• Maximum file size: 5MB</p>
            <p>• Maximum 1000 reviews per upload</p>
            <p>• Supported columns: review, feedback, comment, text</p>
          </div>

          {error && (

            <div className="mt-5 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 w-full">

              <AlertCircle
                size={16}
                className="text-red-500 mt-0.5 flex-shrink-0"
              />

              <p className="text-sm text-red-600">
                {error}
              </p>

            </div>

          )}

        </div>

      ) : (

        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl">

          <div className="flex items-center gap-3">

            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <File size={24} />
            </div>

            <div>

              <p className="text-sm font-semibold text-slate-700">
                {file.name}
              </p>

              <p className="text-xs text-slate-500">
                {(file.size / 1024).toFixed(1)} KB
              </p>

            </div>

          </div>

          <div className="flex items-center gap-2">

            {isLoading && (
              <Loader2 className="animate-spin text-blue-600 mr-2" />
            )}

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