import React from 'react'

const Greeting: React.FC<{ usernames: string[] }> = ({ usernames }) => {
  return (
    <div>
      {usernames.map((username: string) => (
        <p key={username}>Heyy, {username}</p>
      ))}
    </div>
  )
}

export default Greeting