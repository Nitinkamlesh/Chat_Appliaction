import React, { useEffect, useRef, useState } from "react";
import { MdAttachFile, MdCamera, MdSend, MdVoiceChat } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { baseURL } from "../config/AxiosHelper";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { getMessagess } from "../services/RoomService";
const ChatPage = () => {

  const {roomId, currentUser, connected,setConnected,setRoomId,setCurrentUser} = useChatContext();
  // console.log(roomId);
  // console.log(currentUser);
  // console.log(connected);
  const navigate = useNavigate();
  useEffect(() => {
    if(!connected)
    {
          navigate("/");

    }
  },[connected,roomId,currentUser]);


  const [messages, setMessages] = useState([
   

  ]);
  const [input, setInput] = useState("");
  const inputref = useRef(null);
  const chatBoxRef = useRef(null);
  const [stompClent, setStompClient] = useState(null);


  //page init 
  //messages ko load kanre honge

  useEffect(()=>{
      async function loadMessages(){
        try {
          
          const messages = await getMessagess(roomId);
          // console.log(messages);
          setMessages(messages)

        } catch (error) {
          
        }


      }
      loadMessages()
  },[])


  //scroll down  

    useEffect(() => {
      if (chatBoxRef.current) {
      chatBoxRef.current.scroll({top: chatBoxRef.current.scrollHeight,
                                behavior:"smooth", 
      }); 
      }
      }, [messages]);


  //stompClient ko init karna hoga
        //subscribe

       useEffect(() => {
  const sock = new SockJS(`${baseURL}/chat`);
  const client = Stomp.over(sock);

  client.connect({}, () => {
    setStompClient(client);
    toast.success("connected");

    const subscription = client.subscribe(`/topic/room/${roomId}`, (message) => {
      const newMessage = JSON.parse(message.body);
      setMessages((prev) => [...prev, newMessage]);
    });

    // 🧹 CLEANUP on unmount or roomId change
    return () => {
      subscription.unsubscribe(); // ✅ unsubscribe old listener
      client.disconnect(() => {
        console.log("WebSocket disconnected");
      });
    };
  });
}, [roomId]);

        




        //send message handle

        const sendMessage = async ()=>{
          if (stompClent && connected && input.trim()) {
            console.log(input);

            const message={
              sender:currentUser,
              content:input,
              roomId:roomId
            }

            stompClent.send(`/app/sendMessage/${roomId}`,{},JSON.stringify(message));
            setInput("")
          };
        };

      /////////////////////////
        function handleLogout()
        {
          stompClent.disconnect()
          setConnected(false)
          setRoomId('')
          setCurrentUser('')

          navigate('/')
        }


  

  const fileInputRef = useRef(null); // File input ref
  const handleFileClick = () => {fileInputRef.current.click();}; // Trigger file input
  const handleFileChange = (e) => {const file = e.target.files[0];
    if (file) {
      alert(`Selected file: ${file.name}`);
      // Optionally upload or preview file here
    }
  };
    return(
        <div className=""> 
{/* This is Header  */}
<header className="fixed left-1/2 transform -translate-x-1/2 w-2/3 border dark:border-gray-700 dark:bg-gray-800 py-2 px-8 shadow flex justify-between items-center z-50">


{/* Room Name Container */}
        <div>
            <h1 className="text-l font-semibold">
                Room : <span> {roomId}</span>
            </h1>
        </div>

{/* User Name Container */}
        <div>
            <h1 className="text-l font-semibold">
            User : <span>{currentUser}</span>
            </h1>
        </div>

{/* Room Name Container */}
            <div>
                <button onClick={handleLogout} className="dark:bg-red-500 dark:hover:bg-red-700 px-3 py-3 rounded-lg">Leave Room</button>
            </div>
        </header>

{/* Input Content Container */}
<main
  ref={chatBoxRef}
  className="py-20 px-5 w-2/3 mx-auto h-screen overflow-auto bg-cover bg-center"
  style={{
backgroundImage: "url('https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1470&q=80')"
  }}
>
                {
                    messages.map((message,index)=>{
                        const isCurrentUser = message.sender.trim().toLowerCase() === currentUser.trim().toLowerCase();
                          return(
                      <div
                        key={index}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                          <div  className={`my-2 ${isCurrentUser ? 'bg-yellow-600' :'bg-green-600'} p-2 max-w-xs rounded`}>
                            <div className="flex flex-row gap-2">
                              <img className="h-10 w-10"src={'https://avatar.iran.liara.run/public/43'} alt=""/>
                              <div className=" flex flex-col gap-1">
                                <p className="text-sm font-bold">{message.sender}</p>
                                <p>{message.content}</p>
                            </div>
                          </div>
                        </div>      
                       </div>   
                          );          
})}
            </main>



{/* Input Section */}
      <div className="fixed bottom-4 w-full">
        <div className="px-4 gap-5 flex items-center justify-between rounded-lg w-2/3 mx-auto dark:bg-gray-800 h-14">
          <input 
            value={input}
            onChange={(e) => {setInput(e.target.value)}}
            type="text"
            placeholder="Type your message here..."
            className="w-full px-3 rounded h-10 dark:bg-gray-700 dark:text-white"
          />
          <div className="flex gap-1">
            <button className="h-10 w-10 flex justify-center items-center rounded-lg"><MdCamera size={22} /></button>
            <button className="h-10 w-10 flex justify-center items-center rounded-lg"><MdVoiceChat size={22} /></button>

            {/* 📎 File Upload Button */}
            <button onClick={handleFileClick} className="h-10 w-10 flex justify-center items-center rounded-lg">
              <MdAttachFile size={22} />
            </button>

            {/* Hidden Input Field */}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />

            <button onClick={sendMessage} className="dark:bg-blue-600 h-10 w-10 flex justify-center items-center rounded-lg"><MdSend size={22} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
