import React, {useState} from 'react'


const CreateQuiz = () =>{
    const[valueInputQuestion, setValueInputQuestion] = useState('');
    const[valueInputCorrectAnswer, setValueInputCorrectAnswer] = useState('');
    const[valueInputFirstAnswer, setValueInputFirstAnswer] = useState('');
    const[valueInputSecondAnswer, setValueInputSecondAnswer] = useState('');
    const[valueInputThirdAnswer, setValueInputThirdAnswer] = useState('');

    const[validate, setValidate] = useState(false)
    const[validateText, setValidateText] = useState('')

    const[questions,setQuestions] = useState([])
    const[numberQuestion, setNumberQuestion] = useState(0)
    const[quiz,setQuiz] = useState([])
    let questionsArray = []
    let questionsObject = []

    const [isEditQuestions, setIsEditQuestions] = useState(false)

    const inputHandlerToQuestion = (e) =>{
        const newValue = e.target.value;
        setValueInputQuestion(newValue);
    }
    const inputHandlerToCorrectAnswer = (e) =>{
        const newValue = e.target.value;
        setValueInputCorrectAnswer(newValue);
    }
    const inputHandlerToFirstAnswer = (e) =>{
        const newValue = e.target.value;
        setValueInputFirstAnswer(newValue);
    }
    const inputHandlerToSecondAnswer = (e) =>{
        const newValue = e.target.value;
        setValueInputSecondAnswer(newValue);
    }
    const inputHandlerToThirdAnswer = (e) =>{
        const newValue = e.target.value;
        setValueInputThirdAnswer(newValue);
    }

    const addQuestionAndAnswers = async () =>{
        setValidate(false)
        if(
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

        if(
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

        if(
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
        if(
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
        if(
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

        // for(let i=questionsArray.length-1; i>0; i--) {
        //     let j = Math.floor(Math.random() * (i + 1));
        //     let temp = questionsArray[i];
        //     questionsArray[i] = questionsArray[j];
        //     questionsArray[j] = temp;
        // }

        questionsArray = [
            valueInputFirstAnswer,
            valueInputSecondAnswer,
            valueInputThirdAnswer,
            valueInputCorrectAnswer
        ]

        questionsObject = {
            question: valueInputQuestion,
            answers: questionsArray,
            correctAnswer: valueInputCorrectAnswer,
            uses: 0
        }

        await setQuestions(prevState =>(
            [...prevState, questionsObject]
        ))


    }

    const createQuiz = async () =>{
        // wysylanie danych postem do strapi
        await setQuiz(questions);
        console.log(quiz);
    }

    const showEditQuestions = () =>{
        setIsEditQuestions(true);
        setValueInputQuestion(quiz[numberQuestion].question);
        setValueInputCorrectAnswer(quiz[numberQuestion].correctAnswer);
        setValueInputFirstAnswer(quiz[numberQuestion].answers[0]);
        setValueInputSecondAnswer(quiz[numberQuestion].answers[1]);
        setValueInputThirdAnswer(quiz[numberQuestion].answers[2]);
    }

    const saveEditedQuiz = async () =>{
        console.log(questions)

        questionsArray = [
            valueInputFirstAnswer,
            valueInputSecondAnswer,
            valueInputThirdAnswer,
            valueInputCorrectAnswer
        ]

        let newQuestions = questions;
        newQuestions[numberQuestion] = {
            question: valueInputQuestion,
            answers: questionsArray,
            correctAnswer: valueInputCorrectAnswer,
            uses: 0
        }

        setQuestions(newQuestions)
        console.log(questions)
    }

    const hideEditQuestions = () =>{
        setIsEditQuestions(false)
    }



    return(
        <div>
        {!isEditQuestions ?
        <div className=" h-70vh w-3/4 bg-red-400 flex justify-center items-center m-auto mt-28 flex-col rounded">
            <div>Counter questions: <br /> {questions.length}</div>
            <input
                className=" w-2/4 text-4xl p-3 rounded text-black"
                value={valueInputQuestion}
                onChange={inputHandlerToQuestion.bind(this)}
                placeholder='Enter questions'
            />
            <input
                className=" w-5/12 text-2xl p-1 mt-8 rounded text-black"
                value={valueInputCorrectAnswer}
                onChange={inputHandlerToCorrectAnswer.bind(this)}
                placeholder="Enter correct answer"
            />
            <input
                className=" input-create-answer"
                value={valueInputFirstAnswer}
                onChange={inputHandlerToFirstAnswer.bind(this)}
                placeholder="Enter answer"
            />
            <input
                className=" input-create-answer"
                value={valueInputSecondAnswer}
                onChange={inputHandlerToSecondAnswer.bind(this)}
                placeholder="Enter answer"
            />
            <input
                className=" input-create-answer"
                value={valueInputThirdAnswer}
                onChange={inputHandlerToThirdAnswer.bind(this)}
                placeholder="Enter answer"
            />
            <button className=" text-white p-2 mt-10 border-2 hover:bg-white hover:text-black duration-150" onClick={addQuestionAndAnswers}>
                add questions
            </button>
            <button onClick={createQuiz} className=" text-white p-2 mt-10 border-2 hover:bg-white hover:text-black duration-150">
                Create quiz
            </button>
            <button onClick={showEditQuestions}>Edit questions</button>
            {validate ?
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded absolute top-3/4 mt-40" role="alert">
                    <strong className="font-bold">{validateText}</strong>
                </div>
            : null}
        </div>
        :null}

        {isEditQuestions ?
        <div>
            <div className=" h-70vh w-3/4 bg-red-400 flex justify-center items-center m-auto mt-28 flex-col rounded">
                <input
                    className=" w-2/4 text-4xl p-3 rounded text-black"
                    value={valueInputQuestion}
                    onChange={inputHandlerToQuestion.bind(this)}
                    placeholder='Enter questions'
                />
                <input
                    className=" w-5/12 text-2xl p-1 mt-8 rounded text-black"
                    value={valueInputCorrectAnswer}
                    onChange={inputHandlerToCorrectAnswer.bind(this)}
                    placeholder="Enter correct answer"
                />
                <input
                    className=" input-create-answer"
                    value={valueInputFirstAnswer}
                    onChange={inputHandlerToFirstAnswer.bind(this)}
                    placeholder="Enter answer"
                />
                <input
                    className=" input-create-answer"
                    value={valueInputSecondAnswer}
                    onChange={inputHandlerToSecondAnswer.bind(this)}
                    placeholder="Enter answer"
                />
                <input
                    className=" input-create-answer"
                    value={valueInputThirdAnswer}
                    onChange={inputHandlerToThirdAnswer.bind(this)}
                    placeholder="Enter answer"
                />
                <button onClick={saveEditedQuiz}>save</button>
            </div>
            <button onClick={hideEditQuestions}>hide</button>
        </div>
        : null}
        </div>
    )
}

export default CreateQuiz