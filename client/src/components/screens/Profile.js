import React from 'react'
import './Pages.css'

const Profile = ()=>{
    return(
        <div>
            <div>
                <h1>Progression cours</h1>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Cours</th>
                                <th>Progression</th>
                            </tr>
                        </thead>
                        <tbody>{/*DYNAMIQUE AVEC BDD*/}
                            <tr>
                                <td>Nombre complexe</td>{/*Titre qui correspond au chapitre de la bdd*/}
                                <td>100%</td>{/*correspond au chapitre actuel de l'utilisateur dans le chapitre*/}
                            </tr>
                            <tr>
                                <td>sommes</td>
                                <td>40%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                <h1>Notes QCM</h1>
                <div className="table-responsive">
                    <table className="table">
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