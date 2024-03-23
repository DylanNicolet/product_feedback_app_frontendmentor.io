import React from "react"
import { createRoot } from 'react-dom/client'
import App from "./App"
import store from "./redux/store"
import { Provider } from "react-redux"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Homepage from "./pages/Homepage"
import FeedbackPage from "./pages/FeedbackPage"

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
      //   path: "/new-feedback",
      //   element: <Category />
      // },
      {
        path: "/feedback/:id",
        element: <FeedbackPage />
      },
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