import React, { useState } from "react"
import { Link } from "react-router-dom"
import mobileTitleBG from "../assets/suggestions/mobile/background-header.png"
import burgerIcon from "../assets/shared/mobile/icon-hamburger.svg"
import closeIcon from "../assets/shared/mobile/icon-close.svg"

export default function SideBar() {

    const [burger, setBurger] = React.useState(burgerIcon)
    const [menuOpen, setMenuOpen] = React.useState(false)

    function handleMenuToggle() {
        if (burger === burgerIcon) {
            setBurger(closeIcon)
        } else {
            setBurger(burgerIcon)
        }

        setMenuOpen(prev => !prev)
    }

    return(
        <section id="SideBar" className={menuOpen ? 'sent-to-top' : ''}>
            {/* title */}
            <section className="SideBar__title-container" style={{backgroundImage: `url(${mobileTitleBG})`}}>
                <section>
                    <h1 className="SideBar__title">Frontend Mentor</h1>
                    <p className="SideBar__sub-title">Feedback Board</p>
                </section>

                <button id="menu-burger" onClick={handleMenuToggle}> 
                    <img src={burger} alt="" />
                </button>
            </section>

            {/* Shade */}
            <section className={`menu-shade ${menuOpen ? 'menu-opened' : ''}`} onClick={handleMenuToggle}></section>

            <section className={`SideBar__content-container ${menuOpen ? 'menu-opened' : ''}`}>
                {/* Filters */}
                <section className='container-primary SideBar__filter-container'>
                    <button className="Sidebar__filter">All</button>
                    <button className="Sidebar__filter">UI</button>
                    <button className="Sidebar__filter">UX</button>
                    <button className="Sidebar__filter">Enhancement</button>
                    <button className="Sidebar__filter">Bug</button>
                    <button className="Sidebar__filter">Feature</button>
                </section>

                {/* Roadmap */}
                <section className='container-primary SideBar__roadmap-container'>
                    <section className="Sidebar__roadmap-top">
                        <p>Roadmap</p>
                        <Link to={`/roadmap`}>View</Link>
                    </section>

                    <section className="SideBar__roadmap-row">
                        <span className="color_tag planned"></span>
                        <p className="text">Planned</p>
                        <p className="count">2</p>
                    </section>
                    <section className="SideBar__roadmap-row">
                        <span className="color_tag in-progress"></span>
                        <p className="text">In-Progress</p>
                        <p className="count">3</p>
                    </section>
                    <section className="SideBar__roadmap-row">
                        <span className="color_tag live"></span>
                        <p className="text">Live</p>
                        <p className="count">1</p>
                    </section>
                </section>
            </section>
        </section>
    )
}