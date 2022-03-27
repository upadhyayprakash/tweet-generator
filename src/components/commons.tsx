import styled from 'styled-components'

export const Grid = styled.div``;
interface RowProps {
    justify?: string;
    align?: string;
    gap?: string;
    margin?: string;
}
export const Row = styled.div<RowProps>`
    display: flex;
    justify-content: ${(props) => props.justify || "flex-start"};
    align-items: ${(props) => props.align || "flex-start"};
    gap: ${(props) => props.gap};
    margin: ${(props) => props.margin};
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
