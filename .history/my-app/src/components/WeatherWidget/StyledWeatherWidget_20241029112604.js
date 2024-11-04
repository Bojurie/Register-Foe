import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const WidgetContainer = styled.div`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.color};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  max-width: 300px;
  text-align: center;
  animation: ${fadeIn} 0.5s ease-in;
`;

export const ErrorText = styled.p`
  color: red;
  font-size: 1rem;
`;

export const LoadingMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.color};
  p {
    font-size: 1rem;
    margin-top: 10px;
  }
`;

export const Spinner = styled.div`
  border: 4px solid ${({ theme }) => theme.iconColor};
  border-top: 4px solid ${({ theme }) => theme.background};
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
