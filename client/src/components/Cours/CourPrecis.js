import React, {useEffect, useState, useContext, Component} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import './CourPrecis.css';

import { convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import { InlineTex } from 'react-tex'
import {EditorState, convertToRaw, ContentState} from 'draft-js';

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
            })
    },[])

    if (cours.length > 0) {
        return (
            <div id="fullLessonPage">
                <h1 id="lessonTitle">{cours[0].chapitre}</h1>
                <h5>created by {cours[1].postedByName}</h5>

                <div className="progress" id="progressBarLesson" style={{height: "40px"}}>
                    {/* {REFAIRE PROGRESS BAR en js} */}
                    <div className="progress-bar progress-bar-striped" style={{width: "10%"}} role="progressbar"
                         aria-valuenow="10" aria-valuemin="0" aria-valuemax="100">Progression
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
                        {cours[2].lecons.map(item=>{
                            //Avoir deja les lecon triée par ordre coirssant
                            return(
                                <a href={`#${item.lessonNumber}`} className="list-group-item list-group-item-action" key={item.postId}/*onClick={()=>{currentLesson()}}*///data-toggle="list"
                                >{item.lessonTitle}</a>
                            )
                        })}
                    </div>
                </div>

                {cours[2].lecons.map(item=>{
                    // console.log(item)
                    return(
                        <div className="card leconPrecise" id={`${item.lessonNumber}`} key={item.postId}>
                            <h2 className="card-title card-title-coursPrecis">{`lecon N°${item.lessonNumber}`}</h2>
                            <p className="card-body">
                                <InlineTex texContent={item.lesson}/>
                            </p>
                        </div>
                    )
                })}

                {/*Passer à la lecon suivante ou precedente*/}
                <div id="buttons">
                    <a /*href={`#${id-1}`}*/ className="btn btn-primary">lecon precedente</a>
                    <a /*href={`#${id+1}`}*/  className="btn btn-primary">Lecon suivante</a>
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