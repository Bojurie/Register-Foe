import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    if (hasError) {
      console.error("Something went wrong.");
    }
  }, [hasError]);

  return hasError ? <h1>Something went wrong.</h1> : children;
};

const CityScene = () => {
  const cityRef = useRef();

  useEffect(() => {
    const city = cityRef.current;

    const createBuilding = (position) => {
      const buildingGeometry = new THREE.BoxGeometry(1, 1, 1);
      const buildingMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
      const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
      building.position.copy(position);
      city.add(building);
    };

    const createPerson = (position) => {
      const personGeometry = new THREE.SphereGeometry(0.2, 32, 32);
      const personMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const person = new THREE.Mesh(personGeometry, personMaterial);
      person.position.copy(position);
      city.add(person);
    };

    try {
      createBuilding(new THREE.Vector3(0, 0.5, 0));
      createPerson(new THREE.Vector3(0, 1.2, 0));

      const camera = city.getObjectByName("camera");
      camera.position.set(0, 3, 5);
    } catch (error) {
      console.error("Error in CityScene setup:", error);
    }
  }, []);

  useFrame(() => {
    try {
      cityRef.current.rotation.y += 0.005;
    } catch (error) {
      console.error("Error in CityScene animation:", error);
    }
  });

  return (
    <Canvas>
      <ErrorBoundary>
        <group ref={cityRef}>
          <perspectiveCamera
            name="camera"
            fov={75}
            aspect={window.innerWidth / window.innerHeight}
            near={0.1}
            far={100}
            position={[0, 0, 5]}
          />

          <ambientLight intensity={0.5} />
          <directionalLight position={[1, 1, 1]} intensity={1} />

          {/* Additional components/effects */}
          <RotatingCube />
        </group>
      </ErrorBoundary>
    </Canvas>
  );
};

const RotatingCube = () => {
  const cubeRef = useRef();

  useFrame(() => {
    try {
      cubeRef.current.rotation.x += 0.01;
      cubeRef.current.rotation.y += 0.01;
    } catch (error) {
      console.error("Error in RotatingCube animation:", error);
    }
  });

  return (
    <mesh ref={cubeRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={0xff0000} />
    </mesh>
  );
};

export default CityScene;
