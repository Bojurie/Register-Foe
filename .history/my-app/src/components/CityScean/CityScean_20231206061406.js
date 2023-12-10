import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const CityScene = () => {
  const cityRef = useRef();

  // Set up city scene
  useEffect(() => {
    const city = cityRef.current;

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
  }, []);

  // Keyframe animations
  useFrame(() => {
    // Add keyframe animations using Three.js
    // Example: Rotate the city
    cityRef.current.rotation.y += 0.005;

    // Add more animations based on your design
  });

  return (
    <group ref={cityRef}>
      {/* Perspective camera */}
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
  );
};

export default CityScene;
