import React, { useState } from "react";
import chatIcon from "../assets/live-chat.png";
import toast from "react-hot-toast";
import {createRoomApi, joinChatApi } from "../services/RoomService";
import useChatContext from "../context/ChatContext";

import { useNavigate } from "react-router";

const JoinCreateChat = () => {
  const [detail, setDetail] = useState({
    roomId:"",
    userName:""
  });
  
  const { roomId, userName, setRoomId, setCurrentUser, setConnected } =
    useChatContext();
  const navigate = useNavigate();


function handleFormInputChange(event)
{
  setDetail({
    ...detail,
    [event.target.name]:event.target.value,
  });
}

function validateForm() {
  if (detail.roomId.trim() === "" || detail.userName.trim() === "") {
    toast.error("Room ID and User Name are required!");
    return false;
  }
  return true; // ✅ RETURN TRUE when valid
}


async function joinChat() {
  if (validateForm()) {
    try {
      const cleanedRoomId = detail.roomId.trim().replace("=", ""); // 👈 fix here
      const room = await joinChatApi(cleanedRoomId);
      toast.success("Enjoy The Room..");
      setCurrentUser(detail.userName);
      setRoomId(room.roomId);
      setConnected(true);
      navigate("/chat");
    } catch (error) {
      if (error.status == 400) {
        toast.error(error.response.data);
      } else {
        toast.error("Error in joining room");
      }
      console.log(error);
    }
  }
}


async function createRoom() {
    if (validateForm()) {
      //create room
      console.log(detail);
      // call api to create room on backend
      try {
        const response = await createRoomApi(detail.roomId);
        console.log(response);
        toast.success("Room Created Successfully !!");
        //join the room
        setCurrentUser(detail.userName);
        setRoomId(response.roomId);
        setConnected(true);

        navigate("/chat");

        //forward to chat page...
      } catch (error) {
        console.log(error);
        if (error.status == 400) {
          toast.error("Room  already exists !!");
        } else {
          toast("Error in creating room");
        }
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="p-10 border dark:border-gray-700 w-full max-w-md rounded-lg dark:bg-gray-800 shadow-lg flex flex-col gap-6">
        
        {/* Chat Icon */}
        <div className="flex justify-center">
          <img src={chatIcon} className="w-24 h-24" alt="Chat Icon" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-semibold text-center">
          Join Room / Create Room
        </h1>

        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block font-medium mb-2">
            Your Name
          </label>
          <input 
            onChange={handleFormInputChange}
            value={detail.userName}
            type="text"
            id="name"
            name="userName"
            placeholder="Enter your name"
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Room ID Input */}
<div className="w-full">
  <label
    htmlFor="roomId"
    className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
  >
    Room ID / New Room ID
  </label>
  <input
    type="text"
    id="roomId"
    name="roomId"
    value={detail.roomId}
    onChange={handleFormInputChange}
    placeholder="Enter Room ID"
    className="w-full px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>


        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-3">
          <button onClick={joinChat} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 hover:dark:bg-blue-700 text-white rounded-lg transition duration-300">
            Join Room
          </button>
          <button onClick={createRoom} className="px-4 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-500 hover:dark:bg-green-700 text-white rounded-lg transition duration-300">
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat;
