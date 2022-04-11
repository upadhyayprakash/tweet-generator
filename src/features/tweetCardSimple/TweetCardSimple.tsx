import { FC, useContext, useEffect, useMemo, useRef, useState } from "react";
import styled, { DefaultTheme, useTheme } from "styled-components";
import domtoimage from "dom-to-image";
import { Col, Row } from "../../components/commons";
import ReplyIcon from "../../../public/icons/ReplyIcon.svg";
import RetweetIcon from "../../../public/icons/RetweetIcon.svg";
import LikeIcon from "../../../public/icons/LikeIcon.svg";
import ShareIcon from "../../../public/icons/ShareIcon.svg";
import TwitterIcon from "../../../public/icons/TwitterIcon.svg";
import VerifiedBadge from "../../../public/icons/VerifiedBadge.svg";
import Checkbox from "../../components/checkbox";
import { IconBackground, IconWrapper } from "../../components/IconWrapper";
import { getFromLS } from "../../utils/storage";
import { useCustomTheme } from "../../theme/useTheme";
import { CustomThemeContext } from "../../pages/_app";

const reactionIconsArray = [
  {
    id: "reply",
    icon: ReplyIcon,
    color: "rgb(29,155,240)",
    bgColor: "rgba(29,155,240,0.1)",
  },
  {
    id: "retweet",
    icon: RetweetIcon,
    color: "rgb(0,186,124)",
    bgColor: "rgba(0,186,124, 0.1)",
  },
  {
    id: "like",
    icon: LikeIcon,
    color: "rgb(249,24,128)",
    bgColor: "rgba(249,24,128, 0.1)",
  },
  {
    id: "share",
    icon: ShareIcon,
    color: "rgb(29,155,240)",
    bgColor: "rgba(29,155,240, 0.1)",
  },
];

const Container = styled.div<{ bgColor?: string; isPadded?: boolean }>`
  padding: ${(props) => (props.isPadded ? "4em 3em" : "0px 0px")};
  width: 100%;
  max-width: 700px;
  background-color: ${(props) => props.bgColor || "rgb(232 211 211 / 50%)"};
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 500px) {
    padding: ${(props) => (props.isPadded ? "4em 1em" : 0)};
  } ;
`;

const Button = styled.button<{
  bg?: string;
  color?: string;
  outline?: boolean;
}>`
  padding: 1em 2em;
  margin: 1em 0;
  border-radius: 0.5em;
  background-color: ${(props) => props.bg || props.theme.colors.primary.main};
  color: ${(props) => props.color || "white"};
  border: 1px solid
    ${(props) =>
    props.outline
      ? props.color || props.theme.colors.text.primary
      : "transparent"};
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: 1px;
`;

const HashTag = styled.span`
  // styles are applied in <HashListContainer /> tag
`;

const HashListContainer = styled.div`
  display: flex;
  gap: 0.3em;
  justify-content: center;
  outline: none;
  font-size: 1.3rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.primary.main};
  @media (max-width: 500px) {
    font-size: 1.2rem;
  } ;
`;

const ProfilePic = styled.div<{ imgUrl?: string }>`
  width: 2em;
  height: 2em;
  border-radius: 50%;
  border: 1px solid rgb(124 124 124 / 25%);
  background-image: ${(props) => `url(${props.imgUrl})`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const Username = styled.p`
  font-weight: 600;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  outline: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 0.2em;
  @media (max-width: 500px) {
    font-size: 0.8rem;
  } ;
`;
const Userhandle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  outline: none;
  margin-top: 0.3em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @media (max-width: 500px) {
    font-size: 0.8rem;
  } ;
`;

