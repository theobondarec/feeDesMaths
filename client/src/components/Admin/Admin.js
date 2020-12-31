import React, {useState, useEffect, useContext}from 'react'
import {useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import './Admin.css';
import Cookies from 'universal-cookie';

import {toast} from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css';  
toast.configure()

// import {testExpiredToken} from './clearToken'

const Admin = () => {
    const cookies = new Cookies()
    const [data, setData] = useState([])
    const [errorMessage, setErrorMessage] = useState([])
    const [allow, setAllow] = useState([])

    // eslint-disable-next-line
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

    // let accessToken
    useEffect(() => {
        fetch('/api/admin',{
            headers:{
                Authorization:"Bearer "+ cookies.get('jwt')
                // Authorization:"Bearer "+localStorage.getItem("jwt")/*accessToken*/
                
            }
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            if(result.allow === true){
                setData(result.users)
                setAllow(result.allow)
            }
            else{
                setErrorMessage(result.error)
            }
        })
    }, [])


    let idValue, newRank
    const rankModification = () => {
        const inputState = document.getElementById("inputState")
        if (inputState) {
            newRank = inputState.options[inputState.selectedIndex].value
        }
        const inputId = document.getElementById("inputId")
        if (inputId) {
            idValue = inputId.value
            document.getElementById('inputId').value = "";
        }
        fetch(`/api/admin/rankChange`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization:"Bearer "+ cookies.get('jwt')

                // "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                userId: idValue,
                newRank
            })
        }).then(res => res.json())
        .then((result)=>{
            // console.log(result)
            if(result.allow === true){
                setData(result.users)
                // toast(result.message)
                toast.success(result.message, {autoClose: 3000})
            }
            else{
                // toast(result.error)
                toast.error(result.error, {autoClose: 3000})
            }
        })
        .catch(err=>{
            console.error(err)
        })
    }

    const popUpDel = (index)=>{
        const modal = document.getElementById(`popUpDel${index}`);
        modal.style.display = "block";
    }
    const closePopUp = (index)=>{
        const modal = document.getElementById(`popUpDel${index}`);
        modal.style.display = "none";
    }
    window.onclick = function(event){
        const dataSize = data.length
        var tabLesson=[]
        for(var i =0; i<dataSize; i++){
            tabLesson[i] = document.getElementById(`popUpDel${i}`)
        }
        for(var i =0; i<dataSize; i++){
            if (event.target == tabLesson[i]) {
                // console.log("click")
                tabLesson[i].style.display = "none";
            }
        }
    }

    const delUser = (user, index)=>{
        const uid = user.userId
        fetch(`/api/delUserFirestore/${uid}`, {
            method:"delete",
            headers:{
                Authorization:"Bearer "+ cookies.get('jwt')
            }
        }).then(res=>res.json())
        .then((result)=>{
            // console.log(result)
            // console.log("data : ",data)
            if(result.allow === true){
                const newUsers = data.filter(item=>{
                    return item.userId !== uid
                })
                toast.success(result.message, {autoClose: 3000})
                // console.log(newUsers)
                setData(newUsers)
                closePopUp(index)
            }
            else{
                toast.error(result.error, {autoClose: 3000})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }

    if(data.length > 0){
        if(allow === true){
            return(
                <div className="adminClass">
                    <div>
                        <h1>Utilisateurs</h1>
                        <table className="table" id="tableAdmin">
                            <thead>
                                <tr>
                                    <th>user email</th>
                                    <th>userId</th>
                                    <th>rank</th>
                                    <th>delete</th>
                                </tr>
                            </thead>
                            <tbody>
                            {data.map((item,index)=>{
                                return(
                                    // <div key={item.userId}>
                                    <>
                                        <tr key={item.userId}>
                                            <td>{item.email}</td>
                                            <td>{item.userId}</td>
                                            <td>{item.rank}</td>
                                            <td>
                                                <button type="button" className="btn btn-danger" onClick={()=>{popUpDel(index)}}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>
                                                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                        <div id={`popUpDel${index}`} className="popUpDel">
                                            <div className="card">
                                                <span className="close" onClick={()=>{closePopUp(index)}}>&times;</span>
                                                <h1 className="card-title">êtes-vous sûr de vouloir supprimer {item.email} ?</h1>
                                                <button type="button" className="btn btn-danger" onClick={()=>{delUser(item, index)}}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>
                                                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>
                                                    </svg>
                                                </button> 
                                            </div>
                                        </div>
                                        </>
                                    // </div>
                                )
                            })}
                            </tbody>
        
        
                        </table>
                    </div>
                    <div className="card" id="modif-card">
                        <h1>Modification du rank</h1>
                        <div id="formulaire">
                            <input 
                            type="text"
                            placeholder="userId"
                            id="inputId"
                            />
                            <select id="inputState" className="form-control">
                                <option value="student" defaultValue="student">Student</option>
                                <option value="professor">Professor</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <button type="button" className="btn btn-primary" onClick={()=>rankModification()}>Modifier</button>
                    </div>
                </div>
            )
        }
        else{
            return(
                <div>
                    <h1>{errorMessage}</h1>
                </div>
            )
        }
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

export default Admin