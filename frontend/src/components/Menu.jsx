import React from 'react'
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';


const Menu = () =>{
  const cookies = new Cookies();

  return(
    <nav className="z-10 absolute top-2 w-screen flex justify-between text-sm sm:text-base md:text-2xl px-6 sm:px-10 md:px-20 text-green-900 button-animation">
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