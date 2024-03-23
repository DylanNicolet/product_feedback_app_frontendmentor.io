import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import mobileTitleBG from "../assets/suggestions/mobile/background-header.png"
import tabletTitleBG from "../assets/suggestions/tablet/background-header.png"
import desktopTitleBG from "../assets/suggestions/desktop/background-header.png"
import burgerIcon from "../assets/shared/mobile/icon-hamburger.svg"
import closeIcon from "../assets/shared/mobile/icon-close.svg"
import { updateActiveFilter } from "../redux/appSlice"

export default function SideBar() {
    const dispatch = useDispatch()

    // States
    let titleBG = undefined
    const screenWidth = useSelector(state => state.appState.screenWidth)
    const activeFilter = useSelector(state => state.appState.activeFilter)
    const [burger, setBurger] = React.useState(burgerIcon)
    const [menuOpen, setMenuOpen] = React.useState(false)
    let onMobile = undefined
    const filters = ['All', 'UI', 'UX', 'Enhancement', 'Bug', 'Feature']

    // Handle which image to use according to screen size
    if (screenWidth < 768) {
        titleBG = mobileTitleBG
        onMobile = true
    }
    else if (screenWidth >= 768 && screenWidth < 1024) {
        titleBG = tabletTitleBG
        onMobile = false
    }
    else if (screenWidth >= 1024) {
        titleBG = desktopTitleBG
        onMobile = false
    }

    // Menu toggle
    function handleMenuToggle() {
        if (burger === burgerIcon) {
            setBurger(closeIcon)
        } else {
            setBurger(burgerIcon)
        }

        setMenuOpen(prev => !prev)
    }

    // Filter change
    function handleFilterChange(e) {
        dispatch(updateActiveFilter({ activeFilter: e.target.innerText, }))
        handleMenuToggle()
    }

    return (
        <section id="SideBar" className={(menuOpen && onMobile) ? 'sent-to-top' : ''}> {/* check if desktop stills needs the send-to-top otherwise delete */}
            {/* title */}
            <section className="SideBar__title-container" style={{ backgroundImage: `url(${titleBG})` }}>
                <section className="SideBar__title-with-sub-title">
                    <h1 className="SideBar__title">Frontend Mentor</h1>
                    <p className="SideBar__sub-title">Feedback Board</p>
                </section>

                <button id="menu-burger" onClick={handleMenuToggle}>
                    <img src={burger} alt="" />
                </button>
            </section>

            {/* Shade */}
            <section className={`menu-shade ${(menuOpen && onMobile) ? 'menu-opened' : ''}`} onClick={handleMenuToggle}></section>

            <section className={`SideBar__content-container ${(menuOpen && onMobile) ? 'menu-opened' : ''}`}>

                {/* Filters */}
                <section className='container-primary SideBar__filter-container'>
                    {filters.map((filter, index) => (
                        <button
                            key={index}
                            className={filter.toLowerCase() === activeFilter.toLowerCase() ? 'Sidebar__filter Sidebar__filter--active' : 'Sidebar__filter'}
                            onClick={e => handleFilterChange(e)}
                        >
                            {filter}
                        </button>
                    ))}
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