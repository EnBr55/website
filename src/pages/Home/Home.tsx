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
          I'm a student from Sydney, Australia, currently studying computer
          science and physics at the Univeristy of Sydney. I'm very passionate
          about the work I'm doing so feel free to shoot me a message about it!
          <br />
          <br />
          In my free time I enjoy programming, and both performing and composing
          music. I've been programming as a hobby for about five years now, and
          have played the piano since I was six years old. In recent years, I
          have been composing my own music, which may eventually be linked here.
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
          Vestibulum nec consectetur metus, at tristique nisi. Integer nec
          posuere lectus, ac dictum orci. Suspendisse tristique ipsum a egestas
          congue. Proin sagittis rhoncus dapibus. Curabitur aliquet erat eu
          ullamcorper egestas. In vulputate bibendum massa elementum dapibus.
          Mauris pellentesque dolor vel fringilla posuere. Vestibulum dolor
          lorem, mollis at malesuada nec, vehicula in neque. Nam hendrerit
          ligula a lacus efficitur semper. Phasellus finibus rutrum augue
          accumsan sagittis.
        </p>
        <h2>Contact &#128075;</h2>
        <p>
          Curabitur id purus sed magna molestie varius luctus id nibh. Proin
          sagittis, est eu congue condimentum, dui leo pretium sapien, vel
          vestibulum libero mauris tempor mauris. Aliquam libero erat, pharetra
          a rhoncus a, maximus eget ex. Duis non accumsan magna. Sed tincidunt,
          felis fringilla facilisis egestas, dolor augue condimentum turpis, eu
          convallis dui elit sodales lacus. Suspendisse et libero pharetra,
          bibendum velit ac, sagittis velit. Pellentesque gravida placerat dui
          vel bibendum. Proin auctor, massa sed tempus pretium, velit augue
          faucibus dolor, eget cursus tortor lorem non nisi. Sed tristique ex
          vel consectetur consequat. Ut tortor ante, lobortis quis orci ut,
          sagittis interdum magna.
        </p>
      </div>
    </div>
  )
}

export default Home
