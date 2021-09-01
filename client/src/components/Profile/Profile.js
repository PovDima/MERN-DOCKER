import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { username } = useSelector((state) => state.user.user);

  return (
    <div className='container'>
      <p>
        Hey <b>{username}</b>
      </p>
    </div>
  );
};

export default Profile;
