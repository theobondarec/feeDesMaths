import React from 'react'
import './Pages.css'

const Admin = ()=>{
    return(
        <div className="adminClass">
            <div>
                <h1>Utilisateurs</h1>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>rank</th>
                        </tr>
                    </thead>
                    <tbody>{/*info de la BDD afficher 10personnes et pagesuivante en bas du tableau*/}
                        <tr>
                            <td>Bondarec</td>
                            <td>theo.bondarec@isen.yncrea.fr</td>
                            <td>admin</td>
                        </tr>
                        <tr>
                            <td>Sartorius</td>
                            <td>ghislain.sartorius@isen.yncrea.fr</td>
                            <td>student</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="card modif-card">                           {/*Formulaire modification rank*/}
                <h1>Modification du rank</h1>
                <div className="formulaire">
                    <input 
                    type="text"
                    placeholder="email"
                    />
                    <select id="inputState" className="form-control">
                        <option defaultValue>Student</option>
                        <option>Professor</option>
                        <option>Admin</option>
                    </select>
                </div>
                <button type="button" className="btn btn-primary">Modifier</button>
            </div>
        </div>
    )
}

export default Admin