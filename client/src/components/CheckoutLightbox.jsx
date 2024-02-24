import React from "react"
import tick from "../assets/checkout/icon-order-confirmation.svg"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import $ from 'jquery'

export default function CheckoutLightBox() {
    //states
    let [ cartData, setCartData ] = React.useState( JSON.parse( localStorage.getItem( "cartData" ) || "[]" ) )
    let product = cartData[ 0 ]
    let productPrice = product.amount * product.price
    let [ totalCart, setTotalCart ] = React.useState( 0 )
    
    //Get screenwidth from REDUX
    const screenWidth = useSelector( state => state.appState.screenWidth )

    //Remove last word of product's name to match Figma model
    let lastIndex = product.name.lastIndexOf(" ");
    let productName = product.name.substring( 0, lastIndex )

    //Determine total cart amount
    React.useEffect( () => {
        setTotalCart( 0 )
        
        cartData.map( ( product ) => {
            setTotalCart( ( prev ) => ( prev + (product.price * product.amount) ) )
        } )
    }, [] )

    function closeShade() {
        $( ".shade" ).fadeToggle( 700 );
    }

    return (
        <section className="checkout-lightbox">
            <img src={tick} alt="tick" />
            <h1 className="lightbox__title">THANK YOU <br></br> FOR YOUR ORDER</h1>
            <p className="lightbox__description">You will receive an email confirmation shortly.</p>

            <section className="cart-and-price">
                <section className="cart">
                    <section className="cart__product">
                        <img src={product.cartImage} alt={productName} />
                        <section className="cart__title-price">
                            <h4>{productName}</h4>
                            <p>$ { productPrice.toLocaleString() }</p>
                        </section>
                        <p className="cart__quantity">x{ product.amount }</p>
                    </section>

                    <section className="deco-line"></section>

                    { cartData.length > 1 && <p className="other-items">and { cartData.length - 1 } other items(s)</p>}
                </section>

                <section className="price">
                    <p className="price__title">GRAND TOTAL</p>
                    <p className="price__number">$ { totalCart.toLocaleString() }</p>
                </section>
            </section>

            <Link to={`/`}><button className="button-back-home button--light" onClick={closeShade}>BACK TO HOME</button></Link>
        </section>
    )
}