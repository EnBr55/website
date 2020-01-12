import React from 'react'
import './Projects.css'
import { Link } from 'react-router-dom'

const Projects: React.FC = () => {
  return (
    <div className="Projects">
      <h1>Stuff I'm working on</h1>
      <div className="project" >
        <Link to='snakes'>
          <h2>Snakes</h2>
          <p>Some description I'll probably write later.</p>
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
