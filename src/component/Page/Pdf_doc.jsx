import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Button, Spin } from "antd";
import { motion } from "framer-motion";

const Pdf_doc = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [docxUrl, setDocxUrl] = useState(null);

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setError(null); // Clear previous errors
    setDocxUrl(null); // Reset download link for new uploads
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".pdf",
  });

  const handleUpload = async () => {
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(
          "https://utilitytool-backend.onrender.com/pdfconverter/pdfdoc",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            responseType: "blob", // Treat the response as a binary file (DOCX)
          }
        );

        // Create a URL for the DOCX blob
        const docxBlob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        const docxUrl = URL.createObjectURL(docxBlob);

        setDocxUrl(docxUrl); // Set the URL to allow download
      } catch (error) {
        setError("Error during file upload or conversion");
        console.error("Upload or conversion error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDownload = () => {
    if (docxUrl) {
      const link = document.createElement("a");
      link.href = docxUrl;
      link.download = "converted_file.docx";
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
            Drag & drop a PDF file here, or click to select one
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
          {loading ? <Spin size="small" /> : "Convert to DOCX"}
        </motion.button>

        {error && <p className="mt-4 text-red-500">{error}</p>}

        {docxUrl && (
          <motion.div
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Button onClick={handleDownload} type="dashed">
              Download DOCX
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Pdf_doc;