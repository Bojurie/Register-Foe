import React, { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import "./LandingPage.css"; // Ensure this CSS file exists in your project
import LandingLogo from "../../components/images/logo2-2.png";
import { motion } from "framer-motion";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong with the 3D rendering.</h1>;
    }

    return this.props.children;
  }
}

function Logo3D() {
  // const meshRef = useRef();
  const texture = useLoader(TextureLoader, LandingLogo);

  useFrame(() => {
    meshRef.current.rotation.x = meshRef.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={meshRef}>
      <boxBufferGeometry attach="geometry" args={[2, 2, 2]} />
      <meshStandardMaterial attach="material" map={texture} />
    </mesh>
  );
}

const LandingPage = () => {
  const headerVariants = {
    hidden: { x: -200, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 1 } },
  };

  const subHeaderVariants = {
    hidden: { x: 200, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 1 } },
  };

  return (
    <div className="LandingPage">
      <ErrorBoundary>
        <div className="LandingLogo">
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Logo3D />
          </Canvas>
        </div>
      </ErrorBoundary>
      <motion.h1 variants={headerVariants} initial="hidden" animate="visible">
        Welcome to WE ELECT
      </motion.h1>
      <motion.h3
        variants={subHeaderVariants}
        initial="hidden"
        animate="visible"
      >
        Hand in hand we can choose a better future
      </motion.h3>
    </div>
  );
};

export default LandingPage;
