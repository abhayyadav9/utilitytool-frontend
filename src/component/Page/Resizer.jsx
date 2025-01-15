import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Button } from 'antd';

const Resizer = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resizedImage, setResizedImage] = useState(null);
  const [resizedImageSize, setResizedImageSize] = useState(null); // Track resized image size
  const [size, setSize] = useState(null);

  // Convert file size to a human-readable format
  const humanFileSize = (size) => {
    const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return `${(size / Math.pow(1024, i)).toFixed(2)} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
  };

  // On file drop or selection
  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setSize(selectedFile.size);
    setResizedImage(null);  // Reset resized image
    setResizedImageSize(null); // Reset resized image size
    setError(null);         // Reset error state
  };

  // Use dropzone hook
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/jpeg,image/png", // Only accept JPEG or PNG files
  });

  // Handle image upload
  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setLoading(true);
      setError(null);

      try {
        // Sending POST request to Flask backend
        const response = await axios.post(
          "https://utilitytool-backend.onrender.com/resize", // Adjust URL as needed
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            responseType: "blob",  // Expect a blob response (image)
          }
        );
        // Create a blob from the response and display the resized image
        const resizedImageBlob = new Blob([response.data], { type: "image/png" });
        const url = URL.createObjectURL(resizedImageBlob);
        setResizedImage(url);  // Set resized image URL for preview and download
        setResizedImageSize(resizedImageBlob.size); // Track the size of the resized image
      } catch (error) {
        console.log(error);
        setError("Error in uploading image");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6 bg-secondary p-4">
      <h1 className="text-2xl font-semibold">Image Resizer</h1>

      <div 
        {...getRootProps()} 
        className="border-4 border-dashed border-gray-400 p-8 rounded-lg shadow-lg w-full max-w-lg text-center"
      >
        <input type="file" {...getInputProps()} className="hidden" />
        <p className="text-gray-600">Drag & drop an image file here, or click to select one</p>
      </div>

      {file && (
        <p className="text-gray-700 mt-2">
          Selected File: {file.name} ({humanFileSize(size)})
        </p>
      )}
      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={handleUpload}
        className="w-full max-w-xs bg-primary text-white py-2 rounded-md shadow-md hover:bg-primary-dark"
      >
        {loading ? "Uploading..." : "Enhance Image"}
      </button>

      {resizedImage && (
        <>
          <div className="mt-4">
            <img src={resizedImage} alt="Resized" className="max-w-xs rounded-lg h-44 w-44" />
            <p className="text-gray-700 mt-2">
              Resized Image Size: {humanFileSize(resizedImageSize)}
            </p>
            <Button className="mt-4 bg-green-700 text-white hover:bg-green-800">
              <a
                href={resizedImage}
                download="resized_image.png"
                className="text-blue-600 hover:text-blue-800"
              >
                Download Resized Image
              </a>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Resizer;
