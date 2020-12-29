import React, {useEffect, useState, useContext, Component} from 'react'
import {Link, useParams, useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import './CourPrecis.css';

import { convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import { InlineTex } from 'react-tex'
import {EditorState, convertToRaw, ContentState} from 'draft-js';

import {toast} from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css';  
toast.configure()


const CoursPrecis = ()=>{
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

    const [note, setNote] = useState("")
    useEffect(()=>{
        fetch(`/api/getSpecificCourse/${coursId.id}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            setCours(result)
            getScore(result)
        })
        .catch(err=>{
            console.log(err)
        })
    },[])
    
    const getScore = (res) =>{
        // console.log(res[0].chapterTitle)
        const chapterTitle = res[0].chapterTitle
        fetch(`/api/getQuizScoreForChapter/${chapterTitle}`, {
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            if(result.length>0){
                // console.log(result)
                setNote(result)
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const [buttonUsed ,setButtonUsed] = useState("")
    const validate = (subject, lessonId, chapterTitle, chapterId)=>{
        setButtonUsed(lessonId)
        fetch('/api/validateProgression', {
            method: "post",
            headers:{
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                chapterId,
                lessonId
            })
        // })
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            toast.success(result.message, {autoClose: 3000})
        })
        .then(()=>{
            fetch('/api/globalProgression',{
                method: "post",
                headers:{
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    subject,
                    chapterId,
                    lessonId,
                    chapterTitle
                })  
            })
        })
        .catch(err=>{
            console.log(err)
            // toast.error(err, {autoClose: 3000})
        })
    }

    const IllustrationSetUp = (illustration)=>{
        if(illustration != ""){
            return(
                <img className="card-img" id="lessonImage" src={illustration} alt="Cardimagecap"></img>
            )
        }
    }

    /////ACTUALISATION DES QUE BTN VALIDER
    const [percentage ,setPercentage]=useState([])
    useEffect(()=>{
        fetch(`/api/checkProgression/${coursId.id}`,{
            headers:{
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            setPercentage(result.chapterProgression)
        })
    },[buttonUsed])
  
    const displayLessons = () => {
        document.getElementById("lessonToHide").style.display = "flex"
        document.getElementById("lecons").style.display = "block"
        document.getElementById("quiz").style.display = "none"
        document.getElementById("showScore").style.display = "none"
    }
    const displayQuestions = () => {
        searchQuiz()
        document.getElementById("lessonToHide").style.display = "none"
        document.getElementById("quiz").style.display = "block"
        document.getElementById("lecons").style.display = "none"
        document.getElementById("showScore").style.display = "none"
    }




    const [questions, setQuestions] = useState([])

    const searchQuiz = ()=>{
        fetch('/api/getQuizWChapterId',{
            method: "post",
            headers:{
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                subject:cours[0].subject,
                chapterId:cours[0].chapterId,
                lessonId:"undifined"
            })
        })
        .then(res => res.json())
        .then((result)=>{
            if(result.length>0){
                setQuestions(result)
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const [score, setScore] = useState(0)
    const sendQuizAnswer = ()=>{
        var empty = true
        for(var i = 0; i<questions.length; i++){
            const checkBox = document.getElementById(`${i}checkA`)
            const checkBox2 = document.getElementById(`${i}checkB`)
            const checkBox3 = document.getElementById(`${i}checkC`)
            const checkBox4 = document.getElementById(`${i}checkD`)
    
            if(checkBox.checked == true || checkBox2.checked == true || checkBox3.checked == true || checkBox4.checked == true){
                empty = false
            }
        }

        if(!empty){
            document.getElementById("quiz").style.display = "none"
            document.getElementById("showScore").style.display = "block"
            // document.getElementById("waitingScreen").style.display = "block"

            var totalScore = 0
            // var reponse = {}
            for(var i = 0; i<questions.length; i++){
                const nbrCorrectAns = questions[i].answer.length

                const checkBox = document.getElementById(`${i}checkA`)
                const checkBox2 = document.getElementById(`${i}checkB`)
                const checkBox3 = document.getElementById(`${i}checkC`)
                const checkBox4 = document.getElementById(`${i}checkD`)
                for(var y = 0; y<nbrCorrectAns;y++){
                    // console.log("question ",i," check answer ", y, "/", nbrCorrectAns-1)
                    if (checkBox.checked == true){
                        if(checkBox.value === questions[i].answer[y]){
                            totalScore += 1/nbrCorrectAns
                        }
                        else{
                            totalScore -= 0.4
                        }
                    }
                    if (checkBox2.checked == true){
                        if(checkBox2.value === questions[i].answer[y]){
                            totalScore += 1/nbrCorrectAns
                        }
                        else{
                            totalScore -= 0.4

                        }
                    }
                    if (checkBox3.checked == true){
                        if(checkBox3.value === questions[i].answer[y]){
                            totalScore += 1/nbrCorrectAns
                        }
                        else{
                            totalScore -= 0.4

                        }
                    }
                    if (checkBox4.checked == true){
                        if(checkBox4.value === questions[i].answer[y]){
                            totalScore += 1/nbrCorrectAns
                        }
                        else{
                            totalScore -= 0.4
                        }
                    }
                }
            }
            // calcul/20
            const finalScore = ((totalScore*20)/questions.length).toFixed(2)
            setScore(finalScore)
            setNote(finalScore)
            showScore(finalScore)
        }
        else{
            toast.error("vérifier vos réponses !", {autoClose: 3000})
        }
    }

    const showScore = (finalScore)=>{
        //stockage en bdd
        fetch('/api/postQuizzScore',{
            method: "post",
            headers:{
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                chapterTitle:cours[0].chapterTitle,
                lessonTitle:"",
                subject:cours[0].subject,
                note:finalScore
            })  
        })
        .then(res => res.json())
        .then((result)=>{
            console.log(result.message)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const waiting = () =>{
        return(
            <div id="waitingScreen">
                <h1>Calcul de votre note</h1>
                <div className="cs-loader">
                    <div className="cs-loader-inner">
                        <label>●</label>
                        <label>●</label>
                        <label>●</label>
                        <label>●</label>
                        <label>●</label>
                        <label>●</label>
                    </div>
                </div>
            </div>
        )
    }

    const showNote = () =>{
        return(
            <>
                <h1>{note}/20</h1>
            </>
        )
    }

    const quizQuestion = () =>{
        if(questions.length>0){
            return(
            <div className="containerQuiz mt-sm-5 my-1">
                <div className="question ml-sm-5 pl-sm-5 pt-2">
                    {questions.map((quest,index)=>{
                        return(
                        <div key={quest.question}>
                            <div className="py-2 h5" id="enonce">
                                {/* <h1>{cmpt}</h1> */}
                                {/* AJOUT IMAGE SI IL Y EN A UNE ! */}
        
                                <b id="num">{`Q${quest.questionNumber}.`}</b>
                                <b><InlineTex texContent={quest.question}/></b>
                            </div>
                            <div className="ml-md-3 ml-sm-3 pl-md-5 pt-sm-0 pt-3" id="options">
                                <label className="options"><InlineTex texContent={quest.optionA}/>
                                    <input type="checkbox" name="checkbox" value={quest.optionA} id={`${index}checkA`}/>
                                    <span className="checkmark"></span>
                                </label>
                                <label className="options"><InlineTex texContent={quest.optionB}/>
                                    <input type="checkbox" name="checkbox" value={quest.optionB} id={`${index}checkB`}/>
                                    <span className="checkmark"></span>
                                </label>
                                <label className="options"><InlineTex texContent={quest.optionC}/>
                                    <input type="checkbox" name="checkbox" value={quest.optionC} id={`${index}checkC`}/>
                                    <span className="checkmark"></span>
                                </label>
                                <label className="options"><InlineTex texContent={quest.optionD}/>
                                    <input type="checkbox" name="checkbox" value={quest.optionD} id={`${index}checkD`}/>
                                    <span className="checkmark"></span>
                                </label>
                            </div>
                        </div>
                        )
                    })}
                </div>
        
                <div className="d-flex align-items-center pt-3">
                    <div className="ml-auto mr-sm-5">
                        <button className="btn btn-success" onClick={()=>{displayLessons()}}>retour à la lecon</button>
                    </div>
                    <div className="ml-auto mr-sm-5">
                        <button className="btn btn-success" id="sendAnswer" onClick={()=>{sendQuizAnswer()}}>Valider</button>
                    </div>
                </div>
            </div>
            )
        }
        else{
            return(
                <div>
                    <h1>pas de quiz pour ce chapitre pour l'instant</h1>
                </div>
            )
        }
    }


    if (cours.length > 0) {
        return (
            <div id="fullLessonPage">
                <h1 id="lessonTitle">{cours[0].chapterTitle}</h1>
                <div id="lessonToHide">
                    <h5>created by {cours[1].postedByName}</h5>
                    <div className="progress" id="progressBarLesson" style={{height: "40px"}}>
                        {/* {REFAIRE PROGRESS BAR en js} */}
                        <div className="progress-bar progress-bar-striped" style={{width: `${percentage}%`}} role="progressbar"
                            aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">Progression
                        </div>
                    </div>

                    {/* <img className="card-img" id="lessonImage" src={cours[0].illustration} alt="Cardimagecap"></img> */}
                    {
                        IllustrationSetUp(cours[0].illustration)
                    }
                    <div className="card" id="lessonDescription">
                        <h2 className="card-title card-title-coursPrecis">Description</h2>
                        <p className="card-body">
                            <InlineTex texContent={cours[0].description}/>
                        </p>
                    </div>
                </div>
                <div id="lessonPlan">
                    <div className="list-group" id="list-tab" role="tablist">
                        <div className="card">
                            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                                <div className="navbar-nav">
                                    <button className="btn btn-sm" type="button" onClick={()=>{displayLessons()}}>Leçons :</button>
                                    <button className="btn btn-sm" type="button" onClick={()=>{displayQuestions()}}>quiz :</button>
                                </div>
                            </nav>
                            <div id="lecons">
                                <h2 className="list-group-item" id="coursPrecisLeconTitreLecons">Leçons :</h2>
                                {cours[2].lecons.map(item=>{
                                    // console.log(item)
                                    return(
                                        // <a href={`#${item.lessonNumber}`} className="list-group-item list-group-item-action" key={item.lessonId}/*onClick={()=>{currentLesson()}}*///data-toggle="list"
                                        <div key={item.lessonId} className="list-group-item">
                                            <Link to={'/lesson/'+item.lessonId} className="list-group-item list-group-item-action" id="lessonPlanItems">
                                                {`leçon ${item.lessonNumber} : ${item.lessonTitle}`}
                                            </Link>
                                            <button type="button" className="btn btn-primary" onClick={()=>{validate(item.subject, item.lessonId, item.chapter, item.chapterId)}}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check2-square" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M15.354 2.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L8 9.293l6.646-6.647a.5.5 0 0 1 .708 0z"></path>
                                                    <path fillRule="evenodd" d="M1.5 13A1.5 1.5 0 0 0 3 14.5h10a1.5 1.5 0 0 0 1.5-1.5V8a.5.5 0 0 0-1 0v5a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 .5-.5h8a.5.5 0 0 0 0-1H3A1.5 1.5 0 0 0 1.5 3v10z"></path>
                                                </svg>
                                                {/* Valider */}
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>


                            <div id="quiz">
                                {note?showNote():quizQuestion()}
                            </div>
                            <div id="showScore">
                                {note?showNote():waiting()}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )




    }
    else{
        return(
            <div>
                <h1>Chargement de la base de donnée</h1>
                <div className="cs-loader">
                    <div className="cs-loader-inner">
                        <label>●</label>
                        <label>●</label>
                        <label>●</label>
                        <label>●</label>
                        <label>●</label>
                        <label>●</label>
                    </div>
                </div>
            </div>
        )
    }

}

export default CoursPrecis