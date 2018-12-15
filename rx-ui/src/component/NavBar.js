import React, { Component } from 'react';
import { Link} from 'react-router-dom';

//import images
import logo from '../logo.svg';

const brandStyle = {color: '#fff', cursor: 'default'};

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
        };
    }

    render() {
        this.handle
        let navBar_left;
        if ( this.props.manage ) {
            navBar_left = 
                <div class='navbar-nav ml-auto'>
                    <Link to={'/manage'}><a class="nav-item nav-link" >Manage</a></Link>                            
                    <Link to='/'><a class="nav-item nav-link" onClick={this.props.handleLogout} >Logout</a></Link>
                </div>;
        }
        else if ( this.props.login ) {
            navBar_left = 
                <div class='navbar-nav ml-auto'>
                    <Link to={'/account'}><a class="nav-item nav-link" >Account</a></Link> 
                    <Link to={'/deliver'}><a class="nav-item nav-link" >Deliver</a></Link> 
                    <Link to={'/post'}><a class="nav-item nav-link" >Post</a></Link>                             
                    <Link to='/'><a class="nav-item nav-link" onClick={this.props.handleLogout} >Logout</a></Link>
                </div>;
        } else {
            navBar_left = 
                <div class='navbar-nav ml-auto'>
                    <Link to='/login'><a class="nav-item nav-link" >Login</a></Link>
                </div>;
        }

        return (
            <nav class="navbar navbar-expand-sm navbar-dark bg-dark navbar-static-top" >
                <a class="navbar-brand" >
                    <Link to='/'><img src={logo} width="120"  alt=""/></Link>
                </a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div class="navbar-nav mr-auto">
                        <Link to='/about'><a class="nav-item nav-link brandStyle" >About</a></Link>
                    </div>
                    {navBar_left}
                </div>
            </nav>
        );
    }
}

export default NavBar;