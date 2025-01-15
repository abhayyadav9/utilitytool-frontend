import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three"; // Required for Vanta.js
import NET from "vanta/dist/vanta.net.min"; // Vanta NET effect

const Background = () => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    // Initialize Vanta effect only once
    if (!vantaEffect) {
      const effect = NET({
        el: vantaRef.current, // Target element for the Vanta effect
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        backgroundColor: 0x4449,
      });
      setVantaEffect(effect);
    }

    // Cleanup Vanta effect when component unmounts
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div
      ref={vantaRef}
      style={{
        height: "100vh",
        width: "100%",
        overflow: "hidden", // Ensure the effect stays within bounds
      }}
    />
  );
};

export default Background;
