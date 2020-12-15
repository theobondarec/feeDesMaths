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
    // console.log(postId.id)
    // let lesson = []
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

    // console.log(postId)
    // console.log(lesson)

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
            </div>
        )
    }
}
export default LeconPrecise