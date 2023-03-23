import React from 'react';
import { GetStaticProps, NextPage } from 'next';
import { client } from '../../libs/client';

type Chat = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  use_name: string;
  chat_content: string;
};

type ChatProps = {
  chat: Chat[];
};

type ChatListResponse = {
  contents: Chat[];
  totalCount: number;
  offset: number;
  limit: number;
};

export const getStaticProps: GetStaticProps<ChatProps> = async () => {
  const data: Chat[] = await client.get<ChatListResponse>({
    endpoint: 'chat',
  }).then((res) => {
    return res.contents;
  });

  // 逆順に並び替え
  data.reverse();

  return {
    props: {
      chat: data,
    },
  };
};

const Home: NextPage<ChatProps> = ({ chat }) => {
  return (
    <main>
      <ul>
        {chat.map((chat: Chat) => (
          <React.Fragment key={chat.id}>
            <li key={chat.id} style={{listStyle:"none"}}>
              <div className='user-name'>
                {chat.use_name}
              </div>
              <div>
              </div>
              <div className='chat-content'>
                {chat.chat_content}
              </div>
            </li>
            <hr />
          </React.Fragment>
        ))}
      </ul>
      <form action="" method="post">
        <input type="text" name="" id="" />
      </form>
    </main>
  );
};

export default Home;
