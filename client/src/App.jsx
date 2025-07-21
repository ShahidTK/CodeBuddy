import { use, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar.jsx';
import {HomePage, FeatureCard} from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import CodeChat from './pages/CodeChat.jsx';
import {Routes, Route, Navigate} from "react-router-dom";
import { useAuthStore } from './store/useAuthStore.js';
import { Loader } from "lucide-react"
import useThemeStore  from "./store/useThemeStore.js";



function App() {

  const { theme } = useThemeStore();
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();

  useEffect(() => {
    checkAuth()
  }, [checkAuth]);

  // for loading icon
  if(isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className='size-10 animate-spin'/>
    </div>
  )

  
  return (
    <div >
      <ToastContainer position="bottom-center"  hideProgressBar="false"/>
      <Navbar/>
      <Routes>
        <Route path='/' element={authUser?<HomePage/>: <Navigate to="/login" />}/>
        <Route path='/signup' element={!authUser? <SignUpPage/>: <Navigate to="/" />} />
        <Route path='/login' element={!authUser? <LoginPage/>: <Navigate to="/" />} />

        <Route path='/profile' element={authUser? <ProfilePage/>: <Navigate to="/login" />} />
        <Route path="/CodeEditor" element={<CodeChat />} />

      </Routes>

      
      </div>
  );
}

export default App;
