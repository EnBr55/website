import React from 'react'
import './Projects.css'

const Projects: React.FC = () => {
  return (
    <div className='Projects'>
      <h1>Stuff I'm working on</h1>
      <div className='project'>
        <h2>Some Project</h2>
        <p>
          Some information about the project. Perhaps an image or gif. A link to
          the project is also here somewhere.
        </p>
      </div>
      <hr />
    </div>
  )
}

export default Projects
