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
import AddFaceIcon from "../../../public/icons/AddFaceIcon.svg";
import { IconBackground, IconWrapper } from "../../components/IconWrapper";
import TweetSettings from "../tweetSettings";
import Button from "../../components/Button";
import { AppContext } from "../../pages/_app";

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

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  @media (max-width: 767px) {
    flex-direction: column;
  }
`;

const Container = styled.div<{ bgColor?: string; isPadded?: boolean }>`
  padding: ${(props) => (props.isPadded ? "4em 3em" : "0px 0px")};
  width: 100%;
  max-width: 700px;
  background: ${(props) => props.bgColor || "rgb(232 211 211 / 50%)"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  @media (max-width: 500px) {
    padding: ${(props) => (props.isPadded ? "4em 1em" : 0)};
  } ;
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
  box-shadow: 5px 6px 20px 0px ${({ theme }) => theme.colors.text.secondary};
  border-radius: 10px;
`;

const CountText = styled.span`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text.secondary};
`;

const ButtonWrapper = styled.div<{ color?: string; bgColor?: string }>`
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

const AddFaceIconContainer = styled.div`
  position: absolute;
  bottom: -6px;
  right: -6px;
  width: 1em;
  height: 1em;
  background-color: white;
  border-radius: 50%;
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
  const { setTheme } = useContext(AppContext);

  // styled-components theme object
  const theme: DefaultTheme = useTheme();

  // hide bgColor placeholder with help of this ref
  const hidePlaceholderRef = useRef<HTMLDivElement>(null);
  const hideAddFaceIconRef = useRef<HTMLDivElement>(null);
  const hideTapMessage = useRef<HTMLDivElement>(null);

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

  const bgTextColor = useMemo(() => {
    return "hsla(" + ~~hueValue + "," + "30%," + "60%, 1)";
  }, [hueValue]);

  const [deviceIndex, setDeviceIndex] = useState<number>(0);

  const [isVerified, setIsVerified] = useState<boolean>(false);

  const [visibilityDateTimeDevice, setVisibilityDateTimeDevice] =
    useState<boolean>(false);

  const [visibilityReactions, setVisibilityReactions] =
    useState<boolean>(false);

  const [isPadded, setIsPadded] = useState<boolean>(true);

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
    let color = "rgba(255,255,255, 0.2)";
    switch (hueValue) {
      case 360:
        color = "rgba(255,255,255, 0.2)";
        break;
      case 400:
        color = "linear-gradient(145deg,#b0f0ba 0%,#6ac0eb 100%)";
        break;
      default:
        color = "hsla(" + ~~hueValue + "," + "100%," + "80%, 0.5)";
    }
    setBackgroundColor(color);
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
          // Reference for scaling options: https://github.com/tsayen/dom-to-image/issues/69#issuecomment-486146688
          height: el.offsetHeight * scale,
          width: el.offsetWidth * scale,
          style: {
            transform: "scale(" + scale + ")",
            transformOrigin: "top left",
            width: el.offsetWidth + "px",
            height: el.offsetHeight + "px",
          },
          filter: (node) =>
            ![
              hidePlaceholderRef.current,
              hideAddFaceIconRef.current,
              hideTapMessage.current,
            ].includes(node as HTMLDivElement), // filtering out hidden component
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
    setHueValue((hueValue + 40) % 440);
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

  const handleThemeChange = (selectedTheme: any) => {
    setTheme(selectedTheme);
  };

  const handleIncrement = (iconId, mode = "step", step = 100) => {
    // mode: 'random' | 'step'
    if (iconId !== "share") {
      setCount((prevState) => {
        return {
          ...prevState,
          [iconId]:
            prevState[iconId] +
            (mode === "step" ? step : Math.random() * (100 - 10) + 10),
        };
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
                <ButtonWrapper
                  color={color}
                  bgColor={bgColor}
                  onClick={() => handleIncrement(id, "random")}
                >
                  <IconWrapper>
                    <IconBackground bgColor={bgColor} color={color} />
                    <SvgIcon width={"1em"} height={"1em"} fill={color} />
                  </IconWrapper>
                  <CountText>{formatCount(count[id])}</CountText>
                </ButtonWrapper>
              </Col>
            );
          }
        )}
      </Row>
    );
  }, [count]);

  return (
    <CardContainer style={{ width: "100%", display: "flex", gap: "1em" }}>
      <Col size="4">
        <TweetSettings
          isVerified={isVerified}
          visibilityDateTimeDevice={visibilityDateTimeDevice}
          visibilityReactions={visibilityReactions}
          isPadded={isPadded}
          handleVerifiedClick={handleVerifiedClick}
          hideDateTimeDevice={hideDateTimeDevice}
          hideReactions={hideReactions}
          hidePadding={hidePadding}
          handleThemeChange={handleThemeChange}
        />
      </Col>
      <Col size="8">
        <Row
          justify="center"
          style={{ flexDirection: "column", alignItems: "center" }}
        >
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
                            position: "relative",
                          }}
                          htmlFor="userImage"
                        >
                          <ProfilePic imgUrl={userImage}></ProfilePic>
                          <AddFaceIconContainer ref={hideAddFaceIconRef}>
                            <AddFaceIcon
                              width={"1em"}
                              height={"1em"}
                              fill={theme.colors.primary.main}
                            />
                          </AddFaceIconContainer>
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
                          <Username
                            ref={usernameRef}
                            onInput={handleUsernameChange}
                            contentEditable
                            suppressContentEditableWarning
                          >
                            {userName}
                          </Username>
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
                {/* <Col>
                  <Button
                    rounded
                    size={"small"}
                    bg={theme.colors.body}
                    color={theme.colors.primary.main}
                    outline
                  >
                    Follow
                  </Button>
                </Col> */}
                <Col>
                  <TwitterIcon
                    width={"1.5em"}
                    height={"1.5em"}
                    fill={theme.colors.primary.main}
                  />
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
                      {timestamp.getHours() % 12
                        ? timestamp.getHours() % 12
                        : 12}
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
                    <SmallText
                      isButton
                      color="primary"
                      onClick={handleDeviceTap}
                    >
                      Twitter for {deviceList[deviceIndex]}
                    </SmallText>
                  </Col>
                </Row>
              ) : null}
              {!visibilityReactions ? (
                <>
                  <HR thickness="1px" />
                  {ReactionButtonGroup}
                </>
              ) : null}
            </TweetContainer>
            <div
              ref={hideTapMessage}
              style={{ position: "absolute", bottom: "1em" }}
            >
              <span
                style={{
                  color: bgTextColor,
                  userSelect: "none",
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  fontWeight: "700",
                  letterSpacing: "0.03em",
                }}
              >
                Tap here to change background
              </span>
            </div>
            <div
              ref={hidePlaceholderRef}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                top: 0,
                zIndex: -1,
                borderRadius: "10px",
                backgroundColor: "rgba(255,255,255)",
              }}
            ></div>
          </Container>
          <Col>
            <Row justify="center">
              <Col>
                <Button size="regular" onClick={() => handleDownload("png")}>
                  Download
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </CardContainer>
  );
};
export default TweetCardSimple;
