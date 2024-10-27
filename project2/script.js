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

function checkGuess(guess) {
    const guessArray = guess.split("");
    const answerArray = answer.split("");
    const rowStart = currentRow * 5;

    guessArray.forEach((letter, index) => {
        const cell = gameBoard.children[rowStart + index];
        cell.textContent = letter;

        if (letter === answerArray[index]) {
            cell.classList.add("correct");
            updateUsedLetters(letter, "correct");
        } else if (answerArray.includes(letter)) {
            cell.classList.add("wrong-place");
            updateUsedLetters(letter, "wrong-place");
        } else {
            cell.classList.add("not-in-word");
            updateUsedLetters(letter, "not-in-word");
        }
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

const usedLetters = new Set();
function updateUsedLetters(letter, status) {
    if (!usedLetters.has(letter)) {
        const usedLetterDiv = document.createElement("div");
        usedLetterDiv.textContent = letter;
        usedLetterDiv.classList.add(status);
        document.getElementById("used-letters").appendChild(usedLetterDiv);
        usedLetters.add(letter);
    }
}
