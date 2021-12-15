import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./components/HomePage";
import TournamentDetail from "./components/TournamentDetail";

function App() {
  return (
    <BrowserRouter>
      <Link to="/">
        <header>kick off</header>
      </Link>
      <main>
        <Routes>
          <Route path="/tournament/:id" element={<TournamentDetail />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
