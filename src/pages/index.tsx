import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

import TweetCardSimple from "../features/tweetCardSimple/TweetCardSimple";
import styles from "../styles/Home.module.css";

const prefix = process.env.NEXT_PUBLIC_BASE_PATH || "";

const IndexPage: NextPage = () => {
  const [content, setContent] = useState<string>("");
  const handleTweetChange = (tweetText: string) => setContent(tweetText);

  const [tagContent, setTagContent] = useState<string[]>([]); // array of string tokens
  const handleTagChange = (tags: string[]) => setTagContent(tags);

  return (
    <div className={styles.container}>
      <Head>
        <title>Fake Tweet Generator</title>
        <link rel="icon" href={prefix + "/favicon.ico"} />
      </Head>
      <header className={styles.header}>
        <TweetCardSimple
          userHandle="@trumpjudd_147"
          userName="Judd Trump"
          userImageUrl={prefix + "/faces/add-face.png"}
          tweet="Write your message.."
          limit={140}
          hashTags={["hash", "tags", "here"]}
          timestamp={new Date()}
          deviceList={["iPhone", "Android", "Web App"]}
          onChange={handleTweetChange}
          onTagChange={handleTagChange}
        />
        {/* <p>{content}</p> */}
        {/* <p>{tagContent.map(e => <span>{e}</span>)}</p> */}
      </header>
    </div>
  );
};

export default IndexPage;
