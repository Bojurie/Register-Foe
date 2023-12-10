import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

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
    const city = cityRef.current;

    try {
      // Create city elements (buildings, people, etc.) using Three.js

      // Example: Creating a simple cube as a building
      const buildingGeometry = new THREE.BoxGeometry(1, 1, 1);
      const buildingMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
      const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
      building.position.set(0, 0.5, 0); // Adjust position as needed
      city.add(building);

      // Example: Creating a person (a sphere)
      const personGeometry = new THREE.SphereGeometry(0.2, 32, 32);
      const personMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const person = new THREE.Mesh(personGeometry, personMaterial);
      person.position.set(0, 1.2, 0); // Adjust position as needed
      city.add(person);

      // Add more elements based on your design

      // Set initial camera position
      const camera = city.getObjectByName("camera");
      camera.position.set(0, 3, 5);
    } catch (error) {
      console.error("Error in CityScene setup:", error);
    }
  }, []);

  // Keyframe animations
  useFrame(() => {
    try {
      cityRef.current.rotation.y += 0.005;
    } catch (error) {
      console.error("Error in CityScene animation:", error);
    }
  });

  return (
    <Canvas>
      <group ref={cityRef}>
        <perspectiveCamera
          name="camera"
          fov={75}
          aspect={window.innerWidth / window.innerHeight}
          near={0.1}
          far={100}
          position={[0, 0, 5]}
        />

        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 1, 1]} intensity={1} />

        {/* Interactive elements go here */}
      </group>
    </Canvas>
  );
};
export default CityScene;
