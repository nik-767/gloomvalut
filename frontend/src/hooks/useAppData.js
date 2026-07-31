import { useState } from 'react';

export const useAppData = () => {
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [tags] = useState([]);

  return { users, setUsers, profiles, setProfiles, tags };
};