interface SmallTextProps {
  disabled?: boolean;
  color?: string;
  isButton?: boolean;
}
const SmallText = styled.p<SmallTextProps>`
  font-size: 1rem;
  cursor: ${(props) => (props.isButton ? "pointer" : "initial")};
  user-select: ${(props) => (props.isButton ? "none" : "initial")};
  color: ${(props) =>
    props.disabled
      ? "#8c8c8c"
      : props.color === "primary"
        ? props.theme.colors.primary.main
        : "black"};
  white-space: nowrap;
  @media (max-width: 500px) {
    font-size: 0.8rem;
  } ;
`;

const Dot = styled.div`
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background-color: #7c7c7c;
`;

interface HRProps {
  thickness?: string;
}

const HR = styled.hr<HRProps>`
  border: 0;
  height: ${(props) => props.thickness};
  width: 100%;
  background-color: ${({ theme }) => theme.colors.borderColor};
  margin: 0.5em 0;
`;

const TweetTextInput = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  width: 100%;
  text-align: left;
  margin-bottom: 1em;
  outline: none;
  @media (max-width: 500px) {
    font-size: 1.1rem;
    line-height: 1.6rem;
  } ;
`;

const TweetTextContainer = styled.div`
  font-family: Ubuntu, Arial;
  font-size: 1.4rem;
  line-height: 2rem;
  font-weight: 400;
  color: #262626;
  flex: 1;
`;

const TweetContainer = styled.div`
  position: relative;
  padding: 1em 1em;
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: ${({ theme }) => theme.colors.body};
  box-shadow: 0px 0px 18px ${({ theme }) => theme.colors.borderColor};
`;

const Text = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TwitterIconContainer = styled.div`
  position: absolute;
  top: 0.1em;
  right: 0.1em;
`;

const CountText = styled.span`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text.secondary};
`;

const ReactWrapper = styled.div<{ color?: string; bgColor?: string }>`
  display: flex;
  align-items: center;
  user-select: none;
  gap: 0.2em;
  &:hover ${CountText} {
    color: ${(props) => props.color};
  }
  &:hover ${IconWrapper} {
    border-radius: 9999px;
    background-color: ${(props) => props.bgColor};
    + svg {
      fill: ${(props) => props.color};
    }
  }
