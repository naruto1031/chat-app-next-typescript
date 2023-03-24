import React, { FC, useEffect, useState } from 'react';
import { GetStaticProps, NextPage } from 'next';
import { client } from '../../libs/client';

interface Chat {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  use_name: string;
  chat_content: string;
}

interface HomeProps {
  chat: Chat[];
}

interface ChatListResponse {
  contents: Chat[];
  totalCount: number;
  offset: number;
  limit: number;
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const data = await client.get<ChatListResponse>({
    endpoint: 'chat',
  }).then((res) => {
    return res.contents.reverse();
  });

  return {
    props: {
      chat: data,
    },
  };
};

const Chat: FC<{ chat: Chat }> = ({ chat }) => {

  return (
    <>
      <li key={chat.id} style={{ listStyle: "none" }}>
        <div className='user-name'>
          {chat.use_name}
        </div>
        <div className="chat-content">
          {chat.chat_content}
        </div>
      </li>
      <hr />
    </>
  )
}

const Home: NextPage<HomeProps> = ({ chat }) => {
  const [chat_contents, setChat] = useState<Chat[]>(chat);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const res = await client.get<ChatListResponse>({
        endpoint: 'chat',
      })
      if (res.contents) {
        setChat(res.contents.reverse())
      }
    }, 10000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <main>
      <ul>
        {chat_contents.map((chat_content: Chat) => (
          <Chat key={chat_content.id} chat={chat_content} />
        ))}
      </ul>
      <form action="" method="post">
        <input type="text" name="" id="" />
      </form>
    </main>
  );
};

export default Home;
