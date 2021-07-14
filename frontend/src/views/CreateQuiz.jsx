import React, {useEffect, useLayoutEffect, useState, useRef} from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useHistory } from "react-router-dom";

import QuizEditLayer from '../components/QuizEditLayer';


const API_URL = 'http://localhost:1337'

const CreateQuiz = () =>{
    const history = useHistory();
    const cookies = new Cookies();

    const[used, setUsed] = useState(false)

    const[valueInputTitle, setValueInputTitle] = useState('');
    const[valueInputQuestion, setValueInputQuestion] = useState('');
    const[valueInputCorrectAnswer, setValueInputCorrectAnswer] = useState('');
    const[valueInputFirstAnswer, setValueInputFirstAnswer] = useState('');
    const[valueInputSecondAnswer, setValueInputSecondAnswer] = useState('');
    const[valueInputThirdAnswer, setValueInputThirdAnswer] = useState('');

    const[validate, setValidate] = useState(false);
    const[validateText, setValidateText] = useState('');

    const[questions,setQuestions] = useState([{title: ''}]);
    const[numberQuestion, setNumberQuestion] = useState(1);
    let questionsArray = [];
    let questionsObject = [];

    const [isQuizEditLayer, setIsQuizEditLayer] = useState(false);

    useLayoutEffect(() =>{
        if(!cookies.get('jwt')){
            history.push('/login')
        }
    }, [])

    // useEffect(() => {
    //     setInputsValue()
    // }, [numberQuestion]);

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

    const validation = () =>{
        setValidate(false)
        if(
            !valueInputTitle ||
            !valueInputQuestion ||
            !valueInputCorrectAnswer ||
            !valueInputFirstAnswer ||
            !valueInputSecondAnswer ||
            !valueInputThirdAnswer
        ){
            setValidateText('Complete the blank fields')
            setTimeout(() =>{
                setValidate(false)
            }, 4000)
            return setValidate(true)
        }

        else if(
            valueInputCorrectAnswer === valueInputFirstAnswer||
            valueInputCorrectAnswer === valueInputSecondAnswer||
            valueInputCorrectAnswer === valueInputThirdAnswer
        ){
            setValidateText('Text repeats in the answers')
            setTimeout(() =>{
                setValidate(false)
            }, 4000)
            return setValidate(true)
        }

        else if(
            valueInputFirstAnswer === valueInputSecondAnswer ||
            valueInputFirstAnswer === valueInputThirdAnswer ||
            valueInputFirstAnswer === valueInputCorrectAnswer
        ){
            setValidateText('Text repeats in the answers')
            setTimeout(() =>{
                setValidate(false)
            }, 4000)
            return setValidate(true)
        }
        else if(
            valueInputSecondAnswer === valueInputCorrectAnswer||
            valueInputSecondAnswer === valueInputFirstAnswer||
            valueInputSecondAnswer === valueInputThirdAnswer
        ){
            setValidateText('Text repeats in the answers')
            setTimeout(() =>{
                setValidate(false)
            }, 4000)
            return setValidate(true)
        }
        else if(
            valueInputThirdAnswer === valueInputCorrectAnswer||
            valueInputThirdAnswer === valueInputFirstAnswer||
            valueInputThirdAnswer === valueInputSecondAnswer
        ){
            setValidateText('Text repeats in the answers')
            setTimeout(() =>{
                setValidate(false)
            }, 4000)
            return setValidate(true)
        }
    }

    const addQuestionAndAnswers = async () =>{
        setValidate(false)
        validation()

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

        await setQuestions(newQuestions)

        await setQuestions(prevState =>(
            [...prevState, questionsObject]
        ))

        setValueInputQuestion('');
        setValueInputCorrectAnswer('');
        setValueInputFirstAnswer('');
        setValueInputSecondAnswer('');
        setValueInputThirdAnswer('');
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
        if(numberQuestion === questions.length - 1){
            return
        }
        setNumberQuestion(numberQuestion + 1)
    }

    const previousNumberQuiz = () =>{
        if(numberQuestion === 1){
            return
        }
        setNumberQuestion(numberQuestion - 1)
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

    const saveEditedQuestion = async () =>{
        validation()

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
            <div className=" h-70vh w-3/4 bg-red-400 flex justify-center items-center m-auto mt-28 flex-col rounded">
            <div>Counter questions: <br /> {questions.length-1}</div>
            <input
                className=" w-2/4 text-4xl p-3 rounded text-black"
                value={valueInputTitle}
                onChange={inputHandleForTitle}
                placeholder='Enter title'
            />
            <input
                className=" w-2/4 text-4xl p-3 rounded text-black"
                value={valueInputQuestion}
                onChange={inputHandleForQuestion}
                placeholder='Enter question'
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
            <button className=" text-white p-2 mt-10 border-2 hover:bg-white hover:text-black duration-150" onClick={addQuestionAndAnswers}>
                add questions
            </button>
            <button onClick={createQuiz} className=" text-white p-2 mt-10 border-2 hover:bg-white hover:text-black duration-150">
                Create quiz
            </button>
            <button onClick={toggleQuizEditLayer}>Edit questions</button>
            {validate ?
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded absolute top-3/4 mt-40" role="alert">
                    <strong className="font-bold">{validateText}</strong>
                </div>
            : null}
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