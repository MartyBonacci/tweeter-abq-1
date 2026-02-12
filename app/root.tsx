import {
  Form,
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "react-router";
import { useState } from "react";

import type { Route } from "./+types/root";
import { getOptionalUser } from "~/utils/auth.server";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getOptionalUser(request);
  return { user };
}

function Navbar() {
  const data = useRouteLoaderData("root") as { user: any } | undefined;
  const user = data?.user;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="text-xl font-bold text-twitter">
            Tweeter
          </Link>

          {user ? (
            <>
              {/* Desktop nav */}
              <div className="hidden sm:flex items-center gap-4">
                <Link
                  to="/"
                  className="text-sm text-gray-600 hover:text-twitter transition-colors"
                >
                  Home
                </Link>
                <Link
                  to={`/profile/${user.username}`}
                  className="text-sm text-gray-600 hover:text-twitter transition-colors"
                >
                  Profile
                </Link>
                <Form method="post" action="/signout">
                  <button
                    type="submit"
                    className="text-sm text-gray-600 hover:text-red-500 transition-colors"
                  >
                    Sign out
                  </button>
                </Form>
              </div>

              {/* Mobile hamburger */}
              <button
                type="button"
                className="sm:hidden text-gray-600"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  )}
                </svg>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/signin"
                className="text-sm text-gray-600 hover:text-twitter transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="bg-twitter hover:bg-twitter-dark text-white text-sm font-medium py-1.5 px-4 rounded-full transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {user && mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-100 py-2 space-y-1">
            <Link
              to="/"
              className="block py-2 text-sm text-gray-600 hover:text-twitter"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to={`/profile/${user.username}`}
              className="block py-2 text-sm text-gray-600 hover:text-twitter"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <Form method="post" action="/signout">
              <button
                type="submit"
                className="block py-2 text-sm text-gray-600 hover:text-red-500 w-full text-left"
              >
                Sign out
              </button>
            </Form>
          </div>
        )}
      </div>
    </nav>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-50 min-h-screen">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">{message}</h1>
      <p className="text-gray-600 mt-2">{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto mt-4 bg-gray-100 rounded-lg text-sm">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
