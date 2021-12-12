import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import TournamentDetail from "./components/TournamentDetail";

function App() {
  return (
    <BrowserRouter>
      <header>kick off</header>
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
