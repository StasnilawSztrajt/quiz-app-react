import React from 'react'
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';


const Menu = () =>{
  const cookies = new Cookies();

  return(
    <nav className="z-10 absolute top-0 w-screen flex justify-around text-2xl">
      <Link to="/">Quizapp</Link>
      <Link to="/create-quiz">Create your own quiz</Link>
      { cookies.get('jwt') ?
        <Link to="/dashboard">Dashboard</Link>
        :
        <Link to="/login">Login in</Link>
      }
    </nav>
  )
}

export default Menu;