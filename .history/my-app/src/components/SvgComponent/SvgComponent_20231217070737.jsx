import React, { useEffect, useState } from "react";
import "./MySvgComponent.css"; // Make sure to create this CSS file

const MySvgComponent = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 3000); // Start animation 3 seconds after component mounts

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, []);

  return (
    <svg
      id="svg"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="400"
      height="525.31328320802"
      viewBox="0, 0, 400,525.31328320802"
    >
      {/* Your existing paths */}
      {/* Example updated path with animation */}
      <path
        id="path3"
        d="M10 10 H 90 V 90 H 10 L 10 10" // Replace with your actual path data
        stroke="#44244c"
        strokeDasharray={animate ? "1000" : "0"}
        fill="none"
        className={animate ? "path-animate" : ""}
      />
      <path
        id="path4"
        d="M100 100 H 190 V 190 H 100 L 100 100" // Replace with your actual path data
        stroke="#7c243c"
        strokeDasharray={animate ? "1000" : "0"}
        fill="none"
        className={animate ? "path-animate" : ""}
      />
      {/* Rest of your SVG */}
    </svg>
  );
};

export default MySvgComponent;
