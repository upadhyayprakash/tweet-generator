import { FC, useEffect, useRef, useState } from 'react';
import styled from 'styled-components'
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';
import { Col, Row } from '../../components/commons';
import ReplyIcon from '../../../public/icons/ReplyIcon.svg';
import RetweetIcon from '../../../public/icons/RetweetIcon.svg';
import LikeIcon from '../../../public/icons/LikeIcon.svg';
import ShareIcon from '../../../public/icons/ShareIcon.svg';
import TwitterIcon from '../../../public/icons/TwitterIcon.svg';
import VerifiedBadge from '../../../public/icons/VerifiedBadge.svg';
import Checkbox from '../../components/checkbox';

enum Themes {
    Dark,
    Light,
    Moonlight
}

const Container = styled.div<{ bgColor?: string, isPadded?: boolean }>`
    padding: ${(props) => props.isPadded ? '4em 4em' : 0};
    width: 100%;
    max-width: 700px;
    background-color: ${(props) => props.bgColor || 'rgb(232 211 211 / 50%)'};
    display: flex;
    align-items: center;
    justify-content: center;
    @media (max-width: 500px) {
        padding: ${(props) => props.isPadded ? '4em 1em' : 0};
    };
`;

const Button = styled.button`
    padding: 1em 2em;
    margin: 1em 0;
    border: none;
    border-radius: 0.5em;
    background-color: #1DA1F2;
    color: white;
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: 1px;
`;

const HashTag = styled.span` // styles are applied in <HashListContainer /> tag

`;

const HashListContainer = styled.div`
    display: flex;
    gap: 0.3em;
    justify-content: center;
    outline: none;
    font-size: 1.3rem;
    font-weight: 400;
    color: #1DA1F2;
    @media (max-width: 500px) {
        font-size: 1.2rem;
    };
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
    outline: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: .2em;
    @media (max-width: 500px) {
        font-size: 0.8rem;
    };
`;
const Userhandle = styled.p`
    font-size: 1rem;
    color: #7c7c7c;
    outline: none;
    margin-top: 0.1em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    @media (max-width: 500px) {
        font-size: 0.8rem;
    };
`;

interface SmallTextProps {
    disabled?: boolean;
    color?: string;
}
const SmallText = styled.p<SmallTextProps>`
    font-size: 1rem;
    color: ${(props) => props.disabled ? '#8c8c8c' : props.color === "primary" ? "#1DA1F2" : 'black'};
    white-space: nowrap;
    @media (max-width: 500px) {
        font-size: 0.8rem;
    };
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
    background-color: #dcdcdc;
    margin: 0.5em 0;
`;

const TweetTextInput = styled.div`
    width: 100%;
    text-align: left;
    margin-bottom: 1em;
    outline: none;
    @media (max-width: 500px) {
        font-size: 1.1rem;
        line-height: 1.6rem;
    };
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
    max-width: 600px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: white;
    box-shadow: 0px 0px 18px rgba(0, 0, 0, 0.21);
`;

const Text = styled.span`
    font-size: 1rem;
`;

const TwitterIconContainer = styled.div`
    position: absolute;
    top: .1em;
    right: .1em;
`;

