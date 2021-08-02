import React from 'react'

const Answers = ({points, questions, restartQuiz, descriptionToResult}) =>{
    return(
        <div className="w-3/4 h-2/3 bg-green-200 rounded shadow-2xl flex flex-col text-center justify-around focus:outline-none">
            <h1 className="text-5xl"> { points } / { questions.length - 1 } </h1>
            <div className="text-3xl"> { descriptionToResult } </div>
            <button className="text-5xl" onClick={ restartQuiz }>Try again</button>
        </div>
    )
}

export default Answers;