import React, { useEffect, useState } from "react";
import MorphingText from "../components/ui/morphing-text";
import { Link } from "react-router-dom";
import ShimmerButton from "@/components/ui/shimmer-button";
import axios from "axios";

const texts = ["Edit File", "Edit picture", "Your Text", "Document"];
const btn = [
  { label: "Remove bg", type: "bg-black", link: "/bg-remove" },
  { label: "Doc Into Pdf", type: "bg-blue-500", link: "/doc-pdf" },
  { label: "Resize Image", type: "bg-yellow-500", link: "/image-resize" },
  { label: "Enhance Image", type: "bg-red-500", link: "/image-enhancer" },
  { label: "Generate QR", type: "bg-purple-500", link: "/qr" },
  { label: "PDF INTO DOC", type: "bg-purple-500", link: "/pdf-doc" },
];

const Home = () => {
  const [message, setMessage] = useState("hii");

  const backendCheck = async () => {
    try {
      const response = await axios.get(
        "https://utilitytool-backend.onrender.com/api/greet"
      );
      setMessage(response.data);
    } catch (error) {
      setMessage("Sorry! Backend is not working properly");
    }
  };

  useEffect(() => {
    backendCheck();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#0984e3] text-white flex flex-col  justify-center px-4">
      <div>{message}</div>
      {/* Header Section */}
      <div className=" mb-10 align-text-top ">
        <MorphingText texts={texts} />
        <span className="block text-black text-lg mt-4  ml-80 justify-center items-center">
          Your Own Tools
        </span>
      </div>

      {/* Buttons Section */}
      <div className="flex flex-wrap justify-center gap-4 w-full max-w-4xl">
        {btn.map((item, index) => (
          <Link to={item.link} key={index}>
            <ShimmerButton
              className={`shadow-2xl h-12 px-6 ${item.type} hover:opacity-90`}
            >
              <span className="whitespace-nowrap text-center text-sm font-medium leading-none tracking-tight text-white lg:text-lg">
                {item.label}
              </span>
            </ShimmerButton>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
