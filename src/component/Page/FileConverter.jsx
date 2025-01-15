import React, { useState } from "react";
import axios from "axios";

const FileConverter = () => {
  const [file, setFile] = useState(null);
  const [convertedFileUrl, setConvertedFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setConvertedFileUrl(null);
    setError("");
  };

  const handleConvert = async (type) => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    const isDocx = type === "docx-to-pdf" && file.name.endsWith(".docx");
    const isPdf = type === "pdf-to-docx" && file.name.endsWith(".pdf");

    if (!isDocx && !isPdf) {
      setError("Invalid file type for the selected conversion.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `https://utilitytool-backend.onrender.com/convert/${type}`,
        formData,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setConvertedFileUrl(url);
    } catch (err) {
      setError("An error occurred during conversion. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
          File Converter
        </h1>

        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
        />

        {error && (
          <div className="text-red-500 text-sm text-center mb-4">{error}</div>
        )}

        <div className="flex justify-between">
          <button
            onClick={() => handleConvert("docx-to-pdf")}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-600 disabled:bg-gray-400"
            disabled={!file || loading}
          >
            Convert DOCX to PDF
          </button>
          <button
            onClick={() => handleConvert("pdf-to-docx")}
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 disabled:bg-gray-400"
            disabled={!file || loading}
          >
            Convert PDF to DOCX
          </button>
        </div>

        {loading && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {convertedFileUrl && (
          <div className="mt-4 text-center">
            <a
              href={convertedFileUrl}
              download={`converted-${file.name}`}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
            >
              Download Converted File
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileConverter;


// import React, { useState } from "react";
// import axios from "axios";

// const FileConverter = () => {
//   const [file, setFile] = useState(null);
//   const [fileUrl, setFileUrl] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     setFileUrl(null);
//     setError("");
//   };

//   const handleSimulateConversion = async () => {
//     if (!file) {
//       setError("Please select a file first.");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       // Simulate a "conversion" by sending the file to the server and returning it as-is
//       const formData = new FormData();
//       formData.append("file", file);

//       const response = await axios.post(
//         `https://utilitytool-backend.onrender.com/convert/simulate`, // Replace with the correct endpoint
//         formData,
//         { responseType: "blob" }
//       );

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       setFileUrl(url);
//     } catch (err) {
//       setError("An error occurred while handling the file. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
//       <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
//         <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
//           File Handler
//         </h1>

//         <input
//           type="file"
//           onChange={handleFileChange}
//           className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
//         />

//         {error && (
//           <div className="text-red-500 text-sm text-center mb-4">{error}</div>
//         )}

//         <div className="flex justify-center">
//           <button
//             onClick={handleSimulateConversion}
//             className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-600 disabled:bg-gray-400"
//             disabled={!file || loading}
//           >
//             Simulate Handling
//           </button>
//         </div>

//         {loading && (
//           <div className="flex justify-center mt-4">
//             <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
//           </div>
//         )}

//         {fileUrl && (
//           <div className="mt-4 text-center">
//             <a
//               href={fileUrl}
//               download={file.name}
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
//             >
//               Download File
//             </a>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FileConverter;
