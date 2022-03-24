import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'

import TweetCardSimple from '../features/tweetCardSimple/TweetCardSimple'
import styles from '../styles/Home.module.css'

const IndexPage: NextPage = () => {
  const [content, setContent] = useState<string>('');
  const handleTweetChange = (tweetText: string) => setContent(tweetText);

  const [tagContent, setTagContent] = useState<string[]>([]); // array of string tokens
  const handleTagChange = (tags: string[]) => setTagContent(tags);

  return (
    <div className={styles.container}>
      <Head>
        <title>Redux Toolkit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <TweetCardSimple
          userHandle='@prakashupadhyay'
          userName='Prakash Upadhyay'
          userImageUrl='https://github.com/upadhyayprakash/upadhyayprakash.github.io/blob/master/pic-face.jpeg?raw=true'
          tweet="Write your message..."
          limit={140}
          hashTags={["hash", "tags", "here"]}
          timestamp={new Date()}
          deviceName="iPhone"
          onChange={handleTweetChange}
          onTagChange={handleTagChange}
        />
        {/* <p>{content}</p>
        <p>{tagContent.map(e => <span>{e}</span>)}</p> */}
      </header>
    </div>
  )
}

export default IndexPage
