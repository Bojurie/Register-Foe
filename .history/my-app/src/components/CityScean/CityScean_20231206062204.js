import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to a service here if needed
    console.error("Error in CityScene:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

const CityScene = () => {
  const cityRef = useRef();

  // Set up city scene
  useEffect(() => {
    try {
      // Your existing Three.js setup code
    } catch (error) {
      console.error("Error in CityScene setup:", error);
    }
  }, []);

  // Keyframe animations
  useFrame(() => {
    try {
      // Your existing Three.js animation code
    } catch (error) {
      console.error("Error in CityScene animation:", error);
    }
  });

  return (
    <ErrorBoundary>
      <group ref={cityRef}>{/* Your existing code */}</group>
    </ErrorBoundary>
  );
};

export default CityScene;
