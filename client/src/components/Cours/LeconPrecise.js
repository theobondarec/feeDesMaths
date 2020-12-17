import React, {useEffect, useState, useContext, Component} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import './LeconPrecise.css';
// import '../screens/Pages.css'

import { convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import { InlineTex } from 'react-tex'
import {EditorState, convertToRaw, ContentState} from 'draft-js';

import {toast} from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css';  
toast.configure()

const LeconPrecise = ()=>{
    const {state, dispatch} = useContext(UserContext)
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


    const postId = useParams()
    const [lesson ,setLesson]=useState([])
    useEffect(()=>{
        fetch(`/api/lesson/${postId.id}`,{
            headers:{
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setLesson(result[0])
        })
        .catch(err=>{
            console.log(err)
        })
    },[])


    const goToChapter = (subject, lessonId, chapterTitle, chapterId)=>{
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
        history.push(`/cours/${lesson.chapterId}`)
    }
    
    if(!lesson){
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
    else{
        return(
            <div>
                <h1>{lesson.lessonTitle}</h1>
                <InlineTex texContent={lesson.lessonContent}/>
                <button type="button" className="btn btn-primary" onClick={()=>{goToChapter(lesson.subject, lesson.lessonId, lesson.chapter, lesson.chapterId)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"></path>
                    </svg>
                Retour au chapitre
              </button>
            </div>
        )
    }
}
export default LeconPrecise