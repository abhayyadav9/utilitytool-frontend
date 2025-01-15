import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Button, Spin } from "antd";

const Doc_pdf = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".docx",
  });

  const handleUpload = async () => {
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(
          "https://utilitytool-backend.onrender.com/converter/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            responseType: "blob", // Make sure the response is treated as a binary file (PDF)
          }
        );

        // Create a URL for the PDF blob
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Set the URL to the state so that the user can download it later
        setPdfUrl(pdfUrl);
      } catch (error) {
        setError("Error during file upload or conversion");
        console.error("Error during file upload:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      // Create a link to download the PDF
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "converted_file.pdf"; // Default file name for download
      link.click(); // Trigger the download
    }
  };

  return (
    <div className="bg-cyan-400 h-screen w-full flex items-center justify-center">
      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 p-8 text-center cursor-pointer hover:border-blue-500 transition"
        >
          <input {...getInputProps()} />
          <p className="text-gray-500 text-lg">
            Drag & drop a DOCX file here, or click to select one
          </p>
        </div>

        {file && <p className="mt-4 text-gray-700">Selected File: {file.name}</p>}

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className={`mt-4 px-6 py-2 rounded-full text-white ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"
          } transition`}
        >
          {loading ? <Spin size="small" /> : "Convert to PDF"}
        </button>

        {error && <p className="mt-4 text-red-500">{error}</p>}

        {pdfUrl && (
          <div className="mt-4">
            <Button onClick={handleDownload} type="dashed">
              Download PDF
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doc_pdf;
