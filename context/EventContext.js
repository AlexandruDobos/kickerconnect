import React, { createContext, useContext, useState } from 'react';

const EventContext = createContext();

export const EventProvider = ({ children }) => {
    const [eventData, setEventData] = useState(null);

    const updateEventData = (event) => {
        setEventData(event);
    };

    return (
        <EventContext.Provider value={{ eventData, updateEventData }}>
            {children}
        </EventContext.Provider>
    );
};

export const useEvent = () => {
    return useContext(EventContext);
};
