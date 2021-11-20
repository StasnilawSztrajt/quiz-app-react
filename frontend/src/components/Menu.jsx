import React from 'react'
import { Link } from 'react-router-dom';

import { jwt } from '../const-variables/cookies'

const Menu = () =>{

  return(
    <nav className="w-screen flex justify-between text-sm sm:text-base md:text-2xl py-5  text-green-900 bg-white">
          <Link to="/" className="font-bold button-animation ml-5">
            Quizapp
          </Link>
          { jwt ?
            <div className=''>
              <Link to="/create-quiz" className="button-animation p-5 border-r-2 border-gray-100 text-green-900 hover:bg-gray-100">
                Create your own quiz
              </Link>
              <Link to="/dashboard" className="button-animation p-5 mr-5 xl:mr-10  hover:bg-gray-100">
                Dashboard
              </Link>
            </div>
            :
            <div>
              <Link to="/login" className="button-animation p-5 mr-5 xl:mr-10  hover:bg-gray-100" >
                Login in
              </Link>
            </div>
          }
    </nav>
  )
}

export default Menu;