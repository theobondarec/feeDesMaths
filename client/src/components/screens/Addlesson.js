import React from 'react'
import './Pages.css'

const Addlesson = ()=>{
    return(
        <div className="myCard">
            <div className="card add-card">
                <h1>Ajouter un cours</h1>
                <div class="input-group">
                <div class="custom-file">
                    <input type="file" class="custom-file-input" id="inputGroupFile01"
                    aria-describedby="inputGroupFileAddon01"/>
                    <label class="custom-file-label" for="inputGroupFile01">Add Illustration</label>
                </div>
                </div>
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
                <div class="input-group">
                    <div class="custom-file">
                        <input type="file" class="custom-file-input" id="inputGroupFile01"
                        aria-describedby="inputGroupFileAddon01"/>
                        <label class="custom-file-label" for="inputGroupFile01">Add pdf</label>
                    </div>
                </div>
                <button type="button" className="btn btn-primary">Upload</button>
            </div>
        </div>
    )
}

export default Addlesson