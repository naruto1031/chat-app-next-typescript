import React, { FC, useEffect, useState } from 'react';
import { GetStaticProps, NextPage } from 'next';
import { client } from '../../libs/client';
import axios from 'axios';


interface Chat {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  user_name: string;
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

interface SubmitContents {
  user_name: string;
  chat_content: string;
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const res = await client.get<ChatListResponse>({ endpoint: 'chat' });
    const contents = res.contents.reverse();
    return {
      props: {
        chat: contents,
      },
    };

  } catch (error) {
    console.error(error);
    return {
      props: {
        chat: [],
      },
    };
  }
}

const Chat: FC<{ chat_elem: Chat }> = ({ chat_elem }) => {
  return (
    <>
      <li key={chat_elem.id} style={{ listStyle: "none" }}>
        <div className='user-name'>
          {chat_elem.user_name}
        </div>
        <div className="chat-content">
          {chat_elem.chat_content}
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
    }, 2000)
    return () => clearInterval(intervalId)
  }, []);

  const [userName, setName] = useState<string>("");

  const changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }

  const [inputContents, setContents] = useState<string>("")

  const changefield = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContents(e.target.value);
  }

  const contentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userName || !inputContents) return;

    var submitContents: SubmitContents = {
      user_name: userName,
      chat_content: inputContents
    };

    try {
      const res = await axios.post(
        "https://chat.microcms.io/api/v1/chat",
        JSON.stringify(submitContents),
        {
          headers: {
            "Content-Type": "application/json",
            'X-API-KEY': process.env.API_KEY
          },
        }
      )
      if (res.status === 200 || res.status === 201) {
        console.log("ok");
      } else {
        console.error(res.data);
      }
    } catch (error) {
      console.error(error);
    }
    setName("");
    setContents("");
  }

  return (
    <main>
      <ul>
        {chat_contents.map((chat_content: Chat) => (
          <Chat key={chat_content.id} chat_elem={chat_content} />
        ))}
      </ul>
      <form method="post" action="/" onSubmit={(e) => { contentSubmit(e) }} >
        <div className="user-name">
          <h3>name</h3>
          <input type="text" value={userName} name="name" id="name" onChange={(e) => { changeName(e) }} required />
        </div>
        <div className="chat-content">
          <h3>本文</h3>
          <textarea value={inputContents} name='chat_contents' id='chat_contents' onChange={(e) => { changefield(e) }} required />
        </div>
        <input type="submit" name='submit' />
      </form>
    </main>
  );
};

export default Home;
