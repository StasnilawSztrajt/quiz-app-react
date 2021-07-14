import React, {useEffect, useLayoutEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'

const QuizzesList = () =>{
  const[quizzes, setQuizzes] = useState([])
  const API_URL  = 'http://localhost:1337'

  useLayoutEffect(() =>{
    const fetchQuizzes = async () =>{
      const result = await axios.get(`${API_URL }/quizzes/`)
      setQuizzes(result.data)
    }
    fetchQuizzes()
  }, [])


  const quizzesMap = quizzes.map(quiz =>{
    return (
    <Link
      className="
      grid-cols-1 border rounded-3xl h-48 m-10 flex items-center justify-center text-2xl text-center
      hover:opacity-80 hover:bg-gray-900 duration-150"
      to={`/quiz/${quiz.id}`}
      key={quiz.id}
    >
      {quiz.quiz[0].title}
    </Link>
    )
  })

  return(
    <div className="text-white grid grid-cols-4 mt-20">
      {quizzesMap}
    </div>
  )

}

export default QuizzesList;