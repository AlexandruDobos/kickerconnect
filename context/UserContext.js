import React, { createContext, useContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  const updateUserData = (newUserData) => {
    setUserData(newUserData);
    if (newUserData && newUserData.id) {
      } else {
        console.log("Nu există un ID în obiectul newUserData sau obiectul este nedefinit.");
      }
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
