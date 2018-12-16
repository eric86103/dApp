import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Style.css';

//slides
import slide1 from './img/1.png';
import slide2 from './img/2.png';
import slide3 from './img/3.jpg';

class HomePage extends Component {
    constructor(props) {
        super(props);
    }
    
    
    render() {
        var deck_1 = [];
        for(let i=0; i<this.props.items.length; ++i){
            if(i<3){
                if(this.props.items[i].bought === false) {
                    let itemCard = 
                    <div class="card">
                        <Link to={'/shop/'+this.props.items[i].productName}><img class="card-img-top maximage"  src="https://images-na.ssl-images-amazon.com/images/I/A1DL5LiwXRL._SX425_.jpg"/></Link>
                        <div class="card-body">
                            <h5 class="card-title">{this.props.items[i].productName}</h5>
                        </div>
                        <div class="card-footer">
                            <small class="text-muted">Price: {this.props.items[i].price}</small>
                        </div>
                    </div>;
                    deck_1.push(itemCard);
                }
            }
        }

        var deck_2 = [];
        for(let i=3; i<this.props.items.length; ++i){
            if(i<6){
                if(this.props.items[i].bought === false) {
                    let itemCard = 
                    <div class="card">
                        <Link to={'/shop/'+this.props.items[i].productName}><img class="card-img-top"  src='' /></Link>
                        <div class="card-body">
                            <h5 class="card-title">{this.props.items[i].productName}</h5>
                        </div>
                        <div class="card-footer">
                            <small class="text-muted">Price: {this.props.items[i].price}</small>
                        </div>
                    </div>;
                    deck_2.push(itemCard);
                }
            }
        
        }
        

        return (
            <div>
                <div id="slideControls" class="carousel slide container" data-ride="carousel">
                    <div class="carousel-inner center">
                        <div class="carousel-item active">
                            <img src={slide1} class="img-responsive center banner" alt="Responsive image"/>
                        </div>
                        <div class="carousel-item">
                            <img src={slide2} class="img-responsive center" alt="Responsive image"/>
                        </div>
                        <div class="carousel-item">
                            <img src={slide3} class="img-responsive center" alt="Responsive image"/>
                        </div>
                    </div>
                    <a class="carousel-control-prev" href="#slideControls" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next" href="#slideControls" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
                </div>
                <div class='center'>
                    <div id="deck1" class="card-deck">
                        {deck_1}
                    </div>
                    <div id="deck1" class="card-deck">
                        {deck_2}
                    </div>
                </div>

            </div>
        );
    }
}

export default HomePage;