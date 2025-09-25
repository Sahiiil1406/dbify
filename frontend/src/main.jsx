import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import LoginPage from './pages/Login.jsx';
import SignupPage from './pages/Signup.jsx';
import ProjectsDashboard from './pages/Dashboard.jsx';
import Project from './pages/Project.jsx';
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient("https://academic-albatross-125.convex.cloud")
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path:'/login',
    element: <LoginPage />,
  },
  {
    path:'/signup',
    element: <SignupPage />,
  },{
    path:'/dashboard',
    element: <ProjectsDashboard />,
  },{
    path:'/project/:projectId',
    element: <Project />,
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <RouterProvider router={router} />
    </ConvexProvider>
  </StrictMode>,
)
