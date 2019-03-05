import React from 'react'
import { FaUserCircle } from 'react-icons/fa'

const ProfileSelect = (props) => {
  return (
    <div className="ProfileSelect">
      <FaUserCircle onClick={() => props.actions.setPage('/admin')} />
    </div>
  )
}

export default ProfileSelect