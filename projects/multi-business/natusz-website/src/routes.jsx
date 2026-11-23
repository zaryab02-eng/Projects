import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Products from "./pages/Products.jsx";
import Gallery from "./pages/Gallery.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";
import Paused from "./pages/Paused.jsx";
import { ContentProvider } from "./lib/content.jsx";
import { buildTimeContent } from "./lib/catalog";

// To pause the website: set VITE_SITE_PAUSED=true on the host and redeploy.
const paused =
  String(import.meta.env.VITE_SITE_PAUSED || "").toLowerCase() === "true";

// To add a new page: create it in src/pages, import it here, add a route below,
// then add a link for it in src/components/Navbar.jsx.
export const routes = paused
  ? [
      { path: "/", element: <Paused /> },
      { path: "*", element: <Paused /> },
    ]
  : [
      {
        path: "/",
        element: (
          <ContentProvider>
            <Layout />
          </ContentProvider>
        ),
        children: [
          { index: true, element: <Home /> },
          { path: "about", element: <About /> },
          { path: "products", element: <Products /> },
          {
            path: "products/:slug",
            element: <Products />,
            getStaticPaths: () =>
              buildTimeContent().products.map((p) => `products/${p.slug}`),
          },
          { path: "gallery", element: <Gallery /> },
          { path: "contact", element: <Contact /> },
          { path: "*", element: <NotFound /> },
        ],
      },
    ];
