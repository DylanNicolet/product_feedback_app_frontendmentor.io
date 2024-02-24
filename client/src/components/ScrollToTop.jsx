import React from "react"
import { useLocation } from "react-router-dom"
import $ from 'jquery'

export default function ScrollToTop() {
  const { pathname } = useLocation()
  React.useEffect( () => {
    $("html, body").animate({
      scrollTop: 0
    }, 1000)
  }, [pathname])

  return null
}