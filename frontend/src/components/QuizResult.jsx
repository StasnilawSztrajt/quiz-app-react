import React from 'react'

const Answers = ({points, questions, restartQuiz, descriptionToResult}) =>{
    return(
      <div className="h-screen w-screen lg:flex lg:justify-center lg:items-center">
        <div className="w-3/4 h-3/5 p-4 mt-28 m-auto lg:mt-auto pb-10 bg-green-200 rounded shadow-2xl">
          <h1 className="text-3xl">
            { points } / { questions.length - 1 }
          </h1>
          <div className="text-3xl">
            { descriptionToResult }
          </div>
          <button className="text-4xl create-quiz-button" onClick={ restartQuiz }>
            Try again
          </button>
        </div>
      </div>
    )
}

export default Answers;