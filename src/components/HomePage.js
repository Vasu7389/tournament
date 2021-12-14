import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import { mockTournaments } from "../mock/Tournaments";
import AddComponent from "./AddComponent";
import CardComponent from "./common/CardComponent";

function HomePage() {
  const [tournamentList, setTournamentList] = useState([...mockTournaments]);

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
      <div className="homepage-list">
        {tournamentList.map((tournament, index) => (
          <Link to={`/tournament/${tournament.id}`} key={tournament.id}>
            <CardComponent backgroundColor={"rgb(41, 75, 138)"} color="white">
              {tournament.name}
            </CardComponent>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
