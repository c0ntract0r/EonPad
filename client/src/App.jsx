import React, { useEffect, useState } from 'react'
import { api } from './services/api'

function App() {
  useEffect(() => {
    api
      .get("register")
      .then((response) => {console.log(response.data)})
      .catch((err) => {
        console.log(`Error: ${err}`);
      })
  }, []);

  return (
    <div className='App'>
      <h1>I hope u see this!</h1>
    </div>
  )

}

export default App
