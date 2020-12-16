import React, { Component } from 'react';
import './Home.css';
import mathe from '../../Images/math.jpg'
// import hommeordi from '../../Images/hommeordi.jpg'
import ecriture from '../../Images/ecriture.jpg'

class Home extends Component {
    render() {
        return (
            <div>
                <Carrousel />
                <Txt />
            </div>

        );
    }
} export default Home

export const Carrousel = () => {
    // mettre du code js ici si besoin
    return (
        <div className="col-10 offset-1 " id="caroustyle">
            <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                <ol className="carousel-indicators">
                    <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                </ol>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img className="d-block w-100" src={ecriture} height="300px" alt="Second slide"></img>
                    </div>
                    <div className="carousel-item">
                        <img className="d-block w-100" src={mathe} height="300px" alt="First slide"></img>
                    </div>
                    <div className="carousel-item">
                        {/* <img class="d-block w-100" src={hommeordi} height="300px" alt="First slide"></img> */}
                        <img class="d-block w-100"  height="300px" alt="First slide"></img>
                    </div>
                </div>
            </div>
            <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
            </a>
            <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="sr-only">Next</span>
            </a>
        </div>
    )
}

export const Txt = () => {
    return (
        <div>
            <div className="row">
                <div className="col-10 offset-1" id="ligne">
                    <p className="pHome">Bienvenue sur Fée des maths ! Sur ce site vous trouverez des cours sous format vidéo avec de nombreux quizz d’applications ainsi que des exercices avec corrections. Bienvenue dans le monde merveilleux des mathématiques ! Bonne visite et bons progrès !</p>
                </div>
            </div>
            <div className="row" id="data">
                <div className="col-4 offset-1" id="margeleft">
                    <p className="pHome">Non ! Vous n’êtes pas nul en maths ! Si vos résultats vous font penser le contraire, beaucoup de professeurs l’affirment : personne n’est vraiment « nul » en mathématiques. Si vous pensez toujours le contraire, il faut comprendre que cette matière n’est faite que de logique. Et c’est cette dernière que vous devez apprendre à déchiffrer. Avec un peu de travail sur Fée des maths, vous parviendrez sûrement à réhausser votre moyenne en maths !</p>
                </div>
                <div className="col-6" id="video">
                    <div className="row justify-content-center">
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/wrNLKRX99Og" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                    <p className="pHome">Le cours de maths a été compliqué ? Vous ne l’avez pas compris ou peu ? Cela arrive évidemment. Et vous vous dîtes que vous comprendrez mieux au prochain cours ? C’est possible, cependant la meilleure solution pour vous reste de creuser la question vous-même en prenant le temps. Servez-vous de nos cours vidéos et quizz ! Une fois le cours assimilé, jetez-vous dans le bain avec les exercies et prenez le risque de faire des erreurs. Les exercices corrigés vous permettront de les identifier pour mieux les comprendre. Ceci est probablement l’une des meilleures méthodes pour progresser en maths !</p>
                </div>
            </div>
        </div >
    )
}

