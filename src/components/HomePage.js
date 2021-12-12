import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import { tournaments } from "../mock/Tournaments";
import AddComponent from "./AddComponent";

function HomePage() {
  const [tournamentList, setTournamentList] = useState([...tournaments]);

  const addTournament = (tournamentName) => {
    const tournamentObj = {
      id: 101 + tournamentList.length,
      name: tournamentName,
      players: [],
    };
    const temp = [...tournamentList];
    temp.push(tournamentObj);
    setTournamentList(temp);
  };

  return (
    <div className="homepage">
      <h3 className="homepage-title">Tournaments</h3>
      <AddComponent
        width="600px"
        height="50px"
        listHandler={addTournament}
        inputPlaceholder="Tournament Title"
        buttonText="Add Tournament"
      />
      <ul className="homepage-list">
        {tournamentList.map((tournament) => (
          <li key={tournament.id}>
            <Link to={`/tournament/${tournament.id}`}>{tournament.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
