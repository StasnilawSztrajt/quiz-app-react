import React from 'react'

const Answers = ({checkAnswer, answer}) =>{
  return(
    <button
      key={answer.answer}
      onClick={checkAnswer}
      className={` mt-5 w-9/12 h-10 text-xl duration-150 hover:opacity-70 bg-gray-700 cursor-pointer focus:outline-none ${answer.correctness}`}
    >
      {answer.answer}
    </button>
  )
}

export default Answers;