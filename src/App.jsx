import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/user/header'
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from 'react';


function App() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <div className='header'>
        <Header />
      </div>
      <div className='content'>
        <Outlet />
      </div>
      <div className='footer'>

      </div>
    </div>
  )
}

export default App
