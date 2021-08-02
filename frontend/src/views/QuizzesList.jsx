import React, { useLayoutEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'

import API_URL from '../API_URL';

const QuizzesList = () =>{
  const[quizzes, setQuizzes] = useState([])

  useLayoutEffect(() =>{
    const fetchQuizzes = async () =>{
      await axios.get(`${API_URL}/quizzes/`)
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
      <Link
        className="
        grid-cols-1 border rounded-xl h-24 m-4 flex items-center justify-center text-md
        hover:opacity-80 duration-150 bg-gray-100 uppercase
        "
        to={`/quiz/${quiz.id}`}
        key={quiz.id}
      >
        {quiz.quiz[0].title}
      </Link>
    )
  })

  return(
    <div className="mt-10 grid grid-cols-3">{quizzesMap}</div>
  )

}

export default QuizzesList;