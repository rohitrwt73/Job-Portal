import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import JobList from './components/JobList';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { AuthProvider } from './context/authContext';
import PostJob from './components/PostJob';
import SearchResults from './components/SearchResults'; // Import SearchResults

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <JobList /> {/* JobList will fetch all jobs by default */}
            </>
          }
        />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/search" element={<SearchResults />} /> {/* Add the SearchResults route */}
        {/* Add other routes as needed */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
