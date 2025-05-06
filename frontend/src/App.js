import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Content from './components/Content';
import Profile from './components/Profile';
import Login from './components/Login';
import Logout from './components/Logout';
import ApplicationList from './actions/ApplicationList';
import FileUpload from './components/FileUpload';
import Home from './pages/Home';
import Security from './components/Security';

function App() {
  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/logout" element={<Logout/>} />
        <Route path="/application" element={<ApplicationList/>} />
        <Route path="/upload" element={<FileUpload/>} />
        <Route path="/security" element={<Security/>} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
