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
      <div className=" absolute h-70vh w-3/4 bg-red-400 flex justify-center items-center m-auto mt-28 flex-col rounded">
        <div>Number of questions: {numberQuestion}/{questions.length - 1}</div>
        <button onClick={nextNumberQuiz}>Next question</button>
        <button onClick={previousNumberQuiz}>previous question</button>
        <input
          className=" w-2/4 text-4xl p-3 rounded text-black"
          value={valueInputTitle}
          onChange={inputHandleForTitle}
          placeholder='Enter questions'
        />
        <input
          className=" w-2/4 text-4xl p-3 rounded text-black"
          value={valueInputQuestion}
          onChange={inputHandleForQuestion}
          placeholder='Enter questions'
        />
        <input
          className=" w-5/12 text-2xl p-1 mt-8 rounded text-black"
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
        <button onClick={saveEditedQuestion}>save</button>
      </div>
      <button onClick={toggleQuizEditLayer}>hide</button>
    </>
  )
}

export default QuizEditLayer;