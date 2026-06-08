import { BrowserRouter, Routes, Route, } from 'react-router';
import { Link } from "react-router";

import './App.css'
import Header from './components/NavBar/Header.jsx'
import Community from './Pages/community.jsx'
import PostCard from './components/posts/PostCard.jsx';
import Chatbot from './components/Chatbot.jsx';
import CreatePost from './Pages/CreatePost.jsx';
import Home from "./Pages/Home";
import Resources from "./Pages/Resources";


function App() {
  return (
    <>
      <BrowserRouter>
        <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/community" element={<Community />} />
        <Route path="/posts/:id" element={<PostCard />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/resources" element={<Resources />} />
      </Routes>
      <Chatbot />
      </BrowserRouter>
    </>
  );
}

export default App;