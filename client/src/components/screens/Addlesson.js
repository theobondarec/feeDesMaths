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
                <div className="form-row mcl">
                    <div class="col">
                        <input type="text" class="form-control" placeholder="Matière"/>
                    </div>
                    <div class="col">
                        <input type="text" class="form-control" placeholder="Chapitre"/>
                    </div>
                    <div class="col">
                        <input type="text" class="form-control" placeholder="Leçon"/>
                    </div>
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