import React from "react";
import styled, { keyframes } from "styled-components";

const windBlow = keyframes`
  0% { transform: translateX(0); opacity: 1; }
  100% { transform: translateX(30px); opacity: 0; }
`;

const WindWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const WindGust = styled.div`
  width: 20px;
  height: 4px;
  background: #d3e3e9;
  opacity: 0.6;
  animation: ${windBlow} 1s ease-in-out infinite;
  &:nth-child(2) {
    animation-delay: 0.3s;
    width: 15px;
  }
  &:nth-child(3) {
    animation-delay: 0.6s;
    width: 10px;
  }
`;

const WindyAnimation = () => (
  <WindWrapper>
    <WindGust />
    <WindGust />
    <WindGust />
  </WindWrapper>
);

export default WindyAnimation;
