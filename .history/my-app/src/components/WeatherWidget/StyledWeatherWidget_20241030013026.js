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
  background: ${({ theme }) =>
    theme.containerBackground}; // Use unique background color for container
  color: ${({ theme }) => theme.color};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.5s ease-in-out;
  transition: background 0.5s ease;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

export const ContactContainer = styled(WidgetContainer)`
  /* Specific styles for ContactContainer if needed */
`;

export const FormContainer = styled(WidgetContainer)`
  /* Specific styles for FormContainer if needed */
`;

export const LoginContainer = styled(WidgetContainer)`
  /* Specific styles for LoginContainer if needed */
`;

export const StatContainer = styled(WidgetContainer)`
  /* Specific styles for StatContainer if needed */
`;

// New styled components for error, loading, and spinner messages
export const ErrorText = styled.p`
  color: red;
  font-weight: bold;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

export const LoadingMessage = styled.p`
  color: blue;
  font-style: italic;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

export const Spinner = styled.div`
  border: 8px solid ${({ theme }) => theme.containerBackground};
  border-top: 8px solid ${({ theme }) => theme.button.background};
  border-radius: 50%;
  width: 40px;
  height: 40px;
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
