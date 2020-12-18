import React, {useState, useEffect, useContext}from 'react'
import {useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import './profil.css'

const Profile = ()=>{

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

    const [progression ,setProgression] = useState([])
    const [matiere ,setMatiere] = useState([])
    const [progressionG ,setProgressionG] = useState([])
    // let progression = []
    useEffect(()=>{
        fetch('/api/getGlobalProgression',{
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            // console.log(result)
            setProgression(result.progression)
            setMatiere(result.chapterName)
        })
        .catch(err=>{
            console.log(err)
        })
    },[])

    useEffect(()=>{
        // console.log(progression, matiere)
        var progress = []
        if(progression){
            matiere.forEach(mat=>{
                progress[mat] = []
            })
            progression.forEach(ele =>{
                // console.log(ele)
                progress[ele.subject].unshift(ele)
            })
            // console.log(progress)
            setProgressionG(progress)
        }
        else{
            return
        }
    },[matiere])


    if(progressionG[matiere[0]]){
        return(
        <div className="displayProfile">
            <div>
                <h1>Progression des chapitres</h1>
                {matiere.map(item=>{
                    console.log(item)
                    const cours = []
                    for(var i = 0; i < progressionG[item].length; i++){
                        cours.push(progressionG[item][i])
                    }
                    return (
                        <div>
                            <h1>{item}</h1>
                            {cours.map(items=>{
                                console.log(items)
                                return (
                                    <div>
                                        <h3>{items.chapterTitle}</h3>
                                        <div className="progress" id="progressBarLesson" style={{height: "40px"}}>
                                            <div className="progress-bar progress-bar-striped" style={{width: `${items.progression}%`}} role="progressbar"
                                                aria-valuenow={items.progression} aria-valuemin="0" aria-valuemax="100">Progression
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
            <div>
                <h1>Notes QCM</h1>
                <div className="table-responsive">
                    <table className="table" id="tableProfile">
                        <thead>
                            <tr>
                                <th>Chapitres</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>{/*DYNAMIQUE AVEC BDD*/}
                            <tr>
                                <td>nombre complexe</td>{/*Titre qui correspond au chapitre de la bdd*/}
                                <td>20/20</td>{/*correspond au chapitre actuel de l'utilisateur dans le chapitre*/}
                            </tr>
                            <tr>
                                <td>sommes</td>
                                <td>20/20</td>
                            </tr>
                        </tbody>
                    </table>
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

export default Profile