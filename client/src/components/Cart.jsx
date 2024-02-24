import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { updateCartOpen } from "../redux/appSlice"
import $ from 'jquery'

export default function Cart() {
    //States
    let [ totalCart, setTotalCart ] = React.useState( 0 )
    let [ cartData, setCartData ] = React.useState( JSON.parse( localStorage.getItem( "cartData" ) || "[]" ) )
    let [ checkoutButton, setCheckoutButton ] = React.useState( "CHECKOUT" )

    const dispatch = useDispatch()
    
    //Get screenwidth from REDUX
    const screenWidth = useSelector( state => state.appState.screenWidth )

    //Determine total cart amount
    React.useEffect( () => {
        setTotalCart( 0 )
        
        cartData.map( ( product ) => {
            setTotalCart( ( prev ) => ( prev + (product.price * product.amount) ) )
        } )
        
        localStorage.setItem("cartData", JSON.stringify(cartData))
    }, [ cartData ] )
    
    //Change checkout button content if total cart changes
    React.useEffect( () => {
        if (checkoutButton === "CART IS EMPTY" && totalCart > 0 ) {
            setCheckoutButton("CHECKOUT")
        }
    }, [totalCart])
    
    function decrementCounter( index ) {
        if ( cartData[ index ].amount > 0 ) {
            let newCart = cartData.slice()
            newCart[ index ].amount = newCart[ index ].amount - 1
            setCartData(newCart)
        }
    }

    function increaseCounter( index ) {
        let newCart = cartData.slice()
        newCart[ index ].amount = newCart[ index ].amount + 1
        setCartData(newCart)
    }

    function resetCart() {
        setCartData([])
    }

    function closeCart(e) {
        if ( totalCart != 0 ) {
            dispatch( updateCartOpen( { cartOpen: false, } ) )
            $( ".shade" ).fadeToggle( 700 );
        } else {

            setCheckoutButton( "CART IS EMPTY" )
            e.preventDefault()
        }
    }
        
    let products = cartData.map( ( product, index ) => {

        //Remove last word of product's name to match Figma model
        let lastIndex = product.name.lastIndexOf(" ");
        let productName = product.name.substring( 0, lastIndex )

        return (
            <section className="product" key={index}>
                <img src={product.cartImage} alt={product.name} className="product__image"/>

                <section className="title-and-price">
                    <h3 className="title">{ productName }</h3>
                    <p className="price">{"$ " + (product.price * product.amount).toLocaleString()}</p>
                </section>

                <section className="counter">
                        <button className="counter__button" onClick={e => decrementCounter(index)}>-</button>
                        <p className="counter__number">{product.amount}</p>
                        <button className="counter__button" onClick={e => increaseCounter(index)}>+</button>
                </section>
            </section>
        )
    } )

    return (
        <section className="modal-cart">
            <section className="header">
                <h2 className="title">CART ({cartData.length})</h2>
                <button className="button-remove-all" onClick={resetCart}>Remove all</button>
            </section>

            <section className="products-block">
                {products}
            </section>

            <section className="total-container">
                <p className="total">TOTAL</p>
                <p className="total-amount">$ {totalCart}</p>
            </section>

            
            <Link to={`/checkout`} onClick={e => closeCart(e)}><button id="button-checkout" className="button--light">{checkoutButton}</button></Link>
            
        </section>
    )
}