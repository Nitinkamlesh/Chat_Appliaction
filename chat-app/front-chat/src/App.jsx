import { useState } from "react";
import React from "react";
import "./App.css";
import toast from "react-hot-toast";
import JoinCreateChat from "./components/joinCreateChat";

function App()
{
  const[count, setCount] = useState(0);

  return(
    <div>
     <JoinCreateChat/>
    </div>
  );
}

export default App