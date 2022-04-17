import { FC, useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.2em;
`;

const SpanPlaceholder = styled.span`
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  transition: all 0.2s;
  background: white;
  box-shadow: 0 0 2px 0 rgba(10, 10, 10, 0.29);
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  width: 40px;
  height: 20px;
  background: ${({ theme }) => theme.colors.borderColor};
  border-radius: 100px;
  position: relative;
  transition: all 0.2s;
`;

const InputCheckbox = styled.input`
  height: 0;
  width: 0;
  visibility: hidden;
  &:checked + ${Label} {
    background: ${({ theme }) => theme.colors.secondary.main};
  }
  &:checked + ${Label} ${SpanPlaceholder} {
    left: calc(100% - 2px);
    transform: translateX(-100%) rotate(-135deg);
    background: white;
    /* box-shadow: inset 5px 0px white, inset 5px 0px 1px 2px white; */
  }
`;

interface SwitchProps {
  label?: string;
  value?: boolean;
  data: any;
  onClick: (mode: string) => void;
}

const Switch: FC<SwitchProps> = ({ label, data, value = false, onClick }) => {
  const [isToggled, setIsToggle] = useState<boolean>(value);
  const onToggle = () => {
    if (isToggled) onClick("light");
    else onClick("dark");
    setIsToggle(!isToggled);
  };

  useEffect(() => {
    setIsToggle(value);
  }, [value]);

  return (
    <Container>
      <InputCheckbox name="toggleSwitch" type="checkbox" checked={isToggled} />
      <Label htmlFor="toggleSwitch" onClick={() => onToggle()}>
        <SpanPlaceholder></SpanPlaceholder>
      </Label>
    </Container>
  );
};
export default Switch;
