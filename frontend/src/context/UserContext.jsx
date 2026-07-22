import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => setSoundEnabled((prev) => !prev);

  return (
    <UserContext.Provider value={{ soundEnabled, toggleSound }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
