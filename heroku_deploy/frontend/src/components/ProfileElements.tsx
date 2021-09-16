import React from 'react';

interface ProfileAttributes {
  _id: string;
  username: string;
  // password: string;
  email: string;
  // icone: string;
}

export const ProfileElements = ({
  profile: { _id, username, email },
}: {
  profile: ProfileAttributes;
}) => {
  return (
    <div className="username">
      <p> Test {username} </p>
    </div>
  );
};
