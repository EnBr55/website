import React from 'react'
import './Projects.css'
import { Link } from 'react-router-dom'
import snakesGIF from './Resources/snakes.gif'
import antsGIF from './Resources/ants.gif'
import plants from './Resources/plants.png'
import famsitePreview from './Resources/famsite.png'

const Projects: React.FC = () => {
  return (
    <div className="Projects">
      <h1>Stuff I'm working on</h1>
      <div className="project" >
        <a href='https://famsite.benbraham.com'>
          <h2>Famsite (Working Name)</h2>
          <img src={famsitePreview} alt='preview of the website' />
          <p>
            A unified collaboration tool suite. Individuals can create and invite others to <b>boards</b> which house collections of user-implemented <b>modules</b> from pre-made templates. Each module comes with its own customisation options to allow users to fit them to the needs of their board.
          </p>
          <p>
            Current modules include a group chat, and a todo-list. In development is a group calendar system.
          </p>
          <p>
            Each module stores its data in a realtime database, meaning everyone can interact with all the elements of the app in real-time, making this ideal for collaboration.
          </p>
          <p>
            The app is still very much a work-in-progress, but the proof of concept is live and functional.
          </p>
        </a>
      </div>
      <hr />
      <div className="project" >
        <Link to='ants'>
          <h2>Ants (?)</h2>
          <img src={antsGIF} alt='ants in action' />
          <p>
            Just a weird emergence kind of thing. Lots of tweakable parameters that dramatically change the simulator. In principle, there are a bunch of ants that leave trails, and other ants sample the ground in front of them to detect these trails and possibly follow them.
          </p>
          <p>
            Inspired by <u><a style={{color: '#22af22'}} href='https://www.youtube.com/channel/UCmtyQOKKmrMVaKuRXz02jbQ'>Sebastian Lague</a></u>.
          </p>
        </Link>
      </div>
      <hr />
      <div className="project" >
        <Link to='snakes'>
          <h2>Snakes</h2>
          <img src={snakesGIF} alt='an animated GIF of the snakes' />
          <p>Primitive 'snakes' that evolve through neuroevolution. Each snake has its own neural network, initially with completely random weights and biases. After each generation, the longest living snakes are selected and mutated slightly to create a new generation of snakes. Over time, snakes typically learn to avoid collisions with each other and the walls. Additionally, food is placed periodically within the walls of the simulation; and snakes that die from a collision with another snake will also turn into food. After significant evolution and a bit of luck, the snakes should learn to differentiate between food and foe.</p>
          <p>Food currently disabled until I get time to fix some issues with the simulation.</p>
        </Link>
      </div>
      <hr />
      <div className="project" >
        <Link to='plants'>
          <h2>Plants</h2>
          <img src={plants} alt='preview of plants simulator' />
          <p>Plant evolution/competition simulator -- currently featuring a total of 0 plants</p>
        </Link>
      </div>
      <hr />
      <div className="project">
        <h2>Coming Soon</h2>
        <p>
          I'm in the process of designing this website and moving over some of
          my projects. Stay tuned!
        </p>
      </div>
      <hr />
    </div>
  )
}

export default Projects
