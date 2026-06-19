import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Clock from "./pages/Clock";
import Toogle from "./pages/Toogle";
import Nopage from "./pages/Nopage";
import USEREF from "./pages/USEREF";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Scrollpage from "./pages/Scrollpage";
import InputFocus from "./pages/inputfocus";
import MEMO from "./pages/MEMO";
import Crousel2 from "./pages/Crousel2";
import TodoLister from"./pages/TodoLister"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<TodoLister/>} />
      </Routes>
    </BrowserRouter>
  );
}
