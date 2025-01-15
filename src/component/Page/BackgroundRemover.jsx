import React, { useState } from 'react';
import axios from 'axios';

const BackgroundRemover = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [outputImage, setOutputImage] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleRemoveBackground = async () => {
    if (!file) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://127.0.0.1:5000/remove-background', formData, {
        responseType: 'blob',
      });

      const url = URL.createObjectURL(response.data);
      setOutputImage(url);
    } catch (error) {
      console.error("Error:", error);
      alert("Error removing background.");
    }

    setLoading(false);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = outputImage;
    link.download = 'image_without_bg.png';
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 to-pink-600 p-8">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center text-purple-700 mb-6">Remove Image Background</h1>

        {/* File Input */}
        <div className="mb-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Button to Remove Background */}
        <button
          onClick={handleRemoveBackground}
          disabled={loading}
          className="w-full bg-purple-600 text-white p-3 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-400"
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <svg
                className="animate-spin h-5 w-5 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="none"
                  strokeWidth="4"
                  d="M4 12a8 8 0 018-8V4a10 10 0 00-10 10h2z"
                ></path>
              </svg>
              Removing background...
            </div>
          ) : (
            'Remove Background'
          )}
        </button>

        {/* Loading Skeleton */}
        {loading && !outputImage && (
          <div className="animate-pulse mt-6">
            <div className="h-48 bg-gray-300 rounded-lg w-full mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-2/3 mb-2"></div>
          </div>
        )}

        {/* Image Display and Download */}
        {outputImage && (
          <>
            <h2 className="text-2xl font-semibold text-purple-700 mt-6">Result:</h2>
            <div className="mt-4">
              <img src={outputImage} alt="No background" className="max-w-full h-auto rounded-lg shadow-md" />
              <button
                onClick={handleDownload}
                className="mt-4 bg-green-500 text-white p-3 rounded-lg w-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Download Image
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BackgroundRemover;
