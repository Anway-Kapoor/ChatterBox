import React from 'react'
import Userinfo from "../list/userInfo/Userinfo"
import ChatList from "../list/chatList/ChatList"

import './list.css'

const List = () => {
  return (
    <div className='list'>
      <Userinfo />
      <ChatList />
    </div>
  )
}

export default List