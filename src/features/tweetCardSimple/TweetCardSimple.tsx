import { FC, useEffect, useRef, useState } from 'react';
import styled from 'styled-components'
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import { Col, Row } from '../../components/commons';
import ReplyIcon from '../../../public/icons/ReplyIcon.svg';
import RetweetIcon from '../../../public/icons/RetweetIcon.svg';
import LikeIcon from '../../../public/icons/LikeIcon.svg';
import ShareIcon from '../../../public/icons/ShareIcon.svg';
import TwitterIcon from '../../../public/icons/TwitterIcon.svg';

enum Themes {
    Dark,
    Light,
    Moonlight
}

const Container = styled.div`
    padding: 4em 4em;
    width: 100%;
    background-color: #e6e6e6;
    display: flex;
    align-items: center;
    justify-content: center;
    @media (max-width: 425px) {
        padding: 4em 2em;
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
    font-weight: 600;
    letter-spacing: 1px;
`;

const HashTag = styled.span`
    font-size: 1.3rem;
    font-weight: 400;
    color: #1DA1F2;
    @media (max-width: 425px) {
        font-size: 1.2rem;
    };
`;

const HashListContainer = styled.div`
    display: flex;
    gap: 0.3em;
    justify-content: center;
    outline: none;
`;

const ProfilePic = styled.img`
    width: 2em;
    height: 2em;
    border-radius: 50%;
    border: none;
    background-size: contain;
    background-color: #dcdcdc;
`;

const Username = styled.p`
    font-weight: 600;
    font-size: 1rem;
    outline: none;
    @media (max-width: 425px) {
        font-size: 0.8rem;
    };
`;
const Userhandle = styled.p`
    font-size: 1rem;
    color: #7c7c7c;
    outline: none;
    @media (max-width: 425px) {
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
    @media (max-width: 425px) {
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
    color: #262626;
    width: 100%;
    font-family: Ubuntu, Arial;
    font-size: 1.4rem;
    line-height: 2rem;
    font-weight: 400;
    text-align: left;
    margin-bottom: 1em;
    outline: none;
    @media (max-width: 425px) {
        font-size: 1.1rem;
        line-height: 1.6rem;
    };
`;

const TweetContainer = styled.div`
    padding: 1em 1em;
    width: 100%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: white;
    box-shadow:
        0px 0px 2.2px rgba(0, 0, 0, 0.034),
        0px 0px 5.3px rgba(0, 0, 0, 0.048),
        0px 0px 10px rgba(0, 0, 0, 0.06),
        0px 0px 17.9px rgba(0, 0, 0, 0.072),
        0px 0px 33.4px rgba(0, 0, 0, 0.086),
        0px 0px 80px rgba(0, 0, 0, 0.12);
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
    deviceName?: string;
    onChange: (s: string) => any;
    onTagChange: (s: string[]) => any;
}
const TweetCardSimple: FC<TweetCardSimpleProps> = ({ userHandle, userName, userImageUrl, tweet, limit = 140, imageUrl, hashTags, theme, timestamp, deviceName, onChange, onTagChange }) => {
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

    const onSelectFile = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }

        // I've kept this example simple by using the first image instead of multiple
        setSelectedFile(e.target.files[0])
    }

    const handleChange = () => { // Approach: https://stackoverflow.com/a/70028295
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
            toJpeg(document.getElementById("tweetContent"), {}).then(function (dataUrl) {
                var link = document.createElement('a');
                link.download = 'tweet-export' + (new Date().getTime()) + '.png';
                link.href = dataUrl;
                link.click();
            })
        }
    }

    return (
        <div style={{ width: '100%' }}>
            <Row justify='center'>
                <Container id="tweetContent">
                    <TweetContainer>
                        <Row align="center" margin="0.5em 0" justify='space-between'>
                            <Col>
                                <Row align="center" gap={"0.5em"}>
                                    <Col justify="center">
                                        <Row><label style={{ display: 'flex', alignItems: 'center', borderRadius: '50%', width: '100%', height: '100%' }} htmlFor="userImage"><ProfilePic src={userImage}></ProfilePic></label><input id="userImage" style={{ display: 'none' }} type="file" onChange={onSelectFile} /></Row>
                                    </Col>
                                    <Col>
                                        <Row><Username ref={usernameRef} onInput={handleUsernameChange} contentEditable>{userName}</Username></Row>
                                        <Row><Userhandle ref={userhandleRef} onInput={handleUserhandleChange} contentEditable>{userHandle}</Userhandle></Row>
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <TwitterIcon width={'2em'} height={'2em'} fill="#1DA1F2" />
                            </Col>
                        </Row>
                        <Row>
                            <TweetTextInput suppressContentEditableWarning={true} ref={tweetInputRef} onInput={handleChange} contentEditable>{tweet}</TweetTextInput>
                        </Row>
                        <Row>
                            <HashListContainer ref={tagInputRef} onInput={handleTagChange} contentEditable>{hashTags.map((tag, idx) => <HashTag key={tag + "_" + idx}>{"#" + tag}</HashTag>)}</HashListContainer>
                        </Row>
                        <Row margin="1em 0 0" align='center' gap="0.5em">
                            <Col><SmallText disabled>{timestamp.getHours() % 12 ? timestamp.getHours() % 12 : 12}:{timestamp.getMinutes() < 10 ? '0' + timestamp.getMinutes() : timestamp.getMinutes()} {+ (timestamp.getHours() >= 12) ? 'PM' : 'AM'}</SmallText></Col>
                            <Col><Dot /></Col>
                            <Col><SmallText disabled>{(timestamp.getDate()) + "/" + (timestamp.getMonth() + 1) + "/" + (timestamp.getFullYear())}</SmallText></Col>
                            <Col><Dot /></Col>
                            <Col><SmallText color="primary">Twitter for {deviceName}</SmallText></Col>
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
                    </TweetContainer>
                </Container>
            </Row>
            <Button onClick={() => handleDownload('png')}>Export as PNG</Button>
        </div>
    )
}
export default TweetCardSimple;