`;

interface TweetCardSimpleProps {
  userHandle: string;
  userName: string;
  userImageUrl?: string;
  tweet: string;
  limit?: number;
  imageUrl?: string;
  hashTags?: string[];
  timestamp?: Date;
  deviceList?: string[];
  onChange: (s: string) => any;
  onTagChange: (s: string[]) => any;
}
const TweetCardSimple: FC<TweetCardSimpleProps> = ({
  userHandle,
  userName,
  userImageUrl,
  tweet,
  limit = 140,
  imageUrl,
  hashTags,
  timestamp,
  deviceList,
  onChange,
  onTagChange,
}) => {
  // theme related
  const { themes: allThemes } = useCustomTheme();
  const [data, setData] = useState(allThemes);
  const [themes, setThemes] = useState([]);
  const { setMode } = useCustomTheme();
  const { setTheme } = useContext(CustomThemeContext);

  // styled-components theme object
  const theme: DefaultTheme = useTheme();

  // hide bgColor placeholder with help of this ref
  const hidePlaceholderRef = useRef<HTMLDivElement>(null);

  const [count, setCount] = useState({ reply: 0, retweet: 0, like: 0 });

  const [selectedFile, setSelectedFile] = useState();
  const [userImage, setUserImage] = useState(userImageUrl);

  const tweetInputRef = useRef<HTMLDivElement>(null);
  const lastTweet = useRef<string>();

  const tagInputRef = useRef<HTMLDivElement>(null);
  const lastTags = useRef<string[]>([]);

  const usernameRef = useRef<HTMLDivElement>(null);
  const lastUsername = useRef<string>();

  const userhandleRef = useRef<HTMLDivElement>(null);
  const lastUserhandle = useRef<string>();

  const [hueValue, setHueValue] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState(
    "rgb(232 211 211 / 50%)"
  );

  const [deviceIndex, setDeviceIndex] = useState<number>(0);

  const [isVerified, setIsVerified] = useState<boolean>(false);

  const [visibilityDateTimeDevice, setVisibilityDateTimeDevice] =
    useState<boolean>(false);

  const [visibilityReactions, setVisibilityReactions] =
    useState<boolean>(false);

  const [isPadded, setIsPadded] = useState<boolean>(true);

  // Loading local themes
  useEffect(() => {
    setThemes(Object.keys(data));
  }, [data]);

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setUserImage(userImageUrl);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setUserImage(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    setBackgroundColor(
      hueValue === 360
        ? "rgba(255,255,255, 0.2)"
        : "hsla(" + ~~hueValue + "," + "100%," + "80%, 0.2)"
    );
  }, [hueValue]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  };

  const handleMessageChange = () => {
    // Approach: https://stackoverflow.com/a/70028295
    const currTweet = tweetInputRef.current?.innerText || "";
    if (currTweet !== lastTweet.current) {
      onChange(currTweet);
    }
    lastTweet.current = tweet;
  };

  const getTagsFromStrings = (tagStr: string): string[] => {
    // matches any pattern starting with '#' and containing alphabets, numbers or underscore
    return tagStr.match(/#\w+/g) || [];
  };

  const handleTagChange = () => {
    const currTags = getTagsFromStrings(tagInputRef.current?.innerHTML || "");
    if (currTags !== lastTags.current) {
      onTagChange(currTags);
    }
    lastTags.current = hashTags;
  };

  const handleUsernameChange = () => {
    const currVal = usernameRef.current?.innerHTML || "";
    if (currVal !== lastUsername.current) {
      // do something
    }
    lastUsername.current = userName;
  };

  const handleUserhandleChange = () => {
    const currVal = userhandleRef.current?.innerHTML || "";
    if (currVal !== lastUserhandle.current) {
      // do something
    }
    lastUserhandle.current = userHandle;
  };

  const handleDownload = (type) => {
    if (type === "png") {
      const el = document.getElementById("tweetContent");
      const scale = 3;
      domtoimage
        .toPng(el, {
          height: el.offsetHeight * scale,
          width: el.offsetWidth * scale,
          style: {
            transform: "scale(" + scale + ")",
            transformOrigin: "top left",
            width: el.offsetWidth + "px",
            height: el.offsetHeight + "px",
          },
          filter: (node) => node !== hidePlaceholderRef.current, // hiding bg placeholder component
        })
        .then(function (dataUrl) {
          let dateTime = new Date();
          let dateTimeStr =
            dateTime.getFullYear() +
            "-" +
            (dateTime.getMonth() + 1) +
            "-" +
            dateTime.getDate() +
            " " +
            dateTime.getHours() +
            "H" +
            (dateTime.getMinutes() < 10
              ? "0" + dateTime.getMinutes()
              : dateTime.getMinutes()) +
            "M";
          let link = document.createElement("a");
          link.download = "tweet-export-" + dateTimeStr + ".png";
          link.href = dataUrl;
          link.click();
        });
    }
  };

  const handleBackgroundChange = () => {
    setHueValue((hueValue + 40) % 400);
  };

  const handleDeviceTap = () => {
    setDeviceIndex((deviceIndex + 1) % deviceList.length);
  };

  const handleVerifiedClick = () => {
    setIsVerified(!isVerified);
  };

  const hideDateTimeDevice = () => {
    setVisibilityDateTimeDevice(!visibilityDateTimeDevice);
  };

  const hideReactions = () => {
    setVisibilityReactions(!visibilityReactions);
  };

  const hidePadding = () => {
    setIsPadded(!isPadded);
  };

  const handleThemeChange = (selectedTheme) => {
    setMode(selectedTheme);
    setTheme(selectedTheme);
  };

  const ThemeButtonGroup = useMemo(() => {
    return (
      <Row justify="center" gap="1em">
        {themes.length > 0 &&
          themes.map((theme) => {
            return (
              <Col key={data[theme].id}>
                <Button
                  bg={data[theme].colors?.body}
                  color={data[theme].colors?.text.primary}
                  outline
                  onClick={() => handleThemeChange(data[theme])}
                >
                  {data[theme].name}
                </Button>
              </Col>
            );
          })}
      </Row>
    );
  }, [themes]);

  const handleIncrement = (iconId, step = 100) => {
    if (iconId !== "share") {
      setCount((prevState) => {
        return { ...prevState, [iconId]: prevState[iconId] + step };
      });
    }
  };

  const formatCount = (count) =>
    !isNaN(count) &&
    Intl.NumberFormat("en", { notation: "compact" }).format(count);

  const ReactionButtonGroup = useMemo(() => {
    return (
      <Row justify="space-around">
        {reactionIconsArray.map(
          ({ icon: SvgIcon, id, color, bgColor }, index) => {
            return (
              <Col key={index} align="center">
                <ReactWrapper
                  color={color}
                  bgColor={bgColor}
                  onClick={() => handleIncrement(id, 100)}
                >
                  <IconWrapper>
                    <IconBackground bgColor={bgColor} color={color} />
                    <SvgIcon width={"1em"} height={"1em"} fill={color} />
                  </IconWrapper>
                  <CountText>{formatCount(count[id])}</CountText>
                </ReactWrapper>
              </Col>
            );
          }
        )}
      </Row>
    );
  }, [count]);

  return (
    <div style={{ width: "100%" }}>
      <Row margin="0.5em 0 .5em" justify="center" align="center">
        <Col>
          <label>
            <Checkbox checked={isVerified} onChange={handleVerifiedClick} />
            <Text style={{ marginLeft: 8 }}>is user verified?</Text>
          </label>
        </Col>
      </Row>

      <Row margin="0.5em 0 .5em" justify="center" align="center">
        <Col>
          <label>
            <Checkbox
              checked={visibilityDateTimeDevice}
              onChange={hideDateTimeDevice}
            />
            <Text style={{ marginLeft: 8 }}>hide date, time and device?</Text>
          </label>
        </Col>
      </Row>

      <Row margin="1em 0 .5em" justify="center" align="center">
        <Col>
          <label>
            <Checkbox checked={visibilityReactions} onChange={hideReactions} />
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
      <Row justify="center">
        <Container
          isPadded={isPadded}
          id="tweetContent"
          bgColor={backgroundColor}
          onClick={handleBackgroundChange}
          style={{ position: "relative" }}
        >
          <TweetContainer onClick={(e) => e.stopPropagation()}>
            <Row align="center" margin="0.5em 0" justify="space-between">
              <Col size="8">
                <Row align="center" gap={"0.5em"}>
                  <Col justify="center" style={{ flexShrink: 0 }}>
                    <Row>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          borderRadius: "50%",
                          width: "100%",
                          height: "100%",
                        }}
                        htmlFor="userImage"
                      >
                        <ProfilePic imgUrl={userImage}></ProfilePic>
                      </label>
                      <input
                        id="userImage"
                        accept="image/*"
                        style={{ display: "none" }}
                        type="file"
                        onChange={onSelectFile}
                      />
                    </Row>
                  </Col>
                  <Col>
                    <Row align="center">
                      <Col>
                        <Username
                          ref={usernameRef}
                          onInput={handleUsernameChange}
                          contentEditable
                          suppressContentEditableWarning
                        >
                          {userName}
                        </Username>
                      </Col>
                      {isVerified ? (
                        <Col style={{ display: "flex" }}>
                          <VerifiedBadge
                            width={".7em"}
                            fill={theme.colors.badge}
                          />
                        </Col>
                      ) : null}
                    </Row>
                    <Row>
                      <Userhandle
                        ref={userhandleRef}
                        onInput={handleUserhandleChange}
                        contentEditable
                        suppressContentEditableWarning
                      >
                        {userHandle}
                      </Userhandle>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <TweetTextContainer>
                <TweetTextInput
                  ref={tweetInputRef}
                  onInput={handleMessageChange}
                  contentEditable
                  suppressContentEditableWarning
                >
                  {tweet}
                </TweetTextInput>
              </TweetTextContainer>
            </Row>
            <Row margin="0 0 1em">
              <HashListContainer
                ref={tagInputRef}
                onInput={handleTagChange}
                contentEditable
                suppressContentEditableWarning
              >
                {hashTags.map((tag, idx) => (
                  <HashTag key={tag + "_" + idx}>{"#" + tag}</HashTag>
                ))}
              </HashListContainer>
            </Row>
            {!visibilityDateTimeDevice ? (
              <Row align="center" gap="0.5em">
                <Col>
                  <SmallText disabled>
                    {timestamp.getHours() % 12 ? timestamp.getHours() % 12 : 12}
                    :
                    {timestamp.getMinutes() < 10
                      ? "0" + timestamp.getMinutes()
                      : timestamp.getMinutes()}{" "}
                    {+(timestamp.getHours() >= 12) ? "PM" : "AM"}
                  </SmallText>
                </Col>
                <Col>
                  <Dot />
                </Col>
                <Col>
                  <SmallText disabled>
                    {timestamp.getDate() +
                      "/" +
                      (timestamp.getMonth() + 1) +
                      "/" +
                      timestamp.getFullYear()}
                  </SmallText>
                </Col>
                <Col>
                  <Dot />
                </Col>
                <Col>
                  <SmallText isButton color="primary" onClick={handleDeviceTap}>
                    Twitter for {deviceList[deviceIndex]}
                  </SmallText>
                </Col>
              </Row>
            ) : null}
            {!visibilityReactions ? (
              <>
                <HR thickness="1px" />
                {ReactionButtonGroup}
                {/* <Row justify="space-around">
                  <Col>
                    <IconWrapper>
                      <IconBackground
                        bgColor="rgba(29,155,240, 0.1)"
                        color="rgba(29,155,240)"
                      />
                      <ReplyIcon
                        width={"1em"}
                        height={"1em"}
                        fill="rgba(29,155,240)"
                      />
                    </IconWrapper>
                  </Col>
                  <Col>
                    <IconWrapper>
                      <IconBackground
                        bgColor="rgba(0,186,124, 0.1)"
                        color="rgba(0,186,124)"
                      />
                      <RetweetIcon
                        width={"1em"}
                        height={"1em"}
                        fill="rgba(0,186,124)"
                      />
                    </IconWrapper>
                  </Col>
                  <Col>
                    <IconWrapper>
                      <IconBackground
                        bgColor="rgba(249,24,128, 0.1)"
                        color="rgba(249,24,128)"
                      />
                      <LikeIcon
                        width={"1em"}
                        height={"1em"}
                        fill="rgba(249,24,128)"
                      />
                    </IconWrapper>
                  </Col>
                  <Col>
                    <IconWrapper>
                      <IconBackground
                        bgColor="rgba(29,155,240, 0.1)"
                        color="rgba(29,155,240)"
                      />
                      <ShareIcon
                        width={"1em"}
                        height={"1em"}
                        fill="rgba(29,155,240)"
                      />
                    </IconWrapper>
                  </Col>
                </Row> */}
                <HR thickness="1px" />
              </>
            ) : null}
            {/* <TwitterIconContainer>
              <TwitterIcon
                width={"1.5em"}
                height={"1.5em"}
                fill={theme.colors.primary.main}
              />
            </TwitterIconContainer> */}
          </TweetContainer>
          <div
            ref={hidePlaceholderRef}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              top: 0,
              zIndex: -1,
              backgroundColor: "rgba(255,255,255)",
            }}
          ></div>
        </Container>
      </Row>
      <Row justify="center">
        <Col>
          <Button onClick={() => handleDownload("png")}>Download</Button>
        </Col>
      </Row>
    </div>
  );
};
export default TweetCardSimple;
