import React from 'react'

const Answers = ({points, questions, restartQuiz, descriptionToResult}) =>{
    return(
        <div className=" bg-gray-900 w-2/4 h-2/4 flex flex-col justify-center items-center">
            <h1 className=" text-5xl"> { points } / { questions.length - 1 } </h1>
            {/* <div className=""> { descriptionToResult } </div> */}
            <button className=" text-3xl mt-10 border p-5" onClick={ restartQuiz }>Try again</button>
        </div>
    )
}

export default Answers;