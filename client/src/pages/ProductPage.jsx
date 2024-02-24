import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, Link } from "react-router-dom"
import data from "../../data.json"
import parse from 'html-react-parser'
import CategoryNav from "../components/CategoryNav"
import { useLocation } from "react-router-dom"
import { updateCartOpen } from "../redux/appSlice"
import $ from 'jquery'

export default function ProductPage() {

    //REDUX states
    const dispatch = useDispatch()
    const cartOpen = useSelector( state => state.appState.cartOpen )

    //Grab URL
    let { productSlug } = useParams()

    //Filter all received data, for this product only
    const { pathname } = useLocation();  
    
    //States
    let [ counterNumber, setCounterNumber ] = React.useState( 1 )
    let [ product, setProduct ] = React.useState( data.filter( ( product ) => { if ( product.slug == productSlug ) { return product } } )[ 0 ] )
    let [ price, setPrice ] = React.useState( product.price )

    //Reset all states when URL changes (Avoids bug when we select another product from within the product page)
    React.useEffect( () => {
        //Detect which product we are on, using the URL parameter (productSlug)
        let newData = data.filter( ( product ) => { if ( product.slug == productSlug ) { return product } } )[ 0 ]
        setProduct( newData )
        setPrice( newData.price )
        setCounterNumber( 1 )
    }, [pathname])

    //Get screenwidth from REDUX
    const screenWidth = useSelector(state => state.appState.screenWidth)
    
    //Load proper image size
    let productImage = product.image.mobile
    if(screenWidth >= 768 && screenWidth < 920){
        productImage = product.image.tablet
    }
    else if(screenWidth >= 920){
        productImage = product.image.desktop
    }

    //Counter logic
    function increaseCounter() {
        setCounterNumber( ( prev ) => ( prev + 1 ) )
        setPrice(( prev ) => ( prev + product.price ))
    }

    function decrementCounter() {
        setCounterNumber( ( prev ) => ( prev - 1 ) )
        setPrice(( prev ) => ( prev - product.price ))
    }
    
    //Cart logic with localStorage
    function addToCart() {
        let cartData = JSON.parse( localStorage.getItem( "cartData" ) || "[]" )

        let newCartData = {
            id: product.id,
            amount: counterNumber,
            price: product.price,
            name: product.name,
            slug: product.slug,
            cartImage: product.cartImage
        }

        //Check if this product already exists in localStorage
        const index = cartData.findIndex( ( el ) => el.id === product.id )
        
        //-1 means product is not already in localStorage
        if ( index === -1 ) { 
            cartData.push( newCartData )
        }
        //Replace existing data with new data
        else {
            cartData[ index ] = newCartData
        }
        
        localStorage.setItem( "cartData", JSON.stringify( cartData ) )
        
        dispatch( updateCartOpen( { cartOpen: !cartOpen, } ) )
        $( ".shade" ).fadeToggle( 300 );
    }

    //Map over product.includes to generate inTheBox block
    let inTheBox = product.includes.map((item, index) => {
        return(
            <li key={index}>
                <p className="amount">{item.quantity + "x"}</p>
                <p className="item">{ item.item }</p>
            </li>
        )
    })

    //Get images according to device
    let firstImage = product.gallery.first.mobile
    let secondImage = product.gallery.second.mobile
    let thirdImage = product.gallery.third.mobile

    if(screenWidth >= 768 && screenWidth < 920){
        firstImage = product.gallery.first.tablet
        secondImage = product.gallery.second.tablet
        thirdImage = product.gallery.third.tablet
    }
    else if(screenWidth >= 920){
        firstImage = product.gallery.first.desktop
        secondImage = product.gallery.second.desktop
        thirdImage = product.gallery.third.desktop
    }
    
    //Map over product.others to generate related-product block
    let relatedProducts = product.others.map( ( relatedProduct, index ) => {

        //Find the category of the related product from data
        let productCategory = data.find( ( { slug } ) => slug === relatedProduct.slug ).category

        //Define image source according to screen size
        let source = relatedProduct.image.mobile
        if(screenWidth >= 768 && screenWidth < 920){
            source = relatedProduct.image.tablet
        }
        else if(screenWidth >= 920){
            source = relatedProduct.image.desktop
        }

        return(
            <section className="product" key={index}>
                <img src={source} alt={relatedProduct.name} className="product__image" />
                <h4 className="product__title">{relatedProduct.name}</h4>
                <Link to={"/" + productCategory + "/" + relatedProduct.slug} relative="path">
                    <button className="button--light">SEE PRODUCT</button>
                </Link>
            </section>
        )
    })
    
    return (
        <section className="product-page">
            <Link to={'..'} relative="path" className="go-back">Go Back</Link>

            <section className="general-info">
                <img src={productImage} alt="img" className="product__image" />
                
                <section className="product__info">
                    {product.new &&  <p className="product__new">NEW PRODUCT</p>}
                    <h2 className="product__title">{product.name}</h2>
                    <p className="product__description">{product.description}</p>
                    <p className="product__price">$ {price.toLocaleString()}</p>
                    
                    <section className="counter-container">
                        <section className="counter">
                            <button className="counter__button" onClick={decrementCounter}>-</button>
                            <p className="counter__number">{counterNumber}</p>
                            <button className="counter__button" onClick={increaseCounter}>+</button>
                        </section>
                        
                        <button className="button--light" onClick={addToCart}>ADD TO CART</button>
                    </section>
                </section>
            </section>

            <section className="additional-info">
                <section className="features">
                    <h3 className="features__title">FEATURES</h3>
                    <p className="features__description">{ parse(product.features) }</p>
                </section>

                <section className="in-the-box">
                    <h3 className="title">IN THE BOX</h3>
                    <ul>
                        {inTheBox}
                    </ul>
                </section>
            </section>

            <section className="gallery">
                <img src={firstImage} alt="Product image 1" className="image1" />
                <img src={secondImage} alt="Product image 2"  className="image2" />
                <img src={thirdImage} alt="Product image 3" className="image3" />
            </section>

            <section className="related-products">
                <h3 className="related-products__title">YOU MAY ALSO LIKE</h3>
                { relatedProducts }
            </section>

            <CategoryNav />
        </section>
    )
}