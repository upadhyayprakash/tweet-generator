import styled from "styled-components";
export const IconWrapper = styled.div`
  position: relative;
  display: inline-flex;
  min-height: 0px;
  min-width: 0px;
  padding: 0.3em;
  align-items: center;
`;

export const IconBackground = styled.div<{ color?: string; bgColor?: string }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  transition-property: background-color, box-shadow;
  transition-duration: 0.2s;
  outline: none;
  +svg {
    transition-property: fill;
    fill: #8b98a6;
  }
`;

export const SvgComponent = styled.svg`
  fill: ${({ theme }) => theme.colors.primary.main};
`;
