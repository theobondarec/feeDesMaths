import React, {useState, useEffect, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import { UserContext } from '../../App'
import './Pages.css'

const Addlesson = ()=>{ 
    const [matiere, setMatiere] = useState("")
    const [chapitre, setChapitre] = useState("")
    const [lecon, setLecon] = useState("")
    const [description, setDescription] = useState("")
    const [cours, setCours] = useState("")
    const [illustration, setIllustration] = useState("")
    const [url, setUrl] = useState("")
    const [pdf, setPdf] = useState("")
    const [url2, setUrl2] = useState("")

    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()
    // console.log(JSON.parse(localStorage.getItem("user")).userId)
    const clearExpiredToken = (errorCode)=>{
        if(errorCode === 'auth/id-token-expired'){
            localStorage.clear()
            dispatch({type:"CLEAR"})
            history.push('/login')
            return true
        }
        else{
            return false
        }
    }
    //meilleure facon de async function ?
    useEffect(()=>{
        if(url2 && url){
                fetch("/createpost",{
                    method:"post",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        matiere,
                        chapitre,
                        lecon,
                        description,
                        cours,
                        photo:url,
                        pdf:url2
                    })
                }).then(res=>res.json())
                .then(data => {

                    // console.log(data)
                    // clearExpiredToken(data.code)
                    if(data.error){
                        window.alert(data.error)            //PAS window.alert MAIS un TOAST AVEC BOOTSTRAP
                        setUrl("")
                        setUrl2("")
                    }
                    else{
                        window.alert("Lesson added")        //PAS window.alert MAIS un TOAST AVEC BOOTSTRAP
                    }
                }).catch(err=>{
                    console.log(err)
                })
         }
         // eslint-disable-next-line
    },[url, url2])

    const postLesson = ()=>{
        //Upload Illustration
        const data = new FormData()
        data.append("file", illustration)
        data.append("folder", "img")
        data.append("upload_preset", "feedesmaths")
        data.append("cloud_name", "feedesmaths")

        fetch("https://api.cloudinary.com/v1_1/feedesmaths/image/upload/", {
            method: "post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
                window.alert("illustration error : " + data.error.message)
                return
            }
            // console.log(data)
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })
        //

        //Upload PDF
        const dataPdf = new FormData()
        dataPdf.append("file", pdf)
        // console.log("pdf file: " + pdf)
        dataPdf.append("folder", "pdf")
        dataPdf.append("upload_preset", "feedesmaths")
        dataPdf.append("cloud_name", "feedesmaths")

        fetch("https://api.cloudinary.com/v1_1/feedesmaths/image/upload/", {
            method: "post",
            body:dataPdf
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.error){
                window.alert("pdf error : " + data.error.message)
                return
            }
            // console.log(data)
            setUrl2(data.url)
        })
        .catch(err=>{
            console.log(err)
        })
        //

        if(url === "" || url2 === ""){              //PAS OPTI JE PENSE
            // window.alert("URL vide")
            if(url !== ""){
                //suprimer url2 de la bdd Cloudinary
            }
            if(url2 !== ""){
                //suprimer url2 de la bdd Cloudinary
            }
            setUrl("")
            setUrl2("")
        }
    }

    return(
        <div className="myCard">
            <div className="card add-card">
                <h1>Ajouter un cours</h1>
                <div className="input-group">
                <div className="custom-file">
                    <input type="file" className="custom-file-input" id="inputGroupFile01"
                    aria-describedby="inputGroupFileAddon01"
                    onChange={(e)=>setIllustration(e.target.files[0])}
                    />
                    <label className="custom-file-label" htmlFor="inputGroupFile01">Add Illustration</label>
                </div>
                </div>
                <div className="form-row mcl">
                    <div className="col">
                        <input type="text" className="form-control" placeholder="Matière"
                        value={matiere}
                        onChange={(e)=>setMatiere(e.target.value)}
                        />
                    </div>
                    <div className="col">
                        <input type="text" className="form-control" placeholder="Chapitre"
                        value={chapitre}
                        onChange={(e)=>setChapitre(e.target.value)}
                        />
                    </div>
                    <div className="col">
                        <input type="text" className="form-control" placeholder="Leçon"
                        value={lecon}
                        onChange={(e)=>setLecon(e.target.value)}
                        />
                    </div>
                </div>
                <textarea 
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
                />
                <textarea 
                    type="text"
                    placeholder="Cours"
                    value={cours}
                    onChange={(e)=>setCours(e.target.value)}
                />
                <div className="input-group">
                    <div className="custom-file">
                        <input type="file" className="custom-file-input" id="inputGroupFile01"
                        aria-describedby="inputGroupFileAddon01"
                        onChange={(e)=>{
                            setPdf(e.target.files[0])
                            }
                        }
                        />
                        <label className="custom-file-label" htmlFor="inputGroupFile01">Add pdf</label>
                    </div>
                </div>
                <button type="button" className="btn btn-primary"
                    onClick={()=>postLesson()}
                >
                    Upload
                </button>
            </div>
        </div>
    )
}

export default Addlesson