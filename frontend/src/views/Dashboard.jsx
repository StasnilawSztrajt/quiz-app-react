import React, { useLayoutEffect, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom';
import QuizEditLayer from '../components/QuizEditLayer';

import API_URL from '../API_URL';
import ValidationAlert from '../components/ValidationAlert';

const Dashboard = () =>{
  const history = useHistory();
  const cookies = new Cookies();

  const didMount = useRef(false)
  let validateReturn = false

  const[userInfo, setUserInfo] = useState({})
  const[userQuizzes, setUserQuizzes] = useState([])
  const[isShowQuizEditLayer, setIsShowQuizEditLayer] = useState(false)
  const[isShowQuizDeleteLayer, setIsShowQuizDeleteLayer] = useState(false)
  const[idDeleteQuiz, setIdDeleteQuiz] = useState()

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

  const[idEditQuiz, setEditQuiz] = useState()

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

  const setInputsValue = () =>{
    setValueInputTitle(questions[0].title);
    setValueInputQuestion(questions[numberQuestion].question);
    setValueInputCorrectAnswer(questions[numberQuestion].correctAnswer);
    setValueInputFirstAnswer(questions[numberQuestion].answers[0].answer);
    setValueInputSecondAnswer(questions[numberQuestion].answers[1].answer);
    setValueInputThirdAnswer(questions[numberQuestion].answers[2].answer);
  }

  useLayoutEffect(() =>{
    if(!cookies.get('jwt')){
      history.push('/login')
    }

    const fetchUser = async () =>{
      const id = await cookies.get('user').id;

      await axios.get(`${API_URL}/users/${id}`)
      .then(async res =>{
        setUserInfo(res.data);
        res.data.quizzesID.forEach(async id =>{
          await axios.get(`${API_URL}/quizzes/${id}`)
          .then(res =>{
            setUserQuizzes(prevUserQuizzes => [...prevUserQuizzes, res.data])
          })
          .catch(err => console.log(err))
        })
      })
      .catch(err => console.log(err))
    }

    fetchUser();// eslint-disable-next-line
  }, [])

  useEffect(() => {
    if(questions[0].title) setInputsValue()// eslint-disable-next-line
  }, [questions]);

  useEffect(() => {
    if(didMount.current) setInputsValue()
    else didMount.current = true// eslint-disable-next-line
  }, [numberQuestion]);

  const logout = () =>{
    console.log('siema')
    cookies.remove('jwt');
    cookies.remove('user');

    history.push('/login');
  }

  const validation = () =>{
    setValidate(false);
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
            setValidate(false);
        }, 4000)
        validateReturn = true;
        return setValidate(true);
    }

    else if(
        valueInputCorrectAnswer === valueInputFirstAnswer||
        valueInputCorrectAnswer === valueInputSecondAnswer||
        valueInputCorrectAnswer === valueInputThirdAnswer
    ){
        setValidateText('Text repeats in the answers')
        setTimeout(() =>{
            setValidate(false);
        }, 4000)
        validateReturn = true;
        return setValidate(true);
    }

    else if(
        valueInputFirstAnswer === valueInputSecondAnswer ||
        valueInputFirstAnswer === valueInputThirdAnswer ||
        valueInputFirstAnswer === valueInputCorrectAnswer
    ){
        setValidateText('Text repeats in the answers')
        setTimeout(() =>{
            setValidate(false);
        }, 4000)
        validateReturn = true;
        return setValidate(true);
    }
    else if(
        valueInputSecondAnswer === valueInputCorrectAnswer||
        valueInputSecondAnswer === valueInputFirstAnswer||
        valueInputSecondAnswer === valueInputThirdAnswer
    ){
        setValidateText('Text repeats in the answers')
        setTimeout(() =>{
            setValidate(false);
        }, 4000)
        validateReturn = true;
        return setValidate(true);
    }
    else if(
        valueInputThirdAnswer === valueInputCorrectAnswer||
        valueInputThirdAnswer === valueInputFirstAnswer||
        valueInputThirdAnswer === valueInputSecondAnswer
    ){
        setValidateText('Text repeats in the answers')
        setTimeout(() =>{
            setValidate(false);
        }, 4000)
        validateReturn = true;
        return setValidate(true);
    }
    validateReturn = false;
  }

  const toggleQuizEditLayer = (id) =>{
    setIsShowQuizEditLayer(!isShowQuizEditLayer);
    setEditQuiz(id)
    const fetchQuiz = async () =>{
      await axios.get(`${API_URL}/quizzes/${id}`)
      .then(res => {
        setQuestions(res.data.quiz)
      })
      .catch(err => console.log(err))
    }
    fetchQuiz()
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

  const saveEditedQuestion = async () =>{
    validation()

    if(validateReturn){
      return console.log('return validate')
    }

    let questionsArray = [
      {answer: valueInputFirstAnswer, correctness: ''},
      {answer: valueInputSecondAnswer, correctness: ''},
      {answer: valueInputThirdAnswer, correctness: ''},
      {answer: valueInputCorrectAnswer, correctness: ''}
    ]

    let newQuestions = questions;

    newQuestions[0] = {
      title: valueInputTitle
    }

    newQuestions[numberQuestion] = {
      question: valueInputQuestion,
      answers: questionsArray,
      correctAnswer: valueInputCorrectAnswer,
      used: false
    }

    await axios.put(`${API_URL}/quizzes/${idEditQuiz}`,{
      quiz: newQuestions
    })
    .then(res => console.log(res))
    .catch(err => console.log(err))
  }

  const toggleQuizDeleteLayer = (id) =>{
    setIsShowQuizDeleteLayer(!isShowQuizDeleteLayer)
    setIdDeleteQuiz(id)
  }

  const deleteQuiz = async () =>{
    await axios.get(`${API_URL}/users/${cookies.get('user').id}`)
    .then(async res => {
      const indexId = res.data.quizzesID.findIndex(el => el === idDeleteQuiz);
      let quizzesIDs = res.data.quizzesID;
      quizzesIDs.splice(indexId, 1);
      await axios.put(`${API_URL}/users/${cookies.get('user').id}`, {
        quizzesID: quizzesIDs
      })
      .then(res => console.log(res))
      .catch(err => console.log(err))
    })
    .catch(err => console.log(err))

    await axios.delete(`${API_URL}/quizzes/${idDeleteQuiz}`)
    .then(() => window.location.reload())
    .catch(err => console.log(err))
  }

  const quizzes = userQuizzes.map(quiz =>{
    return (
      <div className="grid-cols-1 bg-white text-black flex flex-col text-2xl mx-5 justify-center" key={quiz.id}>
        <Link className=" button-animation" to={`/quiz/${quiz.id}`}>{quiz.quiz[0].title}</Link>
        <button className="self-end mt-12" onClick={() => toggleQuizEditLayer(quiz.id)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600 button-animation" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button className="self-end" onClick={() => toggleQuizDeleteLayer(quiz.id)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600 button-animation" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    )
  })

  return(
    <div className="flex flex-col items-center text-black text-center mt-24">
      {!isShowQuizDeleteLayer ?
        <>
          <div className="dashboard-element">username: { userInfo.username }</div>
          <div className="dashboard-element">created at: { userInfo.createdAt }</div>
          <button className="dashboard-element button-animation" onClick={logout}>Logout</button>
          <div className="w-1/2 h-20vh mt-20 grid grid-cols-2">
            {quizzes}
          </div>
        </>
      :null}
      {validate ?
        <ValidationAlert validationText={validateText}/>
      : null}
      {isShowQuizDeleteLayer ?
      <div className=" absolute top-0 w-screen h-screen flex flex-col justify-center items-center bg-green-300 text-5xl">
        <h2>Are you sure ?</h2>
        <div className="flex flex-row justify-center mt-12 w-screen">
          <button className="bg-green-500 mx-4 p-8 w-1/4 text-7xl button-animation text-white" onClick={deleteQuiz}>Yes</button>
          <button className="bg-red-500 mx-4 p-3 w-1/4 text-7xl button-animation text-white" onClick={() => toggleQuizDeleteLayer('')}>No</button>
        </div>
      </div>
      :null}

      {isShowQuizEditLayer && questions[0].title ?
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
      :null}
    </div>
  )
}

export default Dashboard;