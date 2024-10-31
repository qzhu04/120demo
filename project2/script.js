let words = [];
let answer = "";
let currentRow = 0;
const maxAttempts = 6;
const usedLetters = new Set();
let gameOver = false;

// Fetch words from proj2.json
fetch('proj2.json')
    .then(response => response.json())
    .then(data => {
        words = data.words;
        answer = words[Math.floor(Math.random() * words.length)];
        console.log("Answer:", answer); // Debugging line
    })
    .catch(error => console.error("Error loading words:", error));

// Create game board cells
const gameBoard = document.getElementById("game-board");
for (let i = 0; i < maxAttempts * 5; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    gameBoard.appendChild(cell);
}

// Handle guess submission
document.getElementById("submit-guess").addEventListener("click", () => {
    if (gameOver) return;  // Stop processing if the game is over

    const guessInput = document.getElementById("guess-input");
    const guess = guessInput.value.toLowerCase();
    guessInput.value = ""; // Clear input immediately after submission

    // Check if the input is valid
    if (guess.length !== 5 || !words.includes(guess)) {
        alert("Please enter a valid 5-letter word.");
        guessInput.focus();
        return;
    }

    // Verify word with the dictionary API
    verifyWordWithAPI(guess);
});

function verifyWordWithAPI(word) {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => {
            if (response.ok) {
                checkGuess(word); // Proceed with guess check if the word is valid
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

    // Initialize arrays to mark used letters for yellow cell logic
    let answerUsed = Array(answerArray.length).fill(false);
    let guessUsed = Array(guessArray.length).fill(false);

    // First pass: Check for exact matches
    guessArray.forEach((letter, index) => {
        const cell = gameBoard.children[rowStart + index];
        cell.textContent = letter;

        if (letter === answerArray[index]) {
            cell.classList.add("correct");
            updateUsedLetters(letter, "correct");
            guessUsed[index] = true;
            answerUsed[index] = true;
        }
    });

    // Second pass: Check for wrong-place letters
    guessArray.forEach((letter, index) => {
        if (!guessUsed[index]) {
            const cell = gameBoard.children[rowStart + index];

            if (answerArray.includes(letter)) {
                // Find a position where the letter is unused in the answer
                const answerIndex = answerArray.findIndex(
                    (ansLetter, ansIndex) => ansLetter === letter && !answerUsed[ansIndex]
                );
                
                if (answerIndex !== -1) {
                    cell.classList.add("wrong-place");
                    updateUsedLetters(letter, "wrong-place");
                    answerUsed[answerIndex] = true;
                } else {
                    cell.classList.add("not-in-word");
                    updateUsedLetters(letter, "not-in-word");
                }
            } else {
                cell.classList.add("not-in-word");
                updateUsedLetters(letter, "not-in-word");
            }
        }
    });

    // Check game state after guess
    if (guess === answer) {
        alert("Congratulations! You've guessed the word!");
        updateAverageGuesses();
        gameOver = true;
        document.getElementById("restart-game").style.display = "block";
    } else if (currentRow === maxAttempts - 1) {
        alert(`Game over! The word was ${answer}`);
        updateAverageGuesses();
        gameOver = true;
        document.getElementById("restart-game").style.display = "block";
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

function updateAverageGuesses() {
    let totalGames = parseInt(localStorage.getItem("totalGames") || "0");
    let totalGuesses = parseInt(localStorage.getItem("totalGuesses") || "0");

    totalGames++;
    totalGuesses += currentRow + 1;

    localStorage.setItem("totalGames", totalGames);
    localStorage.setItem("totalGuesses", totalGuesses);

    const averageGuesses = (totalGuesses / totalGames).toFixed(2);
    document.getElementById("average-guesses").textContent = `Average Guesses: ${averageGuesses}`;
}

// Restart button functionality
document.getElementById("restart-game").addEventListener("click", () => {
    currentRow = 0;
    gameOver = false;
    gameBoard.innerHTML = ""; // Clear the board
    for (let i = 0; i < maxAttempts * 5; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        gameBoard.appendChild(cell);
    }

    answer = words[Math.floor(Math.random() * words.length)];
    console.log("New Answer:", answer); // Debugging line
    document.getElementById("restart-game").style.display = "none";
    document.getElementById("used-letters").innerHTML = ""; // Clear used letters board
    usedLetters.clear();
    document.getElementById("guess-input").focus();
    document.getElementById("average-guesses").textContent = "Average Guesses: N/A";
});
