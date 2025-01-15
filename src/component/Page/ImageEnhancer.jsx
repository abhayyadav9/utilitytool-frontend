import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Button, Spin } from "antd";
import { motion } from "framer-motion";

const ImageEnhancer = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [enhancedImageUrl, setEnhancedImageUrl] = useState(null);

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setError(null); // Clear previous errors
    setEnhancedImageUrl(null); // Reset download link for new uploads
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png",
  });

  const handleUpload = async () => {
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(
          "https://utilitytool-backend.onrender.com/enhance",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            responseType: "blob", // Treat the response as a binary file
          }
        );

        // Create a URL for the enhanced image blob
        const enhancedImageBlob = new Blob([response.data], { type: "image/png" });
        const enhancedImageUrl = URL.createObjectURL(enhancedImageBlob);

        setEnhancedImageUrl(enhancedImageUrl); // Set the URL to allow download
      } catch (error) {
        setError("Error during file upload or enhancement");
        console.error("Upload or enhancement error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDownload = () => {
    if (enhancedImageUrl) {
      const link = document.createElement("a");
      link.href = enhancedImageUrl;
      link.download = "enhanced_image.png";
      link.click();
    }
  };

  return (
    <div className="bg-gradient-to-r from-green-400 to-blue-500 h-screen w-full flex items-center justify-center">
      <motion.div
        className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 p-8 text-center cursor-pointer hover:border-green-500 transition"
          whileHover={{ scale: 1.05 }}
        >
          <input {...getInputProps()} />
          <p className="text-gray-500 text-lg">
            Drag & drop an image file here, or click to select one
          </p>
        </motion.div>

        {file && <p className="mt-4 text-gray-700">Selected File: {file.name}</p>}

        <motion.button
          onClick={handleUpload}
          disabled={loading || !file}
          className={`mt-4 px-6 py-2 rounded-full text-white ${
            loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-700"
          } transition`}
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
        >
          {loading ? <Spin size="small" /> : "Enhance Image"}
        </motion.button>

        {error && <p className="mt-4 text-red-500">{error}</p>}

        {enhancedImageUrl && (
          <motion.div
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Button onClick={handleDownload} type="dashed">
              Download Enhanced Image
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ImageEnhancer;