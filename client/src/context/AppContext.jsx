import { createContext, useContext, useState } from "react";

const AppContext=createContext(undefined);

export function AppContextProvider({children}){

    //Auth States
    const [user,setUser]=useState(null);
    const [loadingUser,setLoadingUser]=useState(true);

    return(
    <AppContext.Provider value={{}}>
        {children}
    </AppContext.Provider>
     )
}

//function that prevents silent bugs by throwing a clear error if i accidentally try to read context in a component that isn't wrapped inside <AppContextProvider>.
function useAppContext(){
    const context=useContext(AppContext)

    if(context === undefined){
        throw new Error("useAppContext must be used within an AppContextProvider")
    }
    return context;
}