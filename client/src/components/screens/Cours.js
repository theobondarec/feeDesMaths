import React, {useState, useEffect} from 'react'
import './Pages.css'
import {Link} from 'react-router-dom'

const Cours = ()=>{
    const [data, setData] = useState([])

    function filterSelection() {
        var inputState = document.getElementById("inputState");
        var c = inputState.options[inputState.selectedIndex].value
        var x, i;
        x = document.getElementsByClassName("filterDiv");
        if (c == "all") c = "";
        for (i = 0; i < x.length; i++) {
            w3RemoveClass(x[i], "show");
            if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
        }
    }

    function w3AddClass(element, name) {
        var i, arr1, arr2;
        arr1 = element.className.split(" ");
        arr2 = name.split(" ");
        for (i = 0; i < arr2.length; i++) {
            if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
        }
    }

    function w3RemoveClass(element, name) {
        var i, arr1, arr2;
        arr1 = element.className.split(" ");
        arr2 = name.split(" ");
        for (i = 0; i < arr2.length; i++) {
            while (arr1.indexOf(arr2[i]) > -1) {
            arr1.splice(arr1.indexOf(arr2[i]), 1);     
            }
        }
        element.className = arr1.join(" ");
    }


    useEffect(()=>{
        fetch('/cours',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setData(result.posts)
            if(result.posts.length !== 0){
                console.log(result.posts)
                filterSelection("all")
            }
        })
    },[])



    return(
        <div>
            <h1>Cours</h1>
            <div className="lessonSelection">               {/*Dynamique en fonction des cours de la bdd*/}
                <div className="matiereSelection">
                <h2>Matieres</h2>
                    <select id="inputState" className="form-control" onChange={()=>filterSelection()}>
                        <option className="defaultValue" value="all">Show all</option>
                        <option value="math">Math</option>
                        <option value="physique">Physique</option>
                        <option value="anglais">Anglais</option>
                        <option value="test">Test</option>
                    </select>
                </div>

                {/* <div className="chapitreSelection">                          PAS ENCORE FAIT A FAIRE ?
                <h2>Chapitres</h2>
                    <select id="inputState" className="form-control">
                        <option defaultValue>All</option>
                        <option>Chapitre 1</option>
                        <option>Chapitre 2</option>
                        <option>Chapitre 3</option>
                        <option>Chapitre 4</option>
                        <option>Chapitre 5</option>
                    </select>
                </div> */}
            </div>
            <div className="allCard">
                {
                    data.map(item=>{
                        return( 
                            <div className={"card filterDiv " + item.matiere} key={item._id}>
                                <img className="card-img imgTest" src={item.photo} alt="Cardimagecap"></img>
                                <div className="f">
                                    <div className="card-title">
                                        <div><h2>{item.matiere}</h2></div>
                                        <h2>{item.chapitre}</h2>

                                        <Link to="/modifLesson" className="btn btn-primary">Modifier</Link>        {/*MODIFIER/SUPPR juste pour rank=prof */}
                                        <a href="/" className="btn btn-primary">Supprimer</a>       {/*
                                                                                                    Page speciale modif pour les prof ?
                                                                                                    un formulaire pré remplis avec info bdd
                                                                                                    et un bouton update qui change la bdd
                                                                                                */}
                                    </div>
                                    <div className="card-body">
                                        {item.description}
                                    </div>
                                    <Link to="/cours/precis" className="btn btn-primary">Voir le cours</Link>
                                </div>
                            </div>
                        )
                    })
                }

                {/*10 par page, apres ajouter page navigation*/}


            </div>
            
            <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
                    <li className="page-item disabled">
                    <a className="page-link" href="/" tabIndex="-1">Previous</a>
                    </li>
                    <li className="page-item"><a className="page-link" href="/">1</a></li>
                    <li className="page-item"><a className="page-link" href="/">2</a></li>
                    <li className="page-item"><a className="page-link" href="/">3</a></li>
                    <li className="page-item">
                    <a className="page-link" href="/">Next</a>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Cours



/*

<!DOCTYPE html>
<html>
    <body>
        <select id="inputState" className="form-control" onChange="filterSelection()">
            <option class="defaultValue" value="all">Show all</option>
            <option value="cars">Cars</option>
            <option value="animals">Animals</option>
            <option value="fruits">Fruits</option>
            <option value="colors">Colors</option>
        </select>

        <div class="filterDiv cars">BMW</div>
        <div class="filterDiv colors fruits">Orange</div>
        <div class="filterDiv cars">Volvo</div>
        <div class="filterDiv colors">Red</div>
        <div class="filterDiv cars animals">Mustang</div>
        <div class="filterDiv colors">Blue</div>
        <div class="filterDiv animals">Cat</div>
        <div class="filterDiv animals">Dog</div>
        <div class="filterDiv fruits">Melon</div>
        <div class="filterDiv fruits animals">Kiwi</div>
        <div class="filterDiv fruits">Banana</div>
        <div class="filterDiv fruits">Lemon</div>
        <div class="filterDiv animals">Cow</div>



        <script>
            filterSelection("all")
            function filterSelection() {
                var inputState = document.getElementById("inputState");
                var c = inputState.options[inputState.selectedIndex].value
                var x, i;
                x = document.getElementsByClassName("filterDiv");
                if (c == "all") c = "";
                for (i = 0; i < x.length; i++) {
                    w3RemoveClass(x[i], "show");
                    if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
                }
            }

            function w3AddClass(element, name) {
                var i, arr1, arr2;
                arr1 = element.className.split(" ");
                arr2 = name.split(" ");
                for (i = 0; i < arr2.length; i++) {
                    if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
                }
            }

            function w3RemoveClass(element, name) {
                var i, arr1, arr2;
                arr1 = element.className.split(" ");
                arr2 = name.split(" ");
                for (i = 0; i < arr2.length; i++) {
                    while (arr1.indexOf(arr2[i]) > -1) {
                    arr1.splice(arr1.indexOf(arr2[i]), 1);     
                    }
                }
                element.className = arr1.join(" ");
            }
        </script>
    </body>
</html>


*/