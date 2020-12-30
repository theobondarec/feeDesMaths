import React, {useState, useEffect, useContext}from 'react'
import {useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import Cookies from 'universal-cookie';
import './profil.css'

const Profile = ()=>{
    const cookies = new Cookies()
    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()
    const testExpiredToken = () => {
        localStorage.clear()
        //Clear Cookies
        cookies.remove('jwt', {path:'/'})
        // Clear Cookies
        dispatch({type: "CLEAR"})
        history.push('/login')
	}
    useEffect(()=>{
        fetch('/api/tokenIsOk',{
            headers:{
                // Authorization:"Bearer "+localStorage.getItem("jwt")
                Authorization:"Bearer "+ cookies.get('jwt')
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
                // Authorization:"Bearer "+localStorage.getItem("jwt")
                Authorization:"Bearer "+ cookies.get('jwt')
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
            // console.log("progression : ", progress)
            setProgressionG(progress)
        }
        else{
            return
        }
    },[matiere])


    const [notes ,setNotes] = useState([])
    const [matiereNotes ,setMatiereNotes] = useState([])
    const [notesG ,setNotesG] = useState([])
    useEffect(()=>{
        fetch('/api/getScores',{
            headers:{
                // Authorization:"Bearer "+localStorage.getItem("jwt")
                Authorization:"Bearer "+ cookies.get('jwt')
            }
        })
        .then(res=>res.json())
        .then(result=>{
            // console.log(result)
            setNotes(result.notes)
            setMatiereNotes(result.chapterName)
        })
        .catch(err=>{
            console.log(err)
        })
    },[])
    useEffect(()=>{
        // console.log(progression, matiere)
        var note = []
        if(notes){
            matiereNotes.forEach(mat=>{
                note[mat] = []
            })
            notes.forEach(ele =>{
                // console.log(ele)
                note[ele.subject].unshift(ele)
            })
            // console.log("notes : ",note)
            setNotesG(note)
        }
        else{
            return
        }
    },[matiereNotes])

    const showProgression = ()=>{
        if(progressionG[matiere[0]]){
            return(
                <>
                    {matiere.map(item=>{
                        // console.log(item)
                        const cours = []
                        for(var i = 0; i < progressionG[item].length; i++){
                            cours.push(progressionG[item][i])
                        }
                        return (
                            <div key={Math.random()}>
                                <h1>{item}</h1>
                                {/* {console.log(cours)} */}
                                {cours.map(items=>{
                                    // console.log(items)
                                    return (
                                        <div key={Math.random()}>
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
                </>
            )
        }
        else{
            return(
                <h1>vous n'avez fait aucune leçon</h1>
            )
        }
    }
    const showScore = ()=>{
        if(notesG[matiereNotes[0]]){
            return(
                <>
                {matiereNotes.map(item=>{
                    const cours = []
                    for(var i = 0; i < notesG[item].length; i++){
                        cours.push(notesG[item][i])
                    }
                    return(
                        <div key={Math.random()}>
                            <h2>{item}</h2>
                            <table className="table" id="tableProfile">
                                <thead>
                                    <tr>
                                        <th>matieres</th>
                                        <th>Chapitres</th>
                                        <th>Lecons</th>
                                        <th>Notes</th>
                                    </tr>
                                </thead>
                                {/* {console.log("test : ",cours)} */}
                                {cours.map(items=>{
                                    return(
                                        <tbody key={Math.random()}>
                                            <tr>
                                                <td>{items.subject}</td>
                                                <td>{items.chapterTitle}</td>
                                                <td>{items.lessonTitle}</td>
                                                <td>{`${items.note}/20`}</td>
                                            </tr>
                                        </tbody>
                                    )
                                })}
                            </table>
                        </div>
                    )
                })}
                </>
            )
        }
        else{
            return(
                <h1>vous n'avez pas encore de note</h1>
            )
        }
    }


    if(progressionG[matiere[0]] || notesG[matiereNotes[0]]){
        return(
        <div className="displayProfile">
            <div>
                <h1>Progression des chapitres</h1>
                <div>
                    {showProgression()}
                </div>
            </div>
            <div>
                <h1>Notes Quiz</h1>
                <div className="table-responsive">
                    {showScore()}
                </div>
            </div>
        </div>
        )
    }
    else{
        return(
            <div>
                <h1>Avez vous déjà validé une leçon ou fait un quiz ?</h1>
                <h2>chargement de la base de donnée</h2>
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