import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {

  const showToasts = () => {
    toast.success("Authentication successful!", {
      autoClose: 5000, 
      closeOnClick:"true"
    });
  };

  return (
    <>
      <ToastContainer position="bottom-center"  hideProgressBar="false"/>
      <h1 className="text-3xl bg-green-100 p-2 m-2">
      
        Hello Shahid!
      </h1>
      <button
        onClick={showToasts}
        className="m-2 p-4 py-2 bg-blue-500 text-white rounded"
      >
        Show Toasts
      </button>
      
    </>
  );
}

export default App;
