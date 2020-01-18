import React from 'react';
import linkedinLogo from '../../images/linkedin-logo.png';
import githubLogo from '../../images/github-logo.png';


const Contact = () => {
    return (
        <div id="contact">
            <p>Created by <a href="WEBSITE_LINK ">Nicholas Williams</a></p>
            <div id="icons">
                <a id="github" href="GITHUB LINK" target="_blank" rel="noopener noreferrer">
                    <img src={githubLogo} alt="an 8-bit version of the Github logo"/>
                </a>
                <a id="linkedin" href="LINKEDIN LINK" target="_blank" rel="noopener noreferrer">
                    <img src={linkedinLogo} alt="an 8-bit version of the LinkedIn logo"/>
                </a>
            </div>
        </div>
    )
};

export default Contact;