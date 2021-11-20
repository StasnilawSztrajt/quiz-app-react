import axios from 'axios';
import React, { useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../API_URL';

import { user } from '../const-variables/cookies'

const Quizzes = ({
  quiz,
  isHomePage,
  toggleQuizEditLayer,
  toggleQuizDeleteLayer,
}) =>{
  const[username, setUsername] = useState('');

  useLayoutEffect(() => {
    const fetchUser = async () =>{
      await axios.get(`${API_URL}/users/${quiz.userID}`)
      .then(res => setUsername(res.data.username))
      .catch(err => console.log(err))
    }
    fetchUser()
  }, [quiz.userID])


  return(
    <Link to={`/quiz/${quiz.id}`} className="grid-cols-1 p-8 bg-white text-black flex flex-col text-2xl mx-4 justify-center mt-6 cursor-pointer button-animation" key={quiz.id}>
      <div className=" button-animation">{quiz.quiz[0].title}</div>
      <div className=" font-light text-base self-end">by { username }</div>
      {user === quiz.userID && !isHomePage ?
        <Link >
          <div className="flex flex-row justify-end">
            <button className="self-end mt-12" onClick={() => toggleQuizEditLayer(quiz.id)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600 button-animation" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button className="self-end" onClick={() => toggleQuizDeleteLayer(quiz.id)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600 button-animation" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </Link>
      :null}
    </Link>
  )
}

export default Quizzes;