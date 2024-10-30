let words = [];
let answer = "";
let currentRow = 0;
const maxAttempts = 6;
const usedLetters = new Set();
let gameOver = false;  // New flag to track game status

// Fetch words from proj2.json
fetch('proj2.json')
    .then(response => response.json())
    .then(data => {
        words = data.words;
        answer = words[Math.floor(Math.random() * words.length)];
        console.log("Answer:", answer); // For debugging
    })
    .catch(error => console.error("Error loading words:", error));

// Create game board cells
const gameBoard = document.getElementById("game-board");
for (let i = 0; i < maxAttempts * 5; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    gameBoard.appendChild(cell);
}

// Event listener for submitting guesses
document.getElementById("submit-guess").addEventListener("click", () => {
    if (gameOver) return;  // Stop processing if the game is over

    const guessInput = document.getElementById("guess-input");
    const guess = guessInput.value.toLowerCase();
    guessInput.value = "";  // Clear input immediately

    if (guess.length !== 5 || !words.includes(guess)) {
        alert("Please enter a valid 5-letter word.");
        return;
    }

    // Verify word with the API if the game is still active
    verifyWordWithAPI(guess);
});

function verifyWordWithAPI(word) {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => {
            if (response.ok) {
                checkGuess(word); // Proceed to guessing if the word is valid
            } else {
                alert("Invalid word! Please try another word.");
            }
        })
        .catch(error => {
            console.error("Error verifying word:", error);
            alert("Error connecting to dictionary. Please try again.");
        });
}

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

    // Check if the guess is correct
    if (guess === answer) {
        alert("Congratulations! You've guessed the word!");
        gameOver = true;  // Set game over flag
        document.getElementById("restart-game").style.display = "block"; // Show restart button
    } else if (currentRow === maxAttempts - 1) {
        alert(`Game over! The word was ${answer}`);
        gameOver = true;  // Set game over flag
        document.getElementById("restart-game").style.display = "block"; // Show restart button
    }

    currentRow++;
}

function updateUsedLetters(letter, status) {
    if (!usedLetters.has(letter)) {
        const usedLetterDiv = document.createElement("div");
        usedLetterDiv.textContent = letter;
        usedLetterDiv.classList.add(status);
        document.getElementById("used-letters").appendChild(usedLetterDiv);
        usedLetters.add(letter);
    }
}

// Hide the restart button when the game starts
document.getElementById("restart-game").style.display = "none";
