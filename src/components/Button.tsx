import styled from "styled-components";

const Button = styled.button<{
  bg?: string;
  color?: string;
  outline?: boolean;
  rounded?: boolean;
  size?: string;
}>`
  padding: ${({ size }) =>
    size === "small"
      ? "0.4em 1em"
      : size === "big"
      ? "1em 2em"
      : "0.5em 1.5em"};
  margin: 1em 0;
  border-radius: ${({ rounded }) => (rounded ? "9999px" : ".5em")};
  background-color: ${(props) => props.bg || props.theme.colors.primary.main};
  color: ${(props) => props.color || "white"};
  border: 1px solid
    ${(props) =>
      props.outline
        ? props.color || props.theme.colors.text.primary
        : "transparent"};
  font-size: ${({ size }) => (size === "small" ? "1rem" : "1.2rem")};
  font-weight: 500;
  letter-spacing: 1px;
`;

export default Button;
