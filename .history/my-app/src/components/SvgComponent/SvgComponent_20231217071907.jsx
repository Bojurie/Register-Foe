import React, { useEffect, useState } from "react";
import "./SvgComponent.css"; // Make sure to create this CSS file

const SvgComponent = () => {
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
      viewBox="0 0 400 525.31328320802"
    >
      <path
        id="path3"
        d="M20,20 Q40,60 80,20 T160,20" // Random quadratic Bézier curve
        stroke="#44244c"
        strokeDasharray={animate ? "1000" : "0"}
        fill="none"
        className={animate ? "path-animate" : ""}
      />
      <path
        id="path4"
        d="M150,150 C170,120 230,120 250,150 S310,180 330,150" // Random cubic Bézier curve
        stroke="#7c243c"
        strokeDasharray={animate ? "1000" : "0"}
        fill="none"
        className={animate ? "path-animate" : ""}
      />
      {/* Rest of your SVG */}
    </svg>
  );
};

export default SvgComponent;
