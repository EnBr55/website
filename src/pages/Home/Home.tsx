import React from 'react'
import './Home.css'

const Home: React.FC = () => {
  return (
    <div className="Home">
      <h1>Hey, I'm Ben.</h1>
      <div className="Bio">
        <h2>About me &#127925;</h2>
        <p>
          Thanks for checking out my website &#128513;
          <br />
          I'm a student from Sydney, Australia. I'm currently pursuing a
          Bachelor of <i>Advanced Computing and Science</i> at the Univeristy of
          Sydney, majoring in computer science and physics. I'm very passionate
          about the work I'm doing so feel free to shoot me a message about it!
        </p>
        <p>
          In my free time I enjoy programming, and both performing and composing
          music. I've been programming as a hobby for about five years now, and
          have played the piano since I was six years old. In recent years, I
          have been composing my own music, which may eventually be linked here.
        </p>
          <p>
            Recently, I have worked at <i>Envisage Software Solutions</i> as a junior software developer; primarily working with React to develop webapps.
            </p>
        <h2>Technical Skills &#128295;</h2>
        <h3>Programming</h3>
        <h4>Preferred Languages</h4>
        JavaScript, TypeScript, Python, Java, C, Bash, R, Lua
        <br />
        <br />
        <h4>Frameworks / Tools</h4>
        React, Processing, p5.js, Matter.js, Node.js, Firebase, Google Cloud
        <br />
        <br />
        <h3>Multimedia</h3>
        <ul>
          <li>Image manipulation using GIMP and Adobe Photoshop</li>
          <li>Video editing using Adobe After Effects, Sony Vegas Pro.</li>
          <li>
            Music production and audio design using FL Studio, composition using
            Sibelius and Musescore
          </li>
        </ul>
        <p>
          My preferred development environment is a system running Arch Linux. I
          like to use vim as my primary editor when possible. Most of my general
          configuration can be found{' '}
          <a href="https://github.com/enbr55/dotfiles">here</a>.
        </p>
        <h2>Projects &#128161;</h2>
        <p>
          I'm working on new projects all the time. I love to hear suggestions
          on fun things to develop. Some of the stuff that I'm working on, or
          have worked on, can be found in the <a href="/projects">projects</a>{' '}
          section.
        </p>
        <p>
          A lot of my work (including{' '}
          <a href="https://github.com/EnBr55/website">
            all the source code for this website
          </a>
          ) can be found on <a href="https://github.com/EnBr55">my GitHub</a>.
        </p>
        <h2>Contact &#128075;</h2>
        <p>I'd love to get in touch :)</p>
        <p>
          Email: <a href="mailto:ben@benbraham.com">ben@benbraham.com</a>
          <br />
          Mobile: +61 481 394 909
        </p>
      </div>
    </div>
  )
}

export default Home
