import React from 'react';
import { Link } from 'react-router-dom';
import ResumeDownload from './ResumeDownload';

export interface AboutProps {}

const About: React.FC<AboutProps> = () => {
    return (
        <div className="site-page-content">
            <h1 style={{ marginLeft: -16 }}>Welcome</h1>
            <h3>I'm Aayush Agrawal</h3>
            <br />
            <div className="text-block">
                <p>
                    I'm an undergraduate in Artificial Intelligence &amp; Machine
                    Learning at BMS College of Engineering in Bangalore, expected
                    to graduate in 2028. I build small, useful software: Python
                    tools, Discord bots and websites.
                </p>
                <br />
                <p>
                    Thanks for taking the time to check out my portfolio. If you
                    have any questions or want to work together, reach out using{' '}
                    <Link to="/contact">this form</Link> or email me at{' '}
                    <a href="mailto:agrawal.aayush38@gmail.com">
                        agrawal.aayush38@gmail.com
                    </a>
                    .
                </p>
            </div>
            <ResumeDownload />
            <div className="text-block">
                <h3>About Me</h3>
                <br />
                <p>
                    I like building things from scratch, whether that's a quick
                    Python utility, a bot for a community, or a long dig into how
                    a model actually learns. Most of my projects start as
                    something I wanted for myself, like the{' '}
                    <Link to="/projects/tools">Attendance Calculator</Link>{' '}
                    shortcut that tells me how many classes I can skip.
                </p>
                <br />
                <p>
                    I'm part of <b>@clienterrverse</b>, where I work on
                    open-source projects with other developers and learn how
                    real-world software gets made. You can find those on my{' '}
                    <Link to="/projects/software">Websites</Link> page.
                </p>
                <br />
                <h3>Outside of code</h3>
                <br />
                <p>
                    At college I volunteer for BMSCE UTSAV, our fest, and I'm a
                    member of the Rotaract Club of BMSCE, doing community service
                    around Bengaluru. When I'm not coding, I'm reading docs,
                    taking things apart to see how they work, and collecting
                    ideas for the next side project, usually with a cold can of White.
                </p>
                <br />
                <h3>Tools I use</h3>
                <br />
                <p>
                    Python, JavaScript, Java, C, HTML &amp; CSS, Node.js,
                    Discord.js, MySQL, MongoDB, Machine Learning and Git. I speak
                    English, Hindi and Nepali.
                </p>
                <br />
                <p>Thanks for stopping by, and enjoy the rest of the site!</p>
            </div>
        </div>
    );
};

export default About;
