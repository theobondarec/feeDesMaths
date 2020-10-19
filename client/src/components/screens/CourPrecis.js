import React from 'react'
import './Pages.css'

const CoursPrecis = ()=>{
    return(
        <div className="fullLessonPage">
            <h1 className="lessonTitle">Titre Chapitre</h1>
            <div class="progress progressBarLesson" style={{height: "40px"}}>
                {/* {REFAIRE PROGRESS BAR en js} */}
                <div class="progress-bar progress-bar-striped" style={{width: "10%"}} role="progressbar" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100">Progression</div> 
            </div>
            <img className="card-img lessonImage" src="https://altissia.org/wp-content/uploads/2018/07/illustrationss-15.png" alt="Cardimagecap"></img> 
            <div className="card lessonDescription">
                <h2 className="card-title">Description</h2>
                <p className="card-body">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tempor orci at auctor pretium. Phasellus sagittis ultricies velit, sed mattis mi ultricies eget. Proin tempus, turpis at convallis condimentum, arcu sem tincidunt velit, id faucibus erat odio ac leo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Duis sit amet felis ut urna gravida dictum. Sed rutrum tellus et arcu tincidunt, tristique volutpat dui pharetra. Etiam sit amet sollicitudin libero, at faucibus arcu. Aliquam volutpat iaculis imperdiet. Cras et ante vel augue scelerisque sodales sed in eros. Suspendisse sollicitudin turpis tortor, a consectetur diam egestas eleifend. Pellentesque egestas vel elit vel fermentum. Suspendisse sit amet mollis sem.
                </p>
            </div>
            <div className="lessonPlan">
                <div class="list-group" id="list-tab" role="tablist">
                    <a class="list-group-item list-group-item-action active" data-toggle="list" href="#list-home">Titre lecon 1</a>
                    <a class="list-group-item list-group-item-action" data-toggle="list" href="#list-profile">Titre lecon 2</a>
                    <a class="list-group-item list-group-item-action" data-toggle="list" href="#list-messages">Titre lecon 3</a>
                    <a class="list-group-item list-group-item-action" data-toggle="list" href="#list-settings">Titre lecon 4</a>
                </div>
            </div>
            <div className="card lesson">
                <h2 className="card-title">Cours</h2>
                <p className="card-body">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tempor orci at auctor pretium. Phasellus sagittis ultricies velit, sed mattis mi ultricies eget. Proin tempus, turpis at convallis condimentum, arcu sem tincidunt velit, id faucibus erat odio ac leo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Duis sit amet felis ut urna gravida dictum. Sed rutrum tellus et arcu tincidunt, tristique volutpat dui pharetra. Etiam sit amet sollicitudin libero, at faucibus arcu. Aliquam volutpat iaculis imperdiet. Cras et ante vel augue scelerisque sodales sed in eros. Suspendisse sollicitudin turpis tortor, a consectetur diam egestas eleifend. Pellentesque egestas vel elit vel fermentum. Suspendisse sit amet mollis sem.
                    Ut sagittis dictum ex cursus imperdiet. Pellentesque at lacus eget orci condimentum venenatis nec sit amet nibh. Nam quis quam ut nunc blandit maximus vel finibus eros. Proin dapibus justo vel diam elementum maximus. Nunc vel elit vitae neque tempus accumsan. Maecenas sollicitudin lacinia efficitur. Donec nibh dui, malesuada sit amet feugiat in, viverra nec est. Fusce non velit nec lacus gravida blandit. Cras ac nisl arcu. Donec elementum ac orci convallis rutrum. Quisque eget commodo ipsum, et eleifend erat. Curabitur quis massa vel urna fringilla lacinia. Nulla rutrum ullamcorper enim quis cursus. Nullam tincidunt consectetur ante id sagittis. Cras pharetra, neque non porttitor convallis, nisl augue euismod dolor, at feugiat diam elit a tellus. Aliquam et odio ut arcu laoreet malesuada ut at lorem.
                </p>
            </div>
            <div className="buttons">
                <a href="/modifLesson" class="btn btn-primary">lecon precedente</a>
                <a href="/" class="btn btn-primary">Lecon suivante</a>
            </div>
        </div>
    )
}
            
export default CoursPrecis