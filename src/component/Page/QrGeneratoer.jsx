import React, { useState } from 'react';
import axios from 'axios';

const QrGenerator = () => {
  const [image, setImage] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [qrType, setQrType] = useState('text');  // Default to 'text'
  const [qrContent, setQrContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleGenerateQr = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('type', qrType);  // Send the selected type

    if (qrType === 'image' && image) {
      formData.append('image', image);
    } else if ((qrType === 'text' || qrType === 'link') && qrContent) {
      formData.append('content', qrContent);
    } else {
      alert("Please provide the necessary data.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("https://utilitytool-backend.onrender.com/generate-qr", formData, {
        responseType: "blob",
      });

      const qrUrl = URL.createObjectURL(response.data);
      setQrCode(qrUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
      alert("Failed to generate QR code.");
    }
    setLoading(false);
  };

  const handleDownloadQr = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = 'qr-code.png';
    link.click();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-400">
      <div className="bg-blue-500 p-8 rounded-lg shadow-lg w-full  max-w-md animate__animated animate__fadeIn">
        <h1 className="text-2xl font-bold mb-4 text-center">QR Code Generator</h1>

        {/* QR Type Selection */}
        <label className="block mb-2 text-sm font-medium text-gray-700">Select QR Code Type:</label>
        <select
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          value={qrType}
          onChange={(e) => setQrType(e.target.value)}
        >
          <option value="text">Text</option>
          <option value="link">Link</option>
          <option value="image">Image</option>
        </select>

        {/* Input fields for QR code content */}
        {qrType === 'image' ? (
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          />
        ) : (
          <input
            type="text"
            placeholder={qrType === 'link' ? "Enter URL" : "Enter Text"}
            value={qrContent}
            onChange={(e) => setQrContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          />
        )}

        {/* Generate QR Code Button */}
        <button
          onClick={handleGenerateQr}
          disabled={loading}
          className={`w-full p-3 bg-blue-600 text-white rounded-lg mb-4 ${loading && "opacity-50"}`}
        >
          {loading ? "Generating..." : "Generate QR Code"}
        </button>

        {/* Display Generated QR Code */}
     <div>
     {qrCode && (
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Generated QR Code:</h3>
            <img
              src={qrCode}
              alt="QR Code"
              className="mx-auto mb-4 w-80 h-80"
            />
            {/* Download Button */}
            <button
              onClick={handleDownloadQr}
              className="w-full p-3 bg-green-600 text-white rounded-lg"
            >
              Download QR Code
            </button>
          </div>
        )}
     </div>
      </div>
    </div>
  );
};

export default QrGenerator;
