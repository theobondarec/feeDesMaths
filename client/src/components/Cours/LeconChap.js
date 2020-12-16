// import React, {useEffect, useState, useContext, Component} from 'react'
// import {useParams, useHistory} from 'react-router-dom'
// import {UserContext} from '../../App'
// import './LeconChap.css';

// import { convertFromRaw } from 'draft-js';
// import { Editor } from 'react-draft-wysiwyg';
// import draftToHtml from 'draftjs-to-html';
// import { InlineTex } from 'react-tex'
// import {EditorState, convertToRaw, ContentState} from 'draft-js';



// const LeconChap = ()=>{
//     const {state, dispatch} = useContext(UserContext)
//     const history = useHistory()
//     const testExpiredToken = () => {
//             localStorage.clear()
//             dispatch({type: "CLEAR"})
//             history.push('/login')
//     }
//     useEffect(()=>{
//         fetch('/api/tokenIsOk',{
//             headers:{
//                 Authorization:"Bearer "+localStorage.getItem("jwt")
//             }
//         })
//         .then(res=>res.json())
//         .then(result=>{
//             if(result.tokenOk === true){
//                 return
//             }
//             else{
//                 testExpiredToken()
//             }
//         })
//     },[])


//     const postId = useParams()
//     const [lesson ,setLesson]=useState([])
//     useEffect(()=>{
//         fetch(`/api/getAllLessons/${postId.id}`,{
//             headers:{
//                 Authorization: "Bearer " + localStorage.getItem("jwt")
//             }
//         }).then(res=>res.json())
//         .then(result=>{
//             setLesson(result[0])
//             console.log(result)
//         })
//         .catch(err=>{
//             console.log(err)
//         })
//     },[])


    
//     const validate = ()=>{
//         console.log("lecon validée !")
//         fetch('./api/validateProgression', {
//             headers:{
//                 "Content-Type": "application/json",
//                 Authorization: "Bearer " + localStorage.getItem("jwt")
//             },
//             body: JSON.stringify({
//                 chapterId:lesson.chapterId,
//                 lessonId:lesson.lessonId
//             })
//         }).then(res=>res.json())
//         .then(result=>{
//             console.log(result)
//             // TOAST
//         })
//         .catch(err=>{
//             console.log(err)
//             // TOAST
//         })
//     }


//     if(!lesson){
//         return(
//             <div>
//                 <h1>Chargement de la base de donnée</h1>
//                 <div className="cs-loader">
//                     <div className="cs-loader-inner">
//                         <label>●</label>
//                         <label>●</label>
//                         <label>●</label>
//                         <label>●</label>
//                         <label>●</label>
//                         <label>●</label>
//                     </div>
//                 </div>
//             </div>
//         )
//     }
//     else{
//         return(
//             <h1>pas le bon</h1>
//             // <div>
//             //     {/* Show que 1 element d'un tableau + bouton suivant/precedente */}
//             //     <h1>{lesson.lessonTitle}</h1>
//             //     <button type="button" class="btn btn-primary" onClick={()=>{validate(/*METTRE LES BON ID*/)}}>
//             //         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2-square" viewBox="0 0 16 16">
//             //             <path fill-rule="evenodd" d="M15.354 2.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L8 9.293l6.646-6.647a.5.5 0 0 1 .708 0z"></path>
//             //             <path fill-rule="evenodd" d="M1.5 13A1.5 1.5 0 0 0 3 14.5h10a1.5 1.5 0 0 0 1.5-1.5V8a.5.5 0 0 0-1 0v5a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 .5-.5h8a.5.5 0 0 0 0-1H3A1.5 1.5 0 0 0 1.5 3v10z"></path>
//             //         </svg>
//             //         Valider
//             //     </button>
//             // </div>
//         )
//     }
// }
// export default LeconChap