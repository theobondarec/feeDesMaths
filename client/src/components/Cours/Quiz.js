import React, {useEffect, useState, useContext, Component} from 'react'
import {Link, useParams, useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import './Quiz.css';

import { convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import { InlineTex } from 'react-tex'
import {EditorState, convertToRaw, ContentState} from 'draft-js';

import {toast} from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css';  
toast.configure()


const Quiz = ()=>{
    const [cours ,setCours]=useState([])
    const {state, dispatch} = useContext(UserContext)
    const coursId = useParams()
    const history = useHistory()

    const testExpiredToken = () => {
            localStorage.clear()
            dispatch({type: "CLEAR"})
            history.push('/login')
    }
    useEffect(()=>{
        fetch('/api/tokenIsOk',{
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            if(result.tokenOk === true){
                return
            }
            else{
                testExpiredToken()
            }
        })
    },[])




    // VARIABLE
    const subject = "matiere clean"
    const chapterId = "3hg8vukj2cjyhsyetf48cllykggnvivf"
    const lessonId = "undifined"





    const [numberQuestions, setNumberQuestions] = useState("")
    const [questions, setQuestions] = useState([])

    useEffect(()=>{
        fetch('/api/getQuizWChapterId',{
            method: "post",
            headers:{
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                subject,
                chapterId,
                lessonId
            })
        })
        .then(res => res.json())
        .then((result)=>{
            console.log("questions bdd : ",result)
            console.log("questions code : ",questionss)
            setQuestions(result)
            setNumberQuestions(result.length)
        })
        .catch(err=>{
            console.log(err)
        })
    },[])


    const questionss = [
        {
            questionText: 'What is the capital of France?',
            answerOptions: [
                { answerText: 'New York', isCorrect: false },
                { answerText: 'London', isCorrect: false },
                { answerText: 'Paris', isCorrect: true },
                { answerText: 'Dublin', isCorrect: false },
            ],
        },
        {
            questionText: 'Who is CEO of Tesla?',
            answerOptions: [
                { answerText: 'Jeff Bezos', isCorrect: false },
                { answerText: 'Elon Musk', isCorrect: true },
                { answerText: 'Bill Gates', isCorrect: false },
                { answerText: 'Tony Stark', isCorrect: false },
            ],
        },
        {
            questionText: 'The iPhone was created by which company?',
            answerOptions: [
                { answerText: 'Apple', isCorrect: true },
                { answerText: 'Intel', isCorrect: false },
                { answerText: 'Amazon', isCorrect: false },
                { answerText: 'Microsoft', isCorrect: false },
            ],
        },
        {
            questionText: 'How many Harry Potter books are there?',
            answerOptions: [
                { answerText: '1', isCorrect: false },
                { answerText: '4', isCorrect: false },
                { answerText: '6', isCorrect: false },
                { answerText: '7', isCorrect: true },
            ],
        },
    ];


    
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0);
    
    const handleAnswerOptionClick = (isCorrect) => {

        var tab = []
        const checkBox = document.getElementById("checkA");
        const checkBox2 = document.getElementById("checkB");
        const checkBox3 = document.getElementById("checkC");
        const checkBox4 = document.getElementById("checkD");
        if (checkBox.checked == true){
            tab.push(checkBox.value)
        }
        if (checkBox2.checked == true){
            tab.push(checkBox2.value)
        }
        if (checkBox3.checked == true){
            tab.push(checkBox3.value)
        }
        if (checkBox4.checked == true){
            tab.push(checkBox4.value)
        }

        if (isCorrect) {
            setScore(score + 1);
        }
    
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questionss.length) {
            setCurrentQuestion(nextQuestion);
        } else {
            setShowScore(true);
            // STOCKER SCORE EN BDD
        }
    };


    // if (cours.length > 0) {
        return (
                <div>
                    {showScore ? (
                        <div className='score-section'>
                            You scored {score} out of {questionss.length}
                        </div>
                    ) : (
                        <>
                            <div className='question-section'>
                                <div className='question-count'>
                                    <span>Question {currentQuestion + 1}</span>/{questionss.length}
                                </div>
                                <div className='question-text'>{questionss[currentQuestion].questionText}</div>
                            </div>
                            <div className='answer-section'>
                                {questionss[currentQuestion].answerOptions.map((answerOption) => (
                                    <button onClick={() => handleAnswerOptionClick(answerOption.isCorrect)}>{answerOption.answerText}</button>
                                ))}
                            </div>
                            <button onClick={() => handleAnswerOptionClick(true)}>test next</button>
                        </>
                    )}
                </div>
            );
    // }
    // else{
    //     return(
    //         <div>
    //             <h1>Chargement de la base de donnée</h1>
    //             <div className="cs-loader">
    //                 <div className="cs-loader-inner">
    //                     <label>●</label>
    //                     <label>●</label>
    //                     <label>●</label>
    //                     <label>●</label>
    //                     <label>●</label>
    //                     <label>●</label>
    //                 </div>
    //             </div>
    //         </div>
    //     )
    // }

}

export default Quiz


