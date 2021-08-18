import React, { useLayoutEffect, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useHistory } from "react-router-dom";
import QuizEditLayer from '../components/QuizEditLayer';
import Quizzes from '../components/Quizzes';

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
      },
      {
        headers: {
          Authorization: `Bearer ${cookies.get('jwt')}`
        }
      })
      .then(res => console.log(res))
      .catch(err => console.log(err))
    })
    .catch(err => console.log(err))

    await axios.delete(`${API_URL}/quizzes/${idDeleteQuiz}`,
    {
      headers: {
        Authorization: `Bearer ${cookies.get('jwt')}`
      }
    })
    .then(() => window.location.reload())
    .catch(err => console.log(err))

  }

  const quizzes = userQuizzes.map(quiz =>{
    return (
      <Quizzes
        quiz={quiz}
        isHomePage={false}
        toggleQuizEditLayer={() => toggleQuizEditLayer(quiz.id)}
        toggleQuizDeleteLayer={() => toggleQuizDeleteLayer(quiz.id)}
      />
    )
  })

  return(
    <div className="flex flex-col items-center text-black text-center mt-24">
      {!isShowQuizDeleteLayer && !isShowQuizEditLayer ?
        <>
          <div className="dashboard-element">
            username: { userInfo.username }
          </div>
          <div className="dashboard-element">
            created at: { userInfo.createdAt }
          </div>
          <button className="dashboard-element button-animation" onClick={logout}>
            Logout
          </button>
          <div className="w-5/6 lg:w-1/2 h-20vh mt-20 grid grid-cols-1 xl:grid-cols-2">
            {quizzes}
          </div>
        </>
      :null}
      {validate ?
        <ValidationAlert validationText={validateText}/>
      : null}
      {isShowQuizDeleteLayer && !isShowQuizEditLayer ?
      <div className=" absolute top-0 w-screen h-screen flex flex-col justify-center items-center bg-green-300 text-5xl">
        <h2>Are you sure ?</h2>
        <div className="flex flex-row justify-center mt-12 w-screen">
          <button
            className="bg-green-900 mx-2 md:mx-4 p-6 lg:p-4 w-1/4 lg:w-1/6 text-5xl button-animation text-white"
            onClick={deleteQuiz}
          >
            Yes
          </button>
          <button
            className="bg-red-900 mx-2 md:mx-4 p-6 lg:p-4 w-1/4 lg:w-1/6 text-5xl button-animation text-white"
            onClick={() => toggleQuizDeleteLayer('')}
          >
            No
          </button>
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
          saveEditedQuestion={saveEditedQuestion}
          toggleQuizEditLayer={toggleQuizEditLayer}

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
        />
      :null}
    </div>
  )
}

export default Dashboard;