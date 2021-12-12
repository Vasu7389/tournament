import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { tournaments } from "../mock/Tournaments";
import AddComponent from "./AddComponent";
import ButtonComponent from "./common/ButtonComponent";
import TableComponent from "./common/TableComponent";
import "./TournamentDetail.css";

const tment =
  localStorage.getItem("tournament") &&
  JSON.parse(localStorage.getItem("tournament"));

const matchesLS =
  localStorage.getItem("matches") &&
  JSON.parse(localStorage.getItem("matches"));

function TournamentDetail() {
  let params = useParams();
  const [matches, setMatches] = useState(matchesLS || []);

  const [tournament, setTournament] = useState(
    tment ||
      tournaments.find((tournament) => tournament.id === parseInt(params.id))
  );

  //each time tournament gets updated, add that to localstorage
  useEffect(() => {
    localStorage.setItem("tournament", JSON.stringify(tournament));
    localStorage.setItem("matches", JSON.stringify(matches));
  }, [tournament, matches]);

  const addPlayers = (player) => {
    const temp = { ...tournament };

    temp.players.push({
      id: 1001 + tournament.players.length,
      name: player,
      MP: 0,
      W: 0,
      D: 0,
      L: 0,
      GF: 0,
      GA: 0,
      GD: 0,
      Pts: 0,
    });

    setTournament({ ...temp });
  };

  const generateFixtures = () => {
    const players = tournament.players;
    const temp = [];
    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        temp.push({
          matchId: ++matches.length,
          playerA: players[i],
          playerB: players[j],
          winner: 0,
          goalOfA: 0,
          goalOfB: 0,
          isDone: false,
        });
      }
    }

    setMatches([...temp]);
    setTournament(
      tournaments.find((tournament) => tournament.id === parseInt(params.id))
    );
  };

  const updateMatch = (match) => {
    const temp = [...matches];
    const index = temp.findIndex((m) => m.matchId === match.matchId);
    temp[index] = match;
    setMatches([...temp]);

    const tment = { ...tournament };
    const playerA = tment.players.find((pl) => match.playerA.id === pl.id);
    const playerB = tment.players.find((pl) => match.playerB.id === pl.id);

    if (match.isDone) {
      playerA.MP++;
      playerB.MP++;
      if (match.winner === playerA.id) {
        playerA.W++;
        playerB.L++;
        playerA.Pts = playerA.Pts + 3;
      } else if (match.winner === playerB.id) {
        playerB.W++;
        playerA.L++;
        playerB.Pts = playerB.Pts + 3;
      } else {
        playerA.D++;
        playerB.D++;
        playerB.Pts = playerB.Pts + 1;
        playerA.Pts = playerA.Pts + 1;
      }
      playerA.GF = playerA.GF + match.goalOfA;
      playerA.GA = playerA.GA + match.goalOfB;
      playerB.GF = playerB.GF + match.goalOfB;
      playerB.GA = playerB.GA + match.goalOfA;
      playerA.GD = playerA.GF - playerA.GA;
      playerB.GD = playerB.GF - playerB.GA;

      setTournament(tment);
    }
  };

  const updateWinner = (playerId, matchId) => {
    const match = matches.find((match) => match.matchId === matchId);
    match.isDone = true;
    match.winner = playerId;
    updateMatch(match);
  };

  const updateMatchGoal = (matchId, playerId) => {
    const match = matches.find((match) => match.matchId === matchId);
    match.isDone = false;
    match.playerA.id === playerId ? match.goalOfA++ : match.goalOfB++;
    updateMatch(match);
  };

  const handleMatchDraw = (matchId) => {
    const match = matches.find((match) => match.matchId === matchId);
    match.isDone = true;
    match.winner = 0;
    updateMatch(match);
  };

  return (
    <div className="tournament-detail-container">
      <div className="tournament-details">
        <h3 className="tournament-detail-title">{tournament.name}</h3>
        <AddComponent
          listHandler={addPlayers}
          buttonText="Add Players"
          width="400px"
          height="50px"
          inputPlaceholder="Player Name"
        />
        <div style={{ margin: "20px 0px" }}>
          {tournament &&
            tournament.players.map((player, index) => (
              <span key={player.id}>
                {player.name}
                {index !== tournament.players.length - 1 && <span>,</span>}{" "}
              </span>
            ))}
        </div>
        <div className="tournament-detail-operations">
          <ButtonComponent
            height="40px"
            width="150px"
            onClick={generateFixtures}
            type="submit"
          >
            Generate Fixtures
          </ButtonComponent>
          <ButtonComponent height="40px" width="150px" type="submit">
            Reset Tournament
          </ButtonComponent>
        </div>
        <div className="tournament-detail-match-list">
          {matches &&
            matches.map((match) => (
              <div className="tournament-detail-match" key={match.matchId}>
                <ButtonComponent
                  onClick={() => updateWinner(match.playerA.id, match.matchId)}
                  type="submit"
                  height="30px"
                  width="100px"
                  backgroundColor={
                    match.winner !== 0 && match.winner === match.playerA.id
                      ? "lightgreen"
                      : match.winner !== 0
                      ? "#ebb4b4"
                      : null
                  }
                >
                  {match.playerA.name}
                </ButtonComponent>
                <ButtonComponent
                  onClick={() =>
                    updateMatchGoal(match.matchId, match.playerA.id)
                  }
                >
                  {match.goalOfA}
                </ButtonComponent>{" "}
                -
                <ButtonComponent
                  onClick={() =>
                    updateMatchGoal(match.matchId, match.playerB.id)
                  }
                >
                  {match.goalOfB}
                </ButtonComponent>
                <ButtonComponent
                  onClick={() => updateWinner(match.playerB.id, match.matchId)}
                  type="submit"
                  height="30px"
                  width="100px"
                  backgroundColor={
                    match.winner === match.playerB.id
                      ? "lightgreen"
                      : match.winner !== 0
                      ? "#ebb4b4"
                      : null
                  }
                >
                  {match.playerB.name}
                </ButtonComponent>
                <ButtonComponent
                  onClick={() => handleMatchDraw(match.matchId)}
                  backgroundColor={
                    match.isDone && match.winner === 0 && "lightgreen"
                  }
                >
                  Draw
                </ButtonComponent>
              </div>
            ))}
        </div>
      </div>
      <div className="tournament-detail-table">
        <TableComponent
          columns={["Club", "MP", "W", "D", "L", "GF", "GA", "GD", "Pts"]}
          rows={tournament.players.map((t) => [
            t.name,
            t.MP,
            t.W,
            t.D,
            t.L,
            t.GF,
            t.GA,
            t.GD,
            t.Pts,
          ])}
        />
      </div>
    </div>
  );
}

export default TournamentDetail;
