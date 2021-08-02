import React from 'react'

const Answers = ({checkAnswer, answer}) =>{
  return(
    <button
      key={answer.answer}
      onClick={checkAnswer}
      className={`
        outline-none w-4/6 mt-6 p-4 text-xl bg-gray-100 rounded-2xl transform hover:opacity-90 hover:scale-105
        focus:outline-none duration-150 ${answer.correctness}
      `}
    >
      {answer.answer}
    </button>
  )
}

export default Answers;