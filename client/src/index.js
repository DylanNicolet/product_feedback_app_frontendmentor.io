import React from "react"
import { createRoot } from 'react-dom/client'
import App from "./App"
import store from "./redux/store"
import { Provider } from "react-redux"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Homepage from "./pages/Homepage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      // {
      //   path: "/:category",
      //   element: <Category />
      // },
      // {
      //   path: "/:category/:productSlug",
      //   element: <ProductPage />
      // },
      // {
      //   path: "/checkout",
      //   element: <Checkout />
      // }
    ],
  }
])

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);