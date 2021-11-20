import React from 'react'

const Answers = ({points, questions, restartQuiz, descriptionToResult}) =>{
    return(
      <div className="w-screen mt-12 md:mt-16 lg:mt-20 xl:mt-24 lg:flex lg:justify-center lg:items-center">
        <div className="w-1/2 p-4 m-auto lg:mt-auto pb-10 bg-green-200 rounded shadow-2xl flex flex-col justify-around items-center">
          <h1 className="text-4xl mt-12">
            { points } / { questions.length - 1 }
          </h1>
          <div className="text-4xl mt-12">
            { descriptionToResult }
          </div>
          <div className='mt-12'></div>
          <button className="text-4xl create-quiz-button" onClick={ restartQuiz }>
            Try again
          </button>
        </div>
      </div>
    )
}

export default Answers;