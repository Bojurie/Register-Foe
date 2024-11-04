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
