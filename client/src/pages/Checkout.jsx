import React from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import CheckoutLightBox from "../components/CheckoutLightbox"
import $ from 'jquery'
import cashOnDeliveryImg from "../assets/checkout/icon-cash-on-delivery.svg"

export default function Checkout() {
    //States
    let [ totalCart, setTotalCart ] = React.useState( 0 )
    let [ cartData, setCartData ] = React.useState( JSON.parse( localStorage.getItem( "cartData" ) || "[]" ) )
    let [ vat, setVat ] = React.useState( 0 )
    let [ grandTotal, setGrandTotal ] = React.useState( 0 )
    let [ lightboxOpen, setLightboxOpen ] = React.useState( false )
    
    //Form data states 
    let [ formData, setformData ] = React.useState({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        zip: "",
        city: "",
        country: "",
        paymentMethod: "e-money",
        moneyNumber: "",
        moneyPin: ""
    })

    //Get screenwidth from REDUX
    const screenWidth = useSelector( state => state.appState.screenWidth )

    //Determine totalCart and VAT
    React.useEffect( () => {
        cartData.map( ( product ) => {
            setTotalCart( ( prev ) => ( prev + (product.price * product.amount) ) )
        } )
    }, [] )

    //Determine VAT as 20% of total excluding shipping
    React.useEffect( () => {
        setVat( Math.round( ( 20 / 100 ) * totalCart ) )
    }, [ totalCart ] )

    //Determine grandTotal
    React.useEffect( () => {
        setGrandTotal(totalCart + 50)
    }, [ vat ] )

    let products = cartData.map( ( product, index ) => {

        //Remove last word of product's name to match Figma model
        let lastIndex = product.name.lastIndexOf(" ");
        let productName = product.name.substring(0, lastIndex);

        return (
            <section className="product" key={index}>

                <img src={product.cartImage} alt="image" className="product__image"/>

                <section className="title-and-price">
                    <h3 className="title">{ productName }</h3>
                    <p className="price">{"$ " + (product.price * product.amount).toLocaleString()}</p>
                </section>

                <section className="counter">
                        <p className="counter__number">x{product.amount}</p>
                </section>
                
            </section>
        )
    } )

    //Update form data on change for every input
    function updateFormData( e ) {
        const { name, value } = e.target
        
        setformData( ( prev ) => {
            return {...prev, [name]: value}
        } )
    }

    //Validate form data at submit
    function formValidator() {

        //REGEX
        let regName = /^[a-zA-Z]+ [a-zA-Z]+$/
        let regEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/
        let regMoneyNumber = /\d{9}/
        let regMoneyPin = /\d{4}/

        //TESTS
        !regName.test( formData.name ) ? $( '#name-container' ).addClass( '--invalid' ) : $( '#name-container' ).removeClass( '--invalid' )
        !regEmail.test( formData.email ) ? $( '#email-container' ).addClass( '--invalid' ) : $( '#email-container' ).removeClass( '--invalid' )
        !formData.phoneNumber ? $( '#phoneNumber-container' ).addClass( '--invalid' ) : $( '#phoneNumber-container' ).removeClass( '--invalid' )
        !formData.address ? $( '#address-container' ).addClass( '--invalid' ) : $( '#address-container' ).removeClass( '--invalid' )
        !formData.zip ? $( '#zip-container' ).addClass( '--invalid' ) : $( '#zip-container' ).removeClass( '--invalid' )
        !formData.city ? $( '#city-container' ).addClass( '--invalid' ) : $( '#city-container' ).removeClass( '--invalid' )
        !formData.country ? $( '#country-container' ).addClass( '--invalid' ) : $( '#country-container' ).removeClass( '--invalid' )

        if ( formData.paymentMethod === "e-money" ) {
            !regMoneyNumber.test( formData.moneyNumber ) ? $( '#moneyNumber-container' ).addClass( '--invalid' ) : $( '#moneyNumber-container' ).removeClass( '--invalid' )
            !regMoneyPin.test( formData.moneyPin )? $( '#moneyPin-container' ).addClass( '--invalid' ) : $( '#moneyPin-container' ).removeClass( '--invalid' )
        }
        else if ( formData.paymentMethod === "cash-on-delivery" ) {
            $( '#moneyNumber-container' ).removeClass( '--invalid' )
            $( '#moneyPin-container' ).removeClass( '--invalid' )
        }
        
        setTimeout(() => {
            if ( !$( ".--invalid" ).length ) {
                $( ".shade" ).show();
                setLightboxOpen(true)
            }
            else if ( $( ".--invalid" ).length ) {
                $( "html, body" ).animate( {
                    scrollTop: 0
                }, 1000 );
            }
        }, 100);
    }

    function handleUpdateInput( e ) {
        //Removes invalid styling when user clicks the input
        $( e.target ).parent().removeClass( '--invalid' );
    }

    return (
        <section className="checkout">
            <Link to={'..'} className="go-back">Go Back</Link>
            
            <form className="checkout-form">
                <h1 className="checkout-form__title">CHECKOUT</h1>

                <section className="billing-details">
                    <h2 className="checkout-form__subtitle">BILLING DETAILS</h2>

                    <section className="label-input" id="name-container">
                        <label htmlFor="name">Name</label>
                        <p className="invalid-text">{!formData.name.length ? "Empty field" : "Wrong format"}</p>
                        <input type="text" placeholder="Alexei Ward" name="name" id="name" value={formData.name} onChange={updateFormData} onClick={e => handleUpdateInput(e)}/>
                    </section>

                    <section className="label-input" id="email-container">
                        <label htmlFor="email">Email Address</label>
                        <p className="invalid-text">{!formData.email.length ? "Empty field" : "Wrong format"}</p>
                        <input type="email" placeholder="alexei@mail.com" name="email" id="email" value={formData.email} onChange={updateFormData} onClick={e => handleUpdateInput(e)}/>
                    </section>

                    <section className="label-input" id="phoneNumber-container">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <p className="invalid-text">Empty field</p>
                        <input type="number" placeholder="+1 (202) 555-0136" name="phoneNumber" id="phone" value={formData.phoneNumber} onChange={updateFormData} onClick={e => handleUpdateInput(e)}/>
                    </section>
                </section>

                <section className="shipping-info">
                    <h2 className="checkout-form__subtitle">SHIPPING INFO</h2>

                    <section className="label-input address" id="address-container">
                        <label htmlFor="address">Your Address</label>
                        <p className="invalid-text">Empty field</p>
                        <input type="text" placeholder="1137 Williams Avenue" name="address" id="address" onChange={updateFormData} onClick={e => handleUpdateInput(e)}/>
                    </section>

                    <section className="label-input" id="zip-container">
                        <label htmlFor="zip">ZIP Code</label>
                        <p className="invalid-text">Empty field</p>
                        <input type="number" placeholder="10001" name="zip" id="zip" onChange={updateFormData} onClick={e => handleUpdateInput(e)}/>
                    </section>

                    <section className="label-input" id="city-container">
                        <label htmlFor="city">City</label>
                        <p className="invalid-text">Empty field</p>
                        <input type="text" placeholder="New York" name="city" id="city" onChange={updateFormData} onClick={e => handleUpdateInput(e)}/>
                    </section>

                    <section className="label-input" id="country-container">
                        <label htmlFor="country">Country</label>
                        <p className="invalid-text">Empty field</p>
                        <input type="text" placeholder="United States" name="country" id="country" onChange={updateFormData} onClick={e => handleUpdateInput(e)}/>
                    </section>
                </section>

                <section className="payment-details">
                    <h2 className="checkout-form__subtitle">PAYMENT DETAILS</h2>

                    <fieldset>
                        <h3 className="payment-method-title">Payment method</h3>
                        <section className={"radio-container " + (formData.paymentMethod === "e-money" ? "--selected" : "")}>
                            <input type="radio" value="e-money" name="paymentMethod" id="e-money" defaultChecked onClick={updateFormData}/>
                            <label htmlFor="e-money">e-Money</label>
                        </section>

                        <section className={"radio-container cash-on-delivery " + (formData.paymentMethod === "cash-on-delivery" ? "--selected" : "")}>
                            <input type="radio" value="cash-on-delivery" name="paymentMethod" id="cash-on-delivery" onClick={updateFormData}/>
                            <label htmlFor="cash-on-delivery">Cash on Delivery</label>
                        </section>
                    </fieldset>

                    {formData.paymentMethod === "e-money" &&
                        <section className="label-input" id="moneyNumber-container">
                            <label htmlFor="moneyNumber">e-Money Number</label>
                            <p className="invalid-text">{!formData.moneyNumber.length ? "Empty field" : "Wrong format"}</p>
                            <input type="number" placeholder="238521993" name="moneyNumber" id="moneyNumber" onChange={updateFormData} onClick={e => handleUpdateInput(e)}/>
                        </section>
                    }

                    {formData.paymentMethod === "e-money" &&
                        <section className="label-input" id="moneyPin-container">
                            <label htmlFor="moneyPin">e-Money PIN</label>
                            <p className="invalid-text">{!formData.moneyPin.length ? "Empty field" : "Wrong format"}</p>
                            <input type="number" placeholder="6891" name="moneyPin" id="moneyPin" onChange={updateFormData} onClick={e => handleUpdateInput(e)}/>
                        </section>
                    }

                    {formData.paymentMethod === "cash-on-delivery" &&
                        <section className="cash-on-delivery-container">
                            <img src={cashOnDeliveryImg} alt="Cash on delivery" />
                            <p>The 'Cash on Delivery' option enables you to pay in cash when our delivery courier arrives at your residence. Just make sure your address is correct so that your order will not be cancelled.</p>
                        </section>
                    }
                </section>
            </form>

            <section className="summary">
                <h2 className="summary__title">SUMMARY</h2>

                <section className="products-block">
                    {products}
                </section>

                <section className="summary__amount">
                    <p className="description">TOTAL</p>
                    <p className="amount">$ { totalCart.toLocaleString() }</p>
                </section>

                <section className="summary__amount">
                    <p className="description">SHIPPING</p>
                    <p className="amount">$ 50</p>
                </section>

                <section className="summary__amount">
                    <p className="description">VAT (INCLUDED)</p>
                    <p className="amount">$ { vat.toLocaleString() }</p>
                </section>

                <section className="summary__amount grand-total">
                    <p className="description">GRAND TOTAL</p>
                    <p className="amount">$ { grandTotal.toLocaleString() }</p>
                </section>

                <button className="button button--light" onClick={formValidator}>CONTINUE & PAY</button>
            </section>

            {lightboxOpen && <CheckoutLightBox />}
        </section>
    )
}