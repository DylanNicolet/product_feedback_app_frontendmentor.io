import React from "react"
import $ from 'jquery'
import { useSelector, useDispatch } from "react-redux"
import { updateCartOpen } from "../redux/appSlice"

export default function Shade() {
    
    //REDUX states
    const dispatch = useDispatch()
    const cartOpen = useSelector( state => state.appState.cartOpen )
    
    //Hide menu on mobile and tablette
    function toggleMenu(){

        if ($('.mobile-nav').css('display') == 'block'){
            $( ".mobile-nav" ).slideToggle( 700 );
            
            setTimeout(() => {
                $(".shade").fadeToggle();
            },  200)
        }

        if ( cartOpen === true ) {
            dispatch( updateCartOpen( { cartOpen: !cartOpen, } ) )
            $(".shade").fadeToggle();
        }
    }

    return(
        <section 
            className="shade"
            style={{"display" : "none"}}
            onClick={toggleMenu}
        ></section>
    )
}