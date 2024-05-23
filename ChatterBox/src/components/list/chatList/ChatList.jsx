import React, { useEffect, useState } from "react";
import "./chatList.css";
import AddUser from "./addUser/AddUser";
import useUserStore from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../lib/firebase";
import useChatStore from "../../../lib/chatStore";

const Chatlist = () => {
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");
  const [chats, setChats] = useState([]);

  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const data = res.data();
        if (data && data.chats) {
          // Check if data and chats exist
          const items = data.chats;
          const promises = items.map(async (item) => {
            const userDocRef = doc(db, "users", item.receiverId);
            const userDocSnap = await getDoc(userDocRef);
            const user = userDocSnap.data();
            return { ...item, user };
          });
          const chatData = await Promise.all(promises);
          setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        } else {
          console.error("No chats found in the snapshot data.");
        }
      },
      (error) => {
        console.error("Error fetching snapshot:", error);
      }
    );

    return () => unSub();
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    
    const userChats = chats.map(item => {
      const {user, ...rest} = item;

      return rest;
    })

 
    const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId)
    
    userChats[chatIndex].isSeen = true

    const userChatRef = doc(db, "userchats", currentUser.id)

    try{
      await updateDoc(userChatRef, {
        chats: userChats
      })
      changeChat(chat.chatId, chat.user);
    }
    catch(err){
      console.log(err);
    }

  };


  const filteredChat = chats.filter((c) => 
    c.user.username.toLowerCase().includes(input.toLowerCase())
)

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input placeholder="Search" type="text" onChange={(e) => setInput(e.target.value)}/>
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          className="add"
          onClick={() => setAddMode(!addMode)}
        />
      </div>
      {filteredChat.map((chat) => (
        <div
          className="item"
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
          style={{
            backgroundColor: chat?.isSeen ? "transparent" : "5183fe",
          }}
        >
            <img src={chat.user.blocked.includes(currentUser.id)
              ? "./avatar.png"
              : chat.user.avatar || "./avatar.png"}/>
            <div className="texts">
              <span>{chat.user.blocked.includes(currentUser.id)
              ? "User"
              : chat.user.username}
              </span>
              <p>{chat.lastMessage}</p>
            </div>
          </div>
      ))}
      {addMode && <AddUser />}
    </div>
  );
};

export default Chatlist;
