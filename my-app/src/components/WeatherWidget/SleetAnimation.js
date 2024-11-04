import React from "react";
import styled, { keyframes } from "styled-components";

const sleetFall = keyframes`
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(100px); opacity: 0; }
`;

const SleetWrapper = styled.div`
  display: flex;
  gap: 4px;
`;

const SleetDrop = styled.div`
  width: 2px;
  height: 15px;
  background: #a9c4f5;
  opacity: 0.7;
  animation: ${sleetFall} 0.5s linear infinite;
  &:nth-child(odd) {
    animation-delay: 0.2s;
  }
`;

const SleetAnimation = () => (
  <SleetWrapper>
    <SleetDrop />
    <SleetDrop />
    <SleetDrop />
    <SleetDrop />
    <SleetDrop />
  </SleetWrapper>
);

export default SleetAnimation;
