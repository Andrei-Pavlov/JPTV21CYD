import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home.js';
import Login from './Login.js'
import Logout from './Logout.js'
import { jwtDecode } from "jwt-decode";
import ApplicationList from '../actions/ApplicationList.js';
import FileUpload from './FileUpload.js';
import Security from './Security.js';

export default function Content() {
  const [state, setState] = React.useState(false);
  const [role, setRole] = React.useState('');
  React.useEffect(() => {
    getMe();
  }, [])

  const getMe = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
        setState(true);
      } else {
        setState(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main className='flex-shrink-0'>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route path="/security" element={<Security/>} />

        {state && role === 'admin'? (
          <>
            <Route path='/application' element={<ApplicationList/>}/>
            <Route path='/upload' element={<FileUpload/>}/>
          </>
        ) : (
          <>
          </>
        )}
        <Route path='/login' element={<Login/>}/>
        <Route path='/logout' element={<Logout/>}/>
      </Routes>
    </main>
  )
}
