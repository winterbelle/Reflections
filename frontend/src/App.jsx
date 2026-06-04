import { BrowserRouter, Routes, Route } from 'react-router';

import './App.css'
import Header from './components/NavBar/Header.jsx'
import Community from './Pages/community.jsx'
import PostCard from './components/Posts/PostCard.jsx';
import Chatbot from './components/Chatbot.jsx';


function App() {
  return (
    <>
      <BrowserRouter>
        <Header />

      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/community" element={<Community />} />

        <Route path="posts/:id" element={<PostCard />} />
      </Routes>
      <Chatbot />
      </BrowserRouter>
    </>
  );
}

export default App;