interface TweetCardSimpleProps {
    userHandle: string;
    userName: string;
    userImageUrl?: string;
    tweet: string;
    limit?: number;
    imageUrl?: string;
    hashTags?: string[];
    theme?: Themes;
    timestamp?: Date;
    deviceList?: string[];
    onChange: (s: string) => any;
    onTagChange: (s: string[]) => any;
}
const TweetCardSimple: FC<TweetCardSimpleProps> = ({ userHandle, userName, userImageUrl, tweet, limit = 140, imageUrl, hashTags, theme, timestamp, deviceList, onChange, onTagChange }) => {
    const [selectedFile, setSelectedFile] = useState()
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
    const [backgroundColor, setBackgroundColor] = useState('rgb(232 211 211 / 50%)');

    const [deviceIndex, setDeviceIndex] = useState<number>(0);

    const [isVerified, setIsVerified] = useState<boolean>(false);

    const [isPadded, setIsPadded] = useState<boolean>(true);

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!selectedFile) {
            setUserImage(userImageUrl)
            return;
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setUserImage(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    useEffect(() => {
        setBackgroundColor(hueValue === 360 ? "#ffffff" : "hsla(" + ~~(hueValue) + "," + "100%," + "80%,0.2)");
    }, [hueValue]);

    const onSelectFile = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }

        // I've kept this example simple by using the first image instead of multiple
        setSelectedFile(e.target.files[0])
    }

    const handleMessageChange = () => { // Approach: https://stackoverflow.com/a/70028295
        const currTweet = tweetInputRef.current?.innerText || '';
        if (currTweet !== lastTweet.current) {
            onChange(currTweet);
        }
        lastTweet.current = tweet;
    }

    const getTagsFromStrings = (tagStr: string): string[] => {
        // matches any pattern starting with '#' and containing alphabets, numbers or underscore
        return tagStr.match(/#\w+/g) || [];
    }

    const handleTagChange = () => {
        const currTags = getTagsFromStrings(tagInputRef.current?.innerHTML || '');
        if (currTags !== lastTags.current) {
            onTagChange(currTags);
        }
        lastTags.current = hashTags;
    }

    const handleUsernameChange = () => {
        const currVal = usernameRef.current?.innerHTML || '';
        if (currVal !== lastUsername.current) {
            // do something
        }
        lastUsername.current = userName;
    }

    const handleUserhandleChange = () => {
        const currVal = userhandleRef.current?.innerHTML || '';
        if (currVal !== lastUserhandle.current) {
            // do something
        }
        lastUserhandle.current = userHandle;
    }

    const handleDownload = (type) => {
        if (type === 'png') {
            // html2canvas(document.getElementById("tweetContent")).then(function (canvas) {
            //     let dateTime = new Date();
            //     let dateTimeStr = dateTime.getFullYear() + "-" + (dateTime.getMonth() + 1) + "-" + dateTime.getDate() + " " + dateTime.getHours() + "H" + (dateTime.getMinutes() < 10 ? "0" + dateTime.getMinutes() : dateTime.getMinutes()) + "M";
            //     let link = document.createElement('a');
            //     link.download = 'tweet-export-' + dateTimeStr + '.png';
            //     link.href = canvas.toDataURL();
            //     link.click();
            // })
            const el = document.getElementById("tweetContent");
            const scale = 3;
            domtoimage.toPng(el, {
                height: el.offsetHeight * scale,
                width: el.offsetWidth * scale,
                style: {
                    transform: "scale(" + scale + ")",
                    transformOrigin: "top left",
                    width: el.offsetWidth + "px",
                    height: el.offsetHeight + "px"
                }
            }).then(function (dataUrl) {
                let dateTime = new Date();
                let dateTimeStr = dateTime.getFullYear() + "-" + (dateTime.getMonth() + 1) + "-" + dateTime.getDate() + " " + dateTime.getHours() + "H" + (dateTime.getMinutes() < 10 ? "0" + dateTime.getMinutes() : dateTime.getMinutes()) + "M";
                let link = document.createElement('a');
                link.download = 'tweet-export-' + dateTimeStr + '.png';
                link.href = dataUrl;
                link.click();
            });
        }
    }

    const handleBackgroundChange = () => {
        setHueValue((hueValue + 40) % 400);
    }

    const handleDeviceTap = () => {
        setDeviceIndex((deviceIndex + 1) % deviceList.length);
    }

    const handleVerifiedClick = () => {
        setIsVerified(!isVerified);
    }

    const hidePadding = () => {
        setIsPadded(!isPadded);
    }

    return (
        <div style={{ width: '100%' }}>
            <Row justify='center'>
                <Container isPadded={isPadded} id="tweetContent" bgColor={backgroundColor} onClick={handleBackgroundChange}>
                    <TweetContainer onClick={(e) => e.stopPropagation()}>
                        <Row align="center" margin="0.5em 0" justify='space-between'>
                            <Col size="8">
                                <Row align="center" gap={"0.5em"}>
                                    <Col justify="center" style={{ flexShrink: 0 }}>
                                        <Row>
                                            <label style={{ display: 'flex', alignItems: 'center', borderRadius: '50%', width: '100%', height: '100%' }} htmlFor="userImage">
                                                <ProfilePic imgUrl={userImage}></ProfilePic>
                                            </label>
                                            <input id="userImage" accept="image/*" style={{ display: 'none' }} type="file" onChange={onSelectFile} />
                                        </Row>
                                    </Col>
                                    <Col>
                                        <Row>
                                            <Col>
                                                <Username ref={usernameRef} onInput={handleUsernameChange} contentEditable suppressContentEditableWarning>{userName}</Username>
                                            </Col>
                                            {isVerified ?
                                                <Col style={{ display: 'flex' }}>
                                                    <VerifiedBadge width={'.9em'} fill="#1DA1F2" />
                                                </Col>
                                                : null}
                                        </Row>
                                        <Row><Userhandle ref={userhandleRef} onInput={handleUserhandleChange} contentEditable suppressContentEditableWarning>{userHandle}</Userhandle></Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <TweetTextContainer>
                                <TweetTextInput ref={tweetInputRef} onInput={handleMessageChange} contentEditable suppressContentEditableWarning>{tweet}</TweetTextInput>
                            </TweetTextContainer>
                        </Row>
                        <Row>
                            <HashListContainer ref={tagInputRef} onInput={handleTagChange} contentEditable suppressContentEditableWarning>{hashTags.map((tag, idx) => <HashTag key={tag + "_" + idx}>{"#" + tag}</HashTag>)}</HashListContainer>
                        </Row>
                        <Row margin="1em 0 0" align='center' gap="0.5em">
                            <Col><SmallText disabled>{timestamp.getHours() % 12 ? timestamp.getHours() % 12 : 12}:{timestamp.getMinutes() < 10 ? '0' + timestamp.getMinutes() : timestamp.getMinutes()} {+ (timestamp.getHours() >= 12) ? 'PM' : 'AM'}</SmallText></Col>
                            <Col><Dot /></Col>
                            <Col><SmallText disabled>{(timestamp.getDate()) + "/" + (timestamp.getMonth() + 1) + "/" + (timestamp.getFullYear())}</SmallText></Col>
                            <Col><Dot /></Col>
                            <Col><SmallText color="primary" onClick={handleDeviceTap}>Twitter for {deviceList[deviceIndex]}</SmallText></Col>
                        </Row>
                        <HR thickness='0.05em' />
                        <Row justify='space-around'>
                            <Col>
                                <ReplyIcon width={'1em'} height={'1em'} fill="#6c6c6c" />
                            </Col>
                            <Col>
                                <RetweetIcon width={'1em'} height={'1em'} fill="#6c6c6c" />
                            </Col>
                            <Col>
                                <LikeIcon width={'1em'} height={'1em'} fill="#6c6c6c" />
                            </Col>
                            <Col>
                                <ShareIcon width={'1em'} height={'1em'} fill="#6c6c6c" />
                            </Col>
                        </Row>
                        <HR thickness='0.05em' />
                        {/* <TwitterIconContainer>
                            <TwitterIcon width={'1.5em'} height={'1.5em'} fill="#1DA1F2" />
                        </TwitterIconContainer> */}
                    </TweetContainer>
                </Container>
            </Row>
            <Row margin='1em 0 .5em' justify='center' align='center'>
                <Col>
                    <label>
                        <Checkbox
                            checked={isVerified}
                            onChange={handleVerifiedClick}
                        />
                        <Text style={{ marginLeft: 8 }}>is user verified?</Text>
                    </label>
                </Col>
            </Row>

            <Row margin='1em 0 .5em' justify='center' align='center'>
                <Col>
                    <label>
                        <Checkbox
                            checked={!isPadded}
                            onChange={hidePadding}
                        />
                        <Text style={{ marginLeft: 8 }}>hide background frame?</Text>
                    </label>
                </Col>
            </Row>
            <Button onClick={() => handleDownload('png')}>Download</Button>
        </div>
    )
}
export default TweetCardSimple;