import React from 'react'
import { Avatar } from "@mui/material";

const ProfileAvatar = ({ username }) => {
  return (
    <Avatar>{username.charAt(0).toUpperCase()}</Avatar>
  )
}

export default ProfileAvatar