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
            setProgression(result)
        })
        .catch(err=>{
            console.log(err)
        })
    },[])

    return(
        <div className="displayProfile">
            <div>
                <h1>Progression des chapitres</h1>
                {progression.map(item=>{
                    // console.log(item)
                    return(
                        <div>
                            <h1>{item.subject}</h1>
                            <div>
                                <h3>{item.chapterTitle}</h3>
                                <div className="progress" id="progressBarLesson" style={{height: "40px"}}>
                                    <div className="progress-bar progress-bar-striped" style={{width: `${item.progression}%`}} role="progressbar"
                                        aria-valuenow={item.progression} aria-valuemin="0" aria-valuemax="100">Progression
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
                {/* <Progression/> */}
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

export default Profile