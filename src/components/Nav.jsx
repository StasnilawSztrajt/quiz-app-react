import React from 'react'
import { Link } from 'react-router-dom';

const Nav = () =>{
    return(
        <nav className="flex justify-around text-2xl">
            <Link to="/">Quizapp</Link>
            <Link to="/create-quiz">Create your own quiz</Link>
            <Link to="/login">Login in</Link>
            <Link to="/register">Register</Link>
        </nav>
    )
}

export default Nav;