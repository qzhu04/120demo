let words = [];
let answer = "";

// Fetch words from proj2.json
fetch('proj2.json')
    .then(response => response.json())
    .then(data => {
        words = data.words;
        // Select a random word as the answer for this game
        answer = words[Math.floor(Math.random() * words.length)];
        console.log("Answer:", answer); // For debugging
    })
    .catch(error => console.error("Error loading words:", error));

let currentRow = 0;
let currentGuess = "";
const maxAttempts = 6;

const gameBoard = document.getElementById("game-board");
for (let i = 0; i < maxAttempts * 5; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    gameBoard.appendChild(cell);
}

document.getElementById("submit-guess").addEventListener("click", () => {
    const guessInput = document.getElementById("guess-input");
    const guess = guessInput.value.toLowerCase();
    if (guess.length !== 5 || !words.includes(guess)) {
        alert("Please enter a valid 5-letter word.");
        return;
    }
    guessInput.value = "";
    checkGuess(guess);
});

function verifyWordWithAPI(word) {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => response.json())
        .then(data => {
            if (data.title === "No Definitions Found") {
                alert("Invalid word! Please try another word.");
            } else {
                checkGuess(word); // Call checkGuess if the word is valid
            }
        })
        .catch(error => console.error("Error verifying word:", error));
}

document.getElementById("submit-guess").addEventListener("click", () => {
    const guessInput = document.getElementById("guess-input");
    const guess = guessInput.value.toLowerCase();
    if (guess.length !== 5) {
        alert("Please enter a valid 5-letter word.");
        return;
    }
    guessInput.value = "";
    verifyWordWithAPI(guess); // Use the API check here
});

    if (guess === answer) {
        alert("Congratulations! You've guessed the word!");
        document.getElementById("restart-game").style.display = "block";
    } else if (currentRow === maxAttempts - 1) {
        alert(`Game over! The word was ${answer}`);
        document.getElementById("restart-game").style.display = "block";
    }

    currentRow++;
}

document.getElementById("restart-game").addEventListener("click", () => {
    currentRow = 0;
    answer = words[Math.floor(Math.random() * words.length)];
    console.log("Answer:", answer); // For debugging

    Array.from(gameBoard.children).forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("correct", "wrong-place", "not-in-word");
    });

    document.getElementById("used-letters").innerHTML = ""; // Clear used letters board
    usedLetters.clear(); // Clear the set of used letters
    document.getElementById("restart-game").style.display = "none";
});

const updateUsedLetters = (letter, status) => {
    if (!usedLetters.has(letter)) {
        const usedLetterDiv = document.createElement("div");
        usedLetterDiv.textContent = letter;
        usedLetterDiv.classList.add(status);
        document.getElementById("used-letters").appendChild(usedLetterDiv);
        usedLetters.add(letter);
    }
};
