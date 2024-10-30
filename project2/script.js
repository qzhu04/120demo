let words = [];
let answer = "";
let currentRow = 0;
const maxAttempts = 6;
const usedLetters = new Set();

// Fetch words from proj2.json
fetch('proj2.json')
    .then(response => response.json())
    .then(data => {
        words = data.words;
        answer = words[Math.floor(Math.random() * words.length)];
        console.log("Answer:", answer); // For debugging
    })
    .catch(error => console.error("Error loading words:", error));

// Set up the game board
const gameBoard = document.getElementById("game-board");
for (let i = 0; i < maxAttempts * 5; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    gameBoard.appendChild(cell);
}

// Event listener for submit guess button
document.getElementById("submit-guess").addEventListener("click", () => {
    const guessInput = document.getElementById("guess-input");
    const guess = guessInput.value.toLowerCase();

    if (guess.length !== 5) {
        alert("Please enter a valid 5-letter word.");
        return;
    }
    guessInput.value = ""; // Clear the input box
    verifyWordWithAPI(guess); // Validate with API
});

// Verify word with API and call checkGuess if valid
function verifyWordWithAPI(word) {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => {
            if (response.ok) {
                checkGuess(word); // Call checkGuess if word is valid
            } else {
                alert("Invalid word! Please try another word.");
            }
        })
        .catch(error => console.error("Error verifying word:", error));
}

// Check each guess
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

// Restart game
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

// Update used letters
function updateUsedLetters(letter, status) {
    if (!usedLetters.has(letter)) {
        const usedLetterDiv = document.createElement("div");
        usedLetterDiv.textContent = letter;
        usedLetterDiv.classList.add(status);
        document.getElementById("used-letters").appendChild(usedLetterDiv);
        usedLetters.add(letter);
    }
}
