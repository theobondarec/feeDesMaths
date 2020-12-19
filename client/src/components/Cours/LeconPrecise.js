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
            console.log(result)
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
    

    // TYPE D'URL SUPPORTER
    // http://www.youtube.com/watch?v=0zM3nApSvMg&feature=feedrec_grec_index
    // http://www.youtube.com/user/IngridMichaelsonVEVO#p/a/u/1/QdK8U-VIH_o
    // http://www.youtube.com/v/0zM3nApSvMg?fs=1&amp;hl=en_US&amp;rel=0
    // http://www.youtube.com/watch?v=0zM3nApSvMg#t=0m10s
    // http://www.youtube.com/embed/0zM3nApSvMg?rel=0
    // http://www.youtube.com/watch?v=0zM3nApSvMg
    // http://youtu.be/0zM3nApSvMg
    const youtube_parser = (url)=>{
        if(url){
            var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
            var match = url.match(regExp);
            return (match&&match[7].length==11)? match[7] : false;
        }
    }

    const showClip = (clip)=>{
        if(clip){
            if(clip.length > 15){
                const clipId = youtube_parser(clip)    
                console.log(clipId) 
                return(
                    <iframe width="560" height="315" src={`http://www.youtube.com/embed/${clipId}`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                )
            }
            else{
                const clipId = clip
                return(
                    <iframe width="560" height="315" src={`http://www.youtube.com/embed/${clipId}`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                )
            }
        }
    }
    if(lesson){
        return(
            <div>
                <h1>{lesson.lessonTitle}</h1>
                {
                    showClip(lesson.lessonClip)
                }
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
export default LeconPrecise