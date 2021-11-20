import React, { useLayoutEffect, useState} from 'react';
import axios from 'axios'
import Quizzes from '../components/Quizzes.jsx'

import API_URL from '../API_URL';

const QuizzesList = () =>{
  const[quizzes, setQuizzes] = useState([])

  useLayoutEffect(() =>{
    const fetchQuizzes = async () =>{
      await axios.get(`${API_URL}/quizzes`)
      .then(res =>{
        setQuizzes(res.data)
      })
      .catch(err =>{
        console.log(err)
      })
    }
    fetchQuizzes()
  }, [])


  const quizzesMap = quizzes.map(quiz =>{
    return (
        <Quizzes
          key={quiz.id}
          quiz={quiz}
          isHomePage={true}
          className=""
        />
    )
  })

  return <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">{quizzesMap}</div>

}

export default QuizzesList;