import { FC, useEffect, useMemo, useState } from "react";
import Text from "../../components/Text";
import Button from "../../components/Button";
import { Col, Row } from "../../components/commons";
import { useCustomTheme } from "../../theme/useTheme";
import Checkbox from "../../components/Checkbox";

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
  const { themes: allThemes } = useCustomTheme();
  const [data, setData] = useState(allThemes);
  const [themes, setThemes] = useState([]);

  // Loading local themes
  useEffect(() => {
    setThemes(Object.keys(data));
  }, [data]);

  const ThemeButtonGroup = useMemo(() => {
    return (
      <Row justify="center" gap="1em" align="center">
        {themes.length > 0 &&
          themes.map((theme) => {
            return (
              <Col key={data[theme].id}>
                <Button
                  bg={data[theme].colors?.body}
                  color={data[theme].colors?.text.primary}
                  outline
                  onClick={() => handleThemeChange(data[theme])}
                  size="small"
                >
                  {data[theme].name}
                </Button>
              </Col>
            );
          })}
      </Row>
    );
  }, [themes]);
  return (
    <Row justify="center">
      <Col>
        <Row margin="0.5em 0 .5em" justify="center" align="center">
          <Col>
            <label>
              <Checkbox checked={isVerified} onChange={handleVerifiedClick} />
              <Text style={{ marginLeft: 8 }}>is user verified?</Text>
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

        <Row margin="1em 0 .5em" justify="center" align="center">
          <Col>
            <label>
              <Checkbox
                checked={visibilityReactions}
                onChange={hideReactions}
              />
              <Text style={{ marginLeft: 8 }}>hide reactions?</Text>
            </label>
          </Col>
        </Row>

        <Row margin="1em 0 .5em" justify="center" align="center">
          <Col>
            <label>
              <Checkbox checked={!isPadded} onChange={hidePadding} />
              <Text style={{ marginLeft: 8 }}>hide background frame?</Text>
            </label>
          </Col>
        </Row>
        {ThemeButtonGroup}
      </Col>
    </Row>
  );
};

export default TweetSettings;
