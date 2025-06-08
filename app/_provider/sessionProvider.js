"use client"

import { createContext, useContext, useState } from "react"

const SessionContext = createContext(null);

export const SessionProvider = ({children, defaultValue}) => {
    const [session, setSession] = useState(defaultValue);
    return(
        <SessionContext.Provider value={{...session, isAdmin: session?.role === "admin", setSession}}>
            {children}
        </SessionContext.Provider>
    )
}

export const useSession = () => useContext(SessionContext);