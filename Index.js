require("dotenv").config();
require("colors");
const readlineSync = require("readline-sync");
const moment = require("moment");

const {
  getToken,
  getUsername,
  getBalance,
  getGameId,
  claimGamePoints,
} = require("./third_party/api.js");
const { displayScreen } = require("./utility/display.js");
const { delay } = require("./utility/delay.js");
(async () => {
  displayScreen();

  // const token = await getToken();
  const token =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJoYXNfZ3Vlc3QiOmZhbHNlLCJ0eXBlIjoiQUNDRVNTIiwiaXNzIjoiYmx1bSIsInN1YiI6IjU0MGFiMzgwLTNkZGYtNGJkMS1iYWUxLTllOWQ5NGFkMDFmOCIsImV4cCI6MTcyNTU0ODY3MCwiaWF0IjoxNzI1NTQ1MDcwfQ.5Qs0VQ1MRxhkNuOAD8l65LKuOjUMZEGSK3QFMCeUt88";
  console.log("Please Wait ...");
  try {
    const username = await getUsername(token);
    const balance = await getBalance(token);
    console.log(`Hi , ${username}!`.green);
    console.log(`Your Blum Point is: ${balance.availableBalance}`.green);
    console.log(`Ticket Balance: ${balance.playPasses}`);
    console.log("");
    console.log(`Play Game And Claim Reward...`.yellow);
    if (balance.playPasses > 0) {
      let countTicket = balance.playPasses;
      while (countTicket > 0) {
        console.log("⌛ Loading ...".blue);
        await delay(5000);
        const Game = await getGameId(token);
        console.log("⌛ Try to play game ...".blue);
        await delay(30000);
        const randPoints = Math.floor(Math.random() * (240 - 160 + 1)) + 160;
        const letsPlay = await claimGamePoints(token, Game.gameId, randPoints);
        if (letsPlay === "OK") {
          const balance = await getBalance(token);
          console.log(
            `🎮 Game success! Your balance now: ${balance.availableBalance} BLUM`
              .green
          );
        }
        countTicket--;
        console.log(`Ticket Balance : ${countTicket}`.yellow);
      }
    }
  } catch (error) {
    console.log(error);
  }
})();
