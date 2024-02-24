import React from "react"
import { useParams } from "react-router-dom"
import data from "../../data.json"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import CategoryNav from "../components/CategoryNav"

export default function Category(){

    //Get screenwidth from REDUX
    const screenWidth = useSelector(state => state.appState.screenWidth)
    
    //Detect which category we are on, using the URL parameter (category)
    let { category } = useParams()

    //Filter all received data, for this category only
    let filteredData = data.filter( ( product ) => { if ( product.category == category ) { return product } } )
    
    //Sort the data with NEW products placed first
    filteredData.sort((a, b) => Number(b.new) - Number(a.new))

    //Map over data to generate product blocks
    let products = filteredData.map((product, index) => {

        let source = product.categoryImage.mobile
        if(screenWidth >= 768 && screenWidth < 920){
            source = product.categoryImage.tablet
        }
        else if(screenWidth >= 920){
            source = product.categoryImage.desktop
        }

        return(
            <section className="product" key={index}>
                <img src={source} alt="img" className="product__image" />
                
                <section className="product__info">
                    {product.new &&  <p className="product__new">NEW PRODUCT</p>}
                    <h2 className="product__title">{product.name}</h2>
                    <p className="product__description">{product.description}</p>
                    <Link to={product.slug}>
                        <button className="button--light">SEE PRODUCT</button>
                    </Link>
                </section>
            </section>
        )
    })

    return(
        <section className="category">
            <section className="category__top">
                <h1 className="title">{category}</h1>
            </section>

            <section className="products-block">
                {products}
            </section>

            <CategoryNav />
        </section>
    )
}