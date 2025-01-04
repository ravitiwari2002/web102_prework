/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
    
    for(let i=0; i<games.length; i++){       
        let div1= document.createElement("div");         
        div1.classList.add("game-card");
         
        div1.innerHTML = `
            <img src="${games[i].img}" width=50%/>
            <p>The name of the game is ${games[i].name} and it has ${games[i].backers} backers</p>
            <p>${games[i].description}</p>
        `;
        
        gamesContainer.appendChild(div1);
    }     
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games

addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

const totalContributions = GAMES_JSON.reduce( (acc, game) => {
    return acc + game.backers;
  }, 0);
// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `<p>${totalContributions.toLocaleString('en-US')} total contributers</p>`;
  
// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const totalraised = GAMES_JSON.reduce( (acc, game) => {
    return acc + game.pledged;
  }, 0);
// set inner HTML using template literal
raisedCard.innerHTML = `<p>$${totalraised.toLocaleString('en-US')} total pledged</p>`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
const totalgames = GAMES_JSON.reduce( (acc, game) => {
    return acc + 1;
}, 0);
gamesCard.innerHTML = `<p>${totalgames} total games </p>`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let unfundedList = GAMES_JSON.filter ( (game) => {
        return game.pledged < game.goal;
      });
      

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedList);

}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let fundedList = GAMES_JSON.filter ( (game) => {
        return game.pledged >= game.goal;
      });

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedList);

}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);

}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);


/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
let unfundedList = GAMES_JSON.filter ( (game) => {
    return game.pledged < game.goal;
  });

const unfundedgames = unfundedList.reduce( (acc, game) => {
    return acc + 1;
}, 0);

// create a string that explains the number of unfunded games using the ternary operator

let unfundedStr = `A total of $${totalraised.toLocaleString('en-US')} has been raised for ${totalgames} total games.
  Currently ${unfundedgames} ${unfundedgames==1 ? "remains" : "remain"} unfunded. We need your help to fund these amazing games!`;

// create a new DOM element containing the template string and append it to the description container
let divStr= document.createElement("p");
divStr.innerHTML = `<p>${unfundedStr}</p>`;
descriptionContainer.appendChild(divStr);
/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});


// use destructuring and the spread operator to grab the first and second games
let [firstPlayed, secondPlayed, ...others] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
let divFirst= document.createElement("p");
divFirst.innerHTML = `<p>${firstPlayed.name}</p>`;
firstGameContainer.appendChild(divFirst);
// do the same for the runner up item
let divSecond= document.createElement("p");
divSecond.innerHTML = `<p>${secondPlayed.name}</p>`;
secondGameContainer.appendChild(divSecond);

// create search function
function searchFunction() {
    // grab the text from the input
    const searchInput = document.querySelector('input[type="text"]').value.trim();

    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that include the search input-- make it not case sensitive by putting both to lower case
    const searchList = GAMES_JSON.filter(game => {
        return game.name.toLowerCase().includes(searchInput.toLowerCase());
    });

    // use the function we previously created to add filtered games to the DOM
    addGamesToPage(searchList);
}

// select the submit button
const submitBtn = document.getElementById("search-btn");

// add event listener
submitBtn.addEventListener("click", searchFunction);