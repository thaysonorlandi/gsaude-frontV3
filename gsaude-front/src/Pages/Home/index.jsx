import {useEffect} from 'react'
import './style.css'
import Api from '../../services/api'

function Home() {

  let users = []

  async function getUsers() {
   users = await Api.get('/users') 
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div>
      <div> 
        <h1>Hello World</h1>
      </div>
      {users.map((user, index) => (
        <div key={index}>
          <h2>{user.name}</h2>
          <p>Age: {user.age}</p>
          <p>Email: {user.email}</p>
        </div>
      ))}
    </div>
  )
}

export default Home
