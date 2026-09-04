import React from 'react';
import './loader.css'; // Ensure this file contains the relevant CSS

const Loader = () => {
    return (
        <div className="overlay">
            <div id="page">
                <div id="container">
                    <div id="ring"></div>
                    <div id="ring"></div>
                    <div id="ring"></div>
                    <div id="ring"></div>
                    <div id="h3">
                        <img src="https://i.postimg.cc/yYsngF3z/Career-Vallet-Logo.png" width="60px" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Loader;
