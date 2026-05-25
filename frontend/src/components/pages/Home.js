import React, { Component } from 'react';
import Profile from './profile/Profile';

class Home extends Component {
    render() {
        return (
            <div className = "home-container">
                <div id = "profile-container">
                    <Profile/>
                </div>
                <div id = "dating-container">
                    <h3>dating profiles</h3>
                </div>
            </div>
        )
    }
}

export default Home;