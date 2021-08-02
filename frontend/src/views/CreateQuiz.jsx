import React, {useLayoutEffect, useEffect, useState, useRef} from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useHistory } from "react-router-dom";

import QuizEditLayer from '../components/QuizEditLayer';
import ValidationAlert from '../components/ValidationAlert';

import API_URL from '../API_URL';

const CreateQuiz = () =>{
    const history = useHistory();
    const cookies = new Cookies();

    const didMount = useRef(false);

    const[used, setUsed] = useState(false)

    const[valueInputTitle, setValueInputTitle] = useState('');
    const[valueInputQuestion, setValueInputQuestion] = useState('');
    const[valueInputCorrectAnswer, setValueInputCorrectAnswer] = useState('');
    const[valueInputFirstAnswer, setValueInputFirstAnswer] = useState('');
    const[valueInputSecondAnswer, setValueInputSecondAnswer] = useState('');
    const[valueInputThirdAnswer, setValueInputThirdAnswer] = useState('');

    let validationError = false;
    const[validation, setValidation] = useState(false);
    const[validationText, setValidationText] = useState('');

    const[questions,setQuestions] = useState([{title: ''}]);
    const[numberQuestion, setNumberQuestion] = useState(1);
    let questionsArray = [];
    let questionsObject = [];

    const [isQuizEditLayer, setIsQuizEditLayer] = useState(false);

    useLayoutEffect(() =>{
      if(!cookies.get('jwt')){
        history.push('/login')
      }// eslint-disable-next-line
    }, [])

    useEffect(() => {
      if (didMount.current) setInputsValue();
      else didMount.current = true;
      // eslint-disable-next-line
    }, [numberQuestion]);

    const inputHandleForTitle = (e) =>{
        const newValue = e.target.value;
        setValueInputTitle(newValue);
    }
    const inputHandleForQuestion = (e) =>{
        const newValue = e.target.value;
        setValueInputQuestion(newValue);
    }
    const inputHandleForCorrectAnswer = (e) =>{
        const newValue = e.target.value;
        setValueInputCorrectAnswer(newValue);
    }
    const inputHandleForFirstAnswer = (e) =>{
        const newValue = e.target.value;
        setValueInputFirstAnswer(newValue);
    }
    const inputHandleForSecondAnswer = (e) =>{
        const newValue = e.target.value;
        setValueInputSecondAnswer(newValue);
    }
    const inputHandleForThirdAnswer = (e) =>{
        const newValue = e.target.value;
        setValueInputThirdAnswer(newValue);
    }

    const validate = () =>{
        setValidation(false)
        if(
            !valueInputTitle ||
            !valueInputQuestion ||
            !valueInputCorrectAnswer ||
            !valueInputFirstAnswer ||
            !valueInputSecondAnswer ||
            !valueInputThirdAnswer
        ){
            validationError = true
            setValidationText('Complete the blank fields')
            setTimeout(() =>{
                setValidation(false)
            }, 4000)
            return setValidation(true)
        }

        else if(
          valueInputTitle.length > 60
        ){
            validationError = true
            setValidationText('The length of the title is too long')
            setTimeout(() =>{
                setValidation(false)
            }, 4000)
            return setValidation(true)
        }
        else if(
          valueInputQuestion.length > 70
        ){
            validationError = true
            setValidationText('The length of the question is too long')
            setTimeout(() =>{
                setValidation(false)
            }, 4000)
            return setValidation(true)
        }
        else if(
          valueInputCorrectAnswer.length > 110 ||
          valueInputFirstAnswer.length > 110 ||
          valueInputSecondAnswer.length > 110 ||
          valueInputThirdAnswer.length > 110
        ){
            validationError = true
            setValidationText('The length of the answer is too long')
            setTimeout(() =>{
                setValidation(false)
            }, 4000)
            return setValidation(true)
        }


        else if(
            valueInputCorrectAnswer === valueInputFirstAnswer||
            valueInputCorrectAnswer === valueInputSecondAnswer||
            valueInputCorrectAnswer === valueInputThirdAnswer
        ){
            validationError = true
            setValidationText('Text repeats in the answers')
            setTimeout(() =>{
                setValidation(false)
            }, 4000)
            return setValidation(true)
        }

        else if(
            valueInputFirstAnswer === valueInputSecondAnswer ||
            valueInputFirstAnswer === valueInputThirdAnswer ||
            valueInputFirstAnswer === valueInputCorrectAnswer
        ){
            validationError = true
            setValidationText('Text repeats in the answers')
            setTimeout(() =>{
                setValidation(false)
            }, 4000)
            return setValidation(true)
        }
        else if(
            valueInputSecondAnswer === valueInputCorrectAnswer||
            valueInputSecondAnswer === valueInputFirstAnswer||
            valueInputSecondAnswer === valueInputThirdAnswer
        ){
            validationError = true
            setValidationText('Text repeats in the answers')
            setTimeout(() =>{
                setValidation(false)
            }, 4000)
            return setValidation(true)
        }
        else if(
            valueInputThirdAnswer === valueInputCorrectAnswer||
            valueInputThirdAnswer === valueInputFirstAnswer||
            valueInputThirdAnswer === valueInputSecondAnswer
        ){
            validationError = true
            setValidationText('Text repeats in the answers')
            setTimeout(() =>{
                setValidation(false)
            }, 4000)
            return setValidation(true)
        }

        // 60 title
        // 70 question
        // 110 answers
        else{
            validationError = false
        }
    }

    const setInputsValue = () =>{
        setValueInputTitle(questions[0].title);
        setValueInputQuestion(questions[numberQuestion].question);
        setValueInputCorrectAnswer(questions[numberQuestion].correctAnswer);
        setValueInputFirstAnswer(questions[numberQuestion].answers[0].answer);
        setValueInputSecondAnswer(questions[numberQuestion].answers[1].answer);
        setValueInputThirdAnswer(questions[numberQuestion].answers[2].answer);
    }

    const toggleQuizEditLayer = () =>{
        if(questions.length === 1) return
        setIsQuizEditLayer(!isQuizEditLayer);
        setInputsValue();
    }

    const nextNumberQuiz = () =>{
      if(numberQuestion === questions.length - 1) return
      setNumberQuestion(numberQuestion + 1);
    }

    const previousNumberQuiz = () =>{
      if(numberQuestion === 1) return
      setNumberQuestion(numberQuestion - 1);
    }

    const createQuiz = async () =>{
        if(used){
            return
        }
        else{
            setUsed(true)

            const id = cookies.get('user').id

            await axios.post(`${API_URL}/quizzes`, {
                quiz: questions,
                userID: id
            })
            .then(async res => {
                let quizessArrayID = []

                await axios.get(`${API_URL}/users/${id}`)
                .then(response => {
                    if(!response.data.quizzesID){
                        quizessArrayID.push(res.data.id)
                    }
                    else{
                        quizessArrayID = response.data.quizzesID
                        quizessArrayID.push(res.data.id)
                    }

                })
                .catch(err => console.log(err))

                await axios.put(`${API_URL}/users/${id}`,{
                    quizzesID: quizessArrayID
                })
                .then(res => console.log(res.status))
                .catch(err => console.log(err))

                history.push('/dashboard')
            })
            .catch(err =>{
                console.log(err)
            })
        }
    }

    const addQuestionAndAnswers = () =>{
        validate();
        if(validationError) return;
        setValidation(false);

        questionsObject = {
            question: valueInputQuestion,
            answers: [
                {answer: valueInputFirstAnswer, correctness: ''},
                {answer: valueInputSecondAnswer, correctness: ''},
                {answer: valueInputThirdAnswer, correctness: ''},
                {answer: valueInputCorrectAnswer, correctness: ''}
            ],
            correctAnswer: valueInputCorrectAnswer,
            used: false
        }

        const newQuestions = questions;
        newQuestions[0] = {
            title: valueInputTitle
        }

        setQuestions(newQuestions)

        setQuestions(prevState =>(
            [...prevState, questionsObject]
        ))

        setValueInputQuestion('');
        setValueInputCorrectAnswer('');
        setValueInputFirstAnswer('');
        setValueInputSecondAnswer('');
        setValueInputThirdAnswer('');
    }

    const saveEditedQuestion = async () =>{
        validate()
        questionsArray = [
            {answer: valueInputFirstAnswer, correctness: ''},
            {answer: valueInputSecondAnswer, correctness: ''},
            {answer: valueInputThirdAnswer, correctness: ''},
            {answer: valueInputCorrectAnswer, correctness: ''}
        ]

        const newQuestions = questions;

        newQuestions[0] = {
            title: valueInputTitle
        }

        newQuestions[numberQuestion] = {
            question: valueInputQuestion,
            answers: questionsArray,
            correctAnswer: valueInputCorrectAnswer,
            used: false
        }

        setQuestions(newQuestions)
        console.log(questions)
    }

    return(
        <>
        {!isQuizEditLayer ?
        <div className="h-screen bg-gradient-to-b from-green-50 to-green-300 flex justify-center items-center">
          <div className="w-3/4 h-4/5 bg-green-200 rounded shadow-2xl flex flex-col items-center">
            <div className="text-center text-2xl mt-10">Counter questions: {questions.length-1}</div>
            <input
              className="input-create-answer"
              value={valueInputTitle}
              onChange={inputHandleForTitle}
              placeholder='Enter Title'
            />
            <input
              className="input-create-answer"
              value={valueInputQuestion}
              onChange={inputHandleForQuestion}
              placeholder='Enter question'
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
            <button
              className="create-quiz-button"
              onClick={addQuestionAndAnswers}
            >
              Add question
            </button>
            <button
              className="create-quiz-button"
              onClick={toggleQuizEditLayer}
            >
              Edit questions
            </button>
            <button
              className="create-quiz-button"
              onClick={createQuiz}
            >
              Create quiz
            </button>
            {validation ?
                <ValidationAlert validationText={validationText}/>
            : null}
          </div>
        </div>
        :null}

        {isQuizEditLayer ?
            <QuizEditLayer
                numberQuestion={numberQuestion}
                questions={questions}
                nextNumberQuiz={nextNumberQuiz}
                previousNumberQuiz={previousNumberQuiz}
                valueInputTitle={valueInputTitle}
                inputHandleForTitle={inputHandleForTitle}
                valueInputQuestion={valueInputQuestion}
                inputHandleForQuestion={inputHandleForQuestion}
                valueInputCorrectAnswer={valueInputCorrectAnswer}
                inputHandleForCorrectAnswer={inputHandleForCorrectAnswer}
                valueInputFirstAnswer={valueInputFirstAnswer}
                inputHandleForFirstAnswer={inputHandleForFirstAnswer}
                valueInputSecondAnswer={valueInputSecondAnswer}
                inputHandleForSecondAnswer={inputHandleForSecondAnswer}
                valueInputThirdAnswer={valueInputThirdAnswer}
                inputHandleForThirdAnswer={inputHandleForThirdAnswer}
                saveEditedQuestion={saveEditedQuestion}
                toggleQuizEditLayer={toggleQuizEditLayer}
            />
        : null}
        </>
    )
}

export default CreateQuiz