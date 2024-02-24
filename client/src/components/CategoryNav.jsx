import React from "react"
import { Link } from "react-router-dom"
import menuHeadphones from "../assets/shared/desktop/image-category-thumbnail-headphones.png"
import menuSpeakers from "../assets/shared/desktop/image-category-thumbnail-speakers.png"
import menuEarphones from "../assets/shared/desktop/image-category-thumbnail-earphones.png"
import arrowRight from "../assets/shared/desktop/icon-arrow-right.svg"
import $ from 'jquery'

export default function CategoryNav(props){

    function CloseNav(){
        $(".mobile-nav").slideUp(700);

        setTimeout(() => {
            $(".shade").fadeOut(700);
        }, 200)
    }

    return(
        <nav className={"category-nav " + (props.header && "header-nav")}>
            <ul>
                <li>
                    <Link to={`../../headphones`} className="nav_item">
                        <section className="link-section" onClick={CloseNav}>
                            <img src={menuHeadphones} alt="Go to headphones page"  className="category-img"/>
                            <h1>HEADPHONES</h1>
                            <section className="shop-section">
                                <p>SHOP</p>
                                <img src={arrowRight} alt="Go to headphones page" />
                            </section>
                        </section>
                    </Link>
                </li>

                <li>
                    <Link to={`../../speakers`} className="nav_item">
                        <section className="link-section"  onClick={CloseNav}>
                            <img src={menuSpeakers} alt="Go to speakers page"  className="category-img"/>
                            <h1>SPEAKERS</h1>
                            <section className="shop-section">
                                <p>SHOP</p>
                                <img src={arrowRight} alt="Go to speakers page" />
                            </section>
                        </section>
                    </Link>
                </li>

                <li>
                    <Link to={`../../earphones`} className="nav_item">
                        <section className="link-section"  onClick={CloseNav}>
                            <img src={menuEarphones} alt="Go to earphones page" className="category-img"/>
                            <h1>EARPHONES</h1>
                            <section className="shop-section">
                                <p>SHOP</p>
                                <img src={arrowRight} alt="Go to earphones page" />
                            </section>
                        </section>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}