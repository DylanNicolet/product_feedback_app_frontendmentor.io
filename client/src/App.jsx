import React from "react"
import { useDispatch } from 'react-redux'
import "./sass/App.css"
import { Outlet, useLocation } from "react-router-dom"
import { updateState } from "./redux/appSlice"
import ScrollToTop from "./components/ScrollToTop"

export default function App(){
    //update Redux
    const dispatch = useDispatch()
    function updateScreenWidth(width){
        dispatch(updateState(
            {
                screenWidth: width,
            }
        ))
    }

    //Find screensize
    React.useEffect(() => {
        const handleWindowResize = () => {
          updateScreenWidth(window.innerWidth)
        }
    
        window.addEventListener('resize', handleWindowResize)
    
        return () => {
          window.removeEventListener('resize', handleWindowResize)
        }
    }, [] )

    const { pathname } = useLocation();

    return(
        <section className="app">
            <ScrollToTop />
            <Outlet />
        </section>
    )
}