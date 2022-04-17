import styled from "styled-components";

export const Grid = styled.div``;
interface RowProps {
  direction?: string;
  justify?: string;
  align?: string;
  gap?: string;
  margin?: string;
  padding?: string;
}
export const Row = styled.div<RowProps>`
  display: flex;
  flex-direction: ${(props) => props.direction || "row"};
  justify-content: ${(props) => props.justify || "flex-start"};
  align-items: ${(props) => props.align || "flex-start"};
  gap: ${(props) => props.gap};
  margin: ${(props) => props.margin};
  padding: ${(props) => props.padding};
  width: 100%;
`;

interface ColProps {
  size?: string;
  justify?: string;
  align?: string;
}
export const Col = styled.div<ColProps>`
  flex: ${(props) => props.size};
  justify-content: ${(props) => props.justify || "flex-start"};
  align-items: ${(props) => props.align || "flex-start"};
  min-width: 0;
`;
