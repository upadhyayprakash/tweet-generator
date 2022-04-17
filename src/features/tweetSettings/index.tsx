import { FC, useContext, useEffect, useMemo, useState } from "react";
import Text from "../../components/Text";
import Button from "../../components/Button";
import { Col, Row } from "../../components/commons";
import Checkbox from "../../components/Checkbox";
import Switch from "../../components/Switch";
import { AppContext } from "../../pages/_app";
import styled from "styled-components";

const SettingsContainer = styled.div`
  ${Col}
  & ${Row}:hover {
    background: rgba(255, 255, 255, 0.4);
  }
`;

const Span = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1rem;
`;

interface TweetSettingsTypes {
  isVerified: boolean;
  visibilityDateTimeDevice: boolean;
  visibilityReactions: boolean;
  isPadded: boolean;
  handleVerifiedClick: () => void;
  hideDateTimeDevice: () => void;
  hideReactions: () => void;
  hidePadding: () => void;
  handleThemeChange: (theme: string) => void;
}

const TweetSettings: FC<TweetSettingsTypes> = ({
  isVerified,
  visibilityDateTimeDevice,
  visibilityReactions,
  isPadded,
  handleVerifiedClick,
  hideDateTimeDevice,
  hideReactions,
  hidePadding,
  handleThemeChange,
}) => {
  const { themes, theme: selectedTheme } = useContext(AppContext);
  const [themeKeys, setThemeKeys] = useState([]);

  // Loading local themes
  useEffect(() => {
    setThemeKeys(Object.keys(themes));
  }, [themes]);

  const ThemeButtonGroup = useMemo(() => {
    return (
      <Row justify="center" gap="1em" align="center">
        {themeKeys.length > 0 &&
          themeKeys.map((theme) => {
            return (
              <Col key={themes[theme].id}>
                <Button
                  bg={themes[theme].colors?.body}
                  color={themes[theme].colors?.text.primary}
                  outline
                  onClick={() => handleThemeChange(theme)}
                  size="small"
                >
                  {themes[theme].name}
                </Button>
              </Col>
            );
          })}
      </Row>
    );
  }, [themeKeys]);
  return (
    <Row justify="center">
      <SettingsContainer>
        <Row padding="0.5em .5em" justify="space-between" align="center">
          <Col>
            <Text style={{ marginRight: 8 }}>is user verified?</Text>
          </Col>
          <Col>
            <label>
              <Checkbox checked={isVerified} onChange={handleVerifiedClick} />
            </label>
          </Col>
        </Row>

        {/* <Row margin="0.5em 0 .5em" justify="center" align="center">
        <Col>
          <label>
            <Checkbox
              checked={visibilityDateTimeDevice}
              onChange={hideDateTimeDevice}
            />
            <Text style={{ marginLeft: 8 }}>hide date, time and device?</Text>
          </label>
        </Col>
      </Row> */}

        <Row padding=".5em .5em" justify="space-between" align="center">
          <Col>
            <Text style={{ marginRight: 8 }}>hide reactions?</Text>
          </Col>
          <Col>
            <label>
              <Checkbox
                checked={visibilityReactions}
                onChange={hideReactions}
              />
            </label>
          </Col>
        </Row>

        <Row padding=".5em .5em" justify="space-between" align="center">
          <Col>
            <Text style={{ marginRight: 8 }}>hide background frame?</Text>
          </Col>
          <Col>
            <label>
              <Checkbox checked={!isPadded} onChange={hidePadding} />
            </label>
          </Col>
        </Row>
        {/* {ThemeButtonGroup} */}
        <Row padding="0.5em .5em" justify="space-between" align="center">
          <Col>
            {" "}
            <Text style={{ marginRight: 8 }}>Dark Mode</Text>
          </Col>
          <Col>
            <Switch
              value={selectedTheme === "dark"}
              data={themes}
              onClick={(theme: any) => handleThemeChange(theme)}
            />
          </Col>
        </Row>
      </SettingsContainer>
    </Row>
  );
};

export default TweetSettings;
