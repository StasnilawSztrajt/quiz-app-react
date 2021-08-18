import React from 'react'

const QuizEditLayer = ({
  numberQuestion,
  questions,
  nextNumberQuiz,
  previousNumberQuiz,
  valueInputTitle,
  inputHandleForTitle,
  valueInputQuestion,
  inputHandleForQuestion,
  valueInputCorrectAnswer,
  inputHandleForCorrectAnswer,
  valueInputFirstAnswer,
  inputHandleForFirstAnswer,
  valueInputSecondAnswer,
  inputHandleForSecondAnswer,
  valueInputThirdAnswer,
  inputHandleForThirdAnswer,
  saveEditedQuestion,
  toggleQuizEditLayer
}) =>{
  return(
    <>
      <div className=" z-0 absolute top-0 w-screen h-screen flex justify-center items-center">
        <div className="w-3/4 h-4/5 bg-green-200 rounded shadow-2xl flex flex-col items-center">
          <div className="text-center text-2xl mt-10">Number of questions: {numberQuestion}/{questions.length - 1}</div>
          <div className="flex flex-row justify-center w-4/5">
            <button className="create-quiz-button w-1/2" onClick={nextNumberQuiz}>Next</button>
            <button className="create-quiz-button w-1/2" onClick={previousNumberQuiz}>Previous</button>
          </div>
          <input
            className="input-create-answer"
            value={valueInputTitle}
            onChange={inputHandleForTitle}
            placeholder='Enter questions'
          />
          <input
            className="input-create-answer"
            value={valueInputQuestion}
            onChange={inputHandleForQuestion}
            placeholder='Enter questions'
          />
          <input
            className="input-create-answer"
            value={valueInputCorrectAnswer}
            onChange={inputHandleForCorrectAnswer}
            placeholder="Enter correct answer"
          />
          <input
            className=" input-create-answer"
            value={valueInputFirstAnswer}
            onChange={inputHandleForFirstAnswer}
            placeholder="Enter answer"
          />
          <input
            className=" input-create-answer"
            value={valueInputSecondAnswer}
            onChange={inputHandleForSecondAnswer}
            placeholder="Enter answer"
          />
          <input
            className=" input-create-answer"
            value={valueInputThirdAnswer}
            onChange={inputHandleForThirdAnswer}
            placeholder="Enter answer"
          />
          <button className="create-quiz-button" onClick={saveEditedQuestion}>save</button>
          <button className="create-quiz-button" onClick={toggleQuizEditLayer}>hide</button>
        </div>
      </div>
    </>
  )
}

export default QuizEditLayer;