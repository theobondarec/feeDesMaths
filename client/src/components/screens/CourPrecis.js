import React, {useEffect, useState, useContext} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import { UserContext } from '../../App'
import './Pages.css'

const CoursPrecis = ()=>{
    const [cours ,setCours]=useState([])
    const {state, dispatch} = useContext(UserContext)
    const coursId = useParams()
    const history = useHistory()


    /// SI tokenExpired => go to login page
    const clearExpiredToken = (errorCode)=>{
        if(errorCode === 'auth/id-token-expired'){
            localStorage.clear()
            dispatch({type:"CLEAR"})
            history.push('/login')
        }
    }

    useEffect(()=>{
        fetch(`/precis/${coursId.id}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            clearExpiredToken(result.code)
            setCours(result)
        })
    },[])

    if(cours.length >0){
        // console.log(cours)
        return(
            <div className="fullLessonPage">
                <h1 className="lessonTitle">{cours[0].chapitre}</h1>
                <h5>created by {cours[1].postedByName}</h5>

                <div className="progress progressBarLesson" style={{height: "40px"}}>   
                    {/* {REFAIRE PROGRESS BAR en js} */}
                    <div className="progress-bar progress-bar-striped" style={{width: "10%"}} role="progressbar" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100">Progression</div> 
                </div>

                <img className="card-img lessonImage" src={cours[0].photo} alt="Cardimagecap"></img> 
                <div className="card lessonDescription">
                    <h2 className="card-title">Description</h2>
                    <p className="card-body">
                        {cours[0].description}
                    </p>
                </div>

                {/*A FAIRE EN FONCTION DU NOMBRE DE LECON PAR MATIERE/CHAPITRE */}
                <div className="lessonPlan">            
                    <div className="list-group" id="list-tab" role="tablist">
                        <a className="list-group-item list-group-item-action active" data-toggle="list" href="#list-home">Titre lecon 1</a>
                        <a className="list-group-item list-group-item-action" data-toggle="list" href="#list-profile">Titre lecon 2</a>
                        <a className="list-group-item list-group-item-action" data-toggle="list" href="#list-messages">Titre lecon 3</a>
                        <a className="list-group-item list-group-item-action" data-toggle="list" href="#list-settings">Titre lecon 4</a>
                    </div>
                </div>

                <div className="card lesson">
                    <h2 className="card-title">Cours</h2>
                    <p className="card-body">
                        {cours[0].cours}
                    </p>
                </div>

                {/*AJOUT BOUTON TELECHARGEMENT PDF ACCES AU PDF VIA {cours.pdf} */}

                {/*Passer à la lecon suivante ou precedente*/}
                <div className="buttons">
                    <a href="/modifLesson" className="btn btn-primary">lecon precedente</a>
                    <a href="/" className="btn btn-primary">Lecon suivante</a>
                </div>
            </div>
        )
    }
    else{
        return(
            <div>
                {/* PAGE PDT CHARGEMENT BDD */}
                <h1>chargement de la page</h1>
            </div>
        )
    }
}
            
export default CoursPrecis