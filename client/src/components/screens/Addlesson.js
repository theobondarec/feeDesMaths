import React from 'react'
import './Pages.css'

const Addlesson = ()=>{
    return(
        <div className="myCard">
            <div className="card add-card">
                <h1>Ajouter un cours</h1>
                <input 
                type="text"
                placeholder="url: image/video"
                />
                <div className="mcl">
                    <input 
                    type="text"
                    placeholder="matière"
                    />
                    <input 
                    type="text"
                    placeholder="chapitre"
                    />
                    <input 
                    type="text"
                    placeholder="lecon"
                    />
                </div>
                <textarea 
                    type="text"
                    placeholder="Description"
                />
                <textarea 
                    type="text"
                    placeholder="Cours"
                />
                <input 
                    type="text"
                    placeholder="url: pdf"
                />
                <button type="button" className="btn btn-primary">Upload</button>
            </div>
        </div>
    )
}

export default Addlesson