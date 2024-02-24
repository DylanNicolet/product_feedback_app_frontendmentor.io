import React from "react"
import { useDispatch } from 'react-redux'
import "./sass/App.css"
import { Outlet, useLocation } from "react-router-dom"
import { updateState } from "./redux/appSlice"
import Header from "./layout/Header"
import Shade from "./components/Shade"
import About from "./components/About"
import Footer from "./layout/Footer"
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
    
    //Initialise local storage for cartData
    React.useEffect( () => {
        if ( !localStorage.getItem( 'cartData' ) ) {
            localStorage.setItem('cartData', JSON.stringify([]))
        }
    }, [] )

    const { pathname } = useLocation();

    return(
        <section className="app">
            <ScrollToTop />
            <Shade />
            <Header />
            <Outlet />
            {pathname != "/checkout" && <About />}
            <Footer />
        </section>
    )
}