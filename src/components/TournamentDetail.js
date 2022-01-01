import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { mockTournaments } from "../mock/Tournaments";
import AddComponent from "./AddComponent";
import ButtonComponent from "./common/ButtonComponent";
import CardComponent from "./common/CardComponent";
import TableComponent from "./common/TableComponent";
import "./TournamentDetail.css";

const matchesLS =
  localStorage.getItem("matches") &&
  JSON.parse(localStorage.getItem("matches"));

const pointsTableLS =
  localStorage.getItem("pointsTableLS") &&
  JSON.parse(localStorage.getItem("pointsTableLS"));

const tournamentLS =
  localStorage.getItem("tournamentLS") &&
  JSON.parse(localStorage.getItem("tournamentLS"));

const sectionLS =
  localStorage.getItem("sectionLS") &&
  JSON.parse(localStorage.getItem("sectionLS"));

const SECTIONS = {
  PLAYERS: "Players",
  MATCHES: "Matches",
  TABLE: "Table",
};

function TournamentDetail() {
  let params = useParams();
  const [matches, setMatches] = useState(matchesLS || []);
  const [tournament, setTournament] = useState(
    tournamentLS ||
      mockTournaments.find(
        (tournament) => tournament.id === parseInt(params.id)
      )
  );
  const [pointsTable, setPointsTable] = useState(pointsTableLS || []);
  const [currentSectionInUI, setCurrentSectionInUI] = useState(
    sectionLS || SECTIONS.PLAYERS
  );

  useEffect(() => {
    localStorage.setItem("pointsTableLS", JSON.stringify(pointsTable));
    localStorage.setItem("matches", JSON.stringify(matches));
    localStorage.setItem("tournamentLS", JSON.stringify(tournament));
  }, [pointsTable, matches, tournament]);

  useEffect(() => {
    localStorage.setItem("sectionLS", JSON.stringify(currentSectionInUI));
  }, [currentSectionInUI]);

  const addPlayers = (player) => {
    const temp = { ...tournament };

    temp.players.push({
      id: 1001 + tournament.players.length,
      name: player,
    });

    setTournament({ ...temp });
    generateFixtures();
  };

  useEffect(() => {
    if (matches.length === 0) generateFixtures();
  }, []);

  const generateFixtures = () => {
    const players = tournament.players;
    const temp = [];
    const pointsTable = [];
    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        temp.push({
          matchId: ++matches.length,
          playerA: { ...players[i], goal: 0 },
          playerB: { ...players[j], goal: 0 },
          winner: 0,
          isDone: false,
        });
      }

      //parallely create points table for each player
      pointsTable.push({
        playerName: players[i].name,
        playerId: players[i].id,
        MP: 0,
        W: 0,
        D: 0,
        L: 0,
        GF: 0,
        GA: 0,
        GD: 0,
        Pts: 0,
      });
    }

    setPointsTable(pointsTable);

    //shuffle matches
    for (let i = temp.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [temp[i], temp[j]] = [temp[j], temp[i]];
    }

    setMatches(temp);
  };

  const updateMatch = (match, resetMatch = false) => {
    const temp = [...matches];
    const index = temp.findIndex((m) => m.matchId === match.matchId);
    temp[index] = match;
    setMatches([...temp]);

    if (match.isDone || resetMatch) {
      const pntsTable = [...pointsTable];
      const playerA = pntsTable.find((pl) => match.playerA.id === pl.playerId);
      const playerB = pntsTable.find((pl) => match.playerB.id === pl.playerId);

      updatePlayerStats(playerA);
      updatePlayerStats(playerB);

      setPointsTable(pntsTable);
    }
  };

  const updatePlayerStats = (player) => {
    const playerMatches = matches.filter(
      (m) =>
        (m.playerA.id === player.playerId ||
          m.playerB.id === player.playerId) &&
        m.isDone
    );

    player.MP = playerMatches.length;
    let playerWins = 0;
    let playerDraws = 0;
    let playerLoss = 0;
    let playerGF = 0;
    let playerGA = 0;
    let playerPts = 0;
    for (let i = 0; i < playerMatches.length; i++) {
      if (playerMatches[i].winner === 0) {
        playerDraws++;
        playerPts = playerPts + 1;
      } else if (playerMatches[i].winner === player.playerId) {
        playerWins++;
        playerPts = playerPts + 3;
      } else playerLoss++;

      playerGF +=
        playerMatches[i].playerA.id === player.playerId
          ? playerMatches[i].playerA.goal
          : playerMatches[i].playerB.goal;

      playerGA +=
        playerMatches[i].playerA.id !== player.playerId
          ? playerMatches[i].playerA.goal
          : playerMatches[i].playerB.goal;
    }

    player.W = playerWins;
    player.D = playerDraws;
    player.L = playerLoss;
    player.GF = playerGF;
    player.GA = playerGA;
    player.GD = playerGF - playerGA;
    player.Pts = playerPts;
  };

  const updateMatchGoal = (matchId, playerId) => {
    const match = matches.find((match) => match.matchId === matchId);
    match.isDone = false;
    match.playerA.id === playerId ? match.playerA.goal++ : match.playerB.goal++;
    updateMatch(match);
  };

  const handleMatchFinish = (matchId) => {
    const match = matches.find((match) => match.matchId === matchId);
    match.isDone = true;
    let winner = 0;

    if (match.playerA.goal > match.playerB.goal) winner = match.playerA.id;
    else if (match.playerA.goal < match.playerB.goal) winner = match.playerB.id;

    match.winner = winner;
    updateMatch(match);
  };

  const handleMatchReset = (matchId) => {
    const match = matches.find((match) => match.matchId === matchId);
    match.winner = 0;
    match.playerA.goal = 0;
    match.playerB.goal = 0;
    match.isDone = false;
    updateMatch(match, true);
  };

  const handleDeletePlayer = (playerId) => {
    const tmnt = { ...tournament };
    const player = tmnt.players.find((p) => p.id === playerId);
    const index = tmnt.players.indexOf(player);
    if (index > -1) {
      tmnt.players.splice(index, 1);
    }
    setTournament(tmnt);
    generateFixtures();
  };

  return (
    <div className="tournament-detail-container">
      <div className="tournament-detail-navbar">
        {Object.keys(SECTIONS).map((prop) => (
          <div
            key={prop}
            className="tournament-detail-section-name"
            onClick={() => setCurrentSectionInUI(SECTIONS[prop])}
          >
            {SECTIONS[prop]}
          </div>
        ))}
      </div>
      <div className="tournament-detail-sections">
        {currentSectionInUI === SECTIONS.PLAYERS && (
          <CardComponent fontWeight="500" width="50%">
            <h3 className="tournament-detail-title">{tournament.name}</h3>
            <AddComponent
              listHandler={addPlayers}
              buttonText="Add Players"
              width="400px"
              height="50px"
              inputPlaceholder="Player Name"
            />
            <div className="tournament-player-list">
              {tournament &&
                tournament.players.map((player, index) => (
                  <div className="tournament-player-detail" key={player.id}>
                    <span>
                      #{index + 1}&nbsp;&nbsp;
                      {player.name}
                    </span>
                    <span>
                      <i
                        onClick={() => handleDeletePlayer(player.id)}
                        className="fa fa-trash"
                      ></i>
                    </span>
                  </div>
                ))}
            </div>
          </CardComponent>
        )}
        {currentSectionInUI === SECTIONS.MATCHES && (
          <CardComponent fontWeight="500" width="50%">
            <div className="tournament-detail-match-list">
              {matches &&
                matches.map((match) => (
                  <div className="tournament-detail-match" key={match.matchId}>
                    <ButtonComponent
                      cursor="default"
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
                      {match.playerA.goal}
                    </ButtonComponent>
                    -
                    <ButtonComponent
                      onClick={() =>
                        updateMatchGoal(match.matchId, match.playerB.id)
                      }
                    >
                      {match.playerB.goal}
                    </ButtonComponent>
                    <ButtonComponent
                      cursor="default"
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
                      onClick={() => handleMatchFinish(match.matchId)}
                      backgroundColor={match.isDone && "lightgreen"}
                    >
                      <i className="fa fa-check"></i>
                    </ButtonComponent>
                    <ButtonComponent
                      onClick={() => handleMatchReset(match.matchId)}
                    >
                      <i className="fa fa-refresh"></i>
                    </ButtonComponent>
                  </div>
                ))}
            </div>
          </CardComponent>
        )}
        {currentSectionInUI === SECTIONS.TABLE && (
          <CardComponent fontWeight="500" width="50%">
            {pointsTable.length > 0 && (
              <TableComponent
                columns={["Club", "MP", "W", "D", "L", "GF", "GA", "GD", "Pts"]}
                rows={pointsTable.map((t) => [
                  t.playerName,
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
            )}
          </CardComponent>
        )}
      </div>
    </div>
  );
}

export default TournamentDetail;
