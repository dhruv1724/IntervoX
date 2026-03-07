import { useUser } from '@clerk/clerk-react';
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router";
import AboutPage from './pages/AboutPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ProblemDetailPage from './pages/ProblemDetailPage.jsx';
import ProblemsPage from './pages/ProblemsPage.jsx';
import SessionPage from './pages/SessionPage.jsx';
function App() {
  const {isSignedIn,isLoaded}= useUser()

  if(!isLoaded) return null;
  return (
    <>
    <Routes>   
      <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"}/>} />
      <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"}/>} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/problems" element={isSignedIn ? <ProblemsPage />: <Navigate to={"/"}/>} />
      <Route path="/problems/:id" element={isSignedIn ? <ProblemDetailPage />: <Navigate to={"/"}/>} />
      <Route path="/session/:id" element={isSignedIn ? <SessionPage />: <Navigate to={"/"}/>} />
    </Routes>
    <Toaster  toastOptions={{duration: 3000}}/>
    </>
  )
}

export default App

