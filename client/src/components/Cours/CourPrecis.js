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


    useEffect(()=>{
        fetch(`/api/getSpecificCourse/${coursId.id}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
            .then(result=>{
                setCours(result)
                // console.log(result)
            })
    },[])

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

    if (cours.length > 0) {
        return (
            <div id="fullLessonPage">
                <h1 id="lessonTitle">{cours[0].chapterTitle}</h1>
                <h5>created by {cours[1].postedByName}</h5>

                <div className="progress" id="progressBarLesson" style={{height: "40px"}}>
                    {/* {REFAIRE PROGRESS BAR en js} */}
                    <div className="progress-bar progress-bar-striped" style={{width: `${percentage}%`}} role="progressbar"
                         aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">Progression
                    </div>
                </div>

                <img className="card-img" id="lessonImage" src={cours[0].illustration} alt="Cardimagecap"></img>
                <div className="card" id="lessonDescription">
                    <h2 className="card-title card-title-coursPrecis">Description</h2>
                    <p className="card-body">
                        <InlineTex texContent={cours[0].description}/>
                    </p>
                </div>

                <div id="lessonPlan">
                    <div className="list-group" id="list-tab" role="tablist">
                        <h2 className="list-group-item" id="coursPrecisLeconTitre">Leçons :</h2>
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
                </div>

                {/* {cours[2].lecons.map(item=>{
                    // console.log(item)
                    return(
                        <div className="card leconPrecise" id={`${item.lessonNumber}`} key={item.lessonId}>
                            <h2 className="card-title card-title-coursPrecis">{`lecon N°${item.lessonNumber}`}</h2>
                            <p className="card-body">
                                <InlineTex texContent={item.lessonContent}/>
                            </p>
                        </div>
                    )
                })}

                <div id="buttons">
                    <a className="btn btn-primary">lecon precedente</a>
                    <a className="btn btn-primary">Lecon suivante</a>
                </div> */}
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