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

// Create game board cells
const gameBoard = document.getElementById("game-board");
for (let i = 0; i < maxAttempts * 5; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    gameBoard.appendChild(cell);
}

document.getElementById("submit-guess").addEventListener("click", () => {
    const guessInput = document.getElementById("guess-input");
    const guess = guessInput.value.toLowerCase();

    // Clear input immediately after submission attempt
    guessInput.value = "";

    // Check if the input is valid
    if (guess.length !== 5 || !words.includes(guess)) {
        alert("Please enter a valid 5-letter word.");
        return;
    }

    // If valid, verify with the API
    verifyWordWithAPI(guess);
});

function verifyWordWithAPI(word) {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => {
            if (response.ok) {
                checkGuess(word); // If the word is valid, proceed to guessing
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

    if (guess === answer) {
        alert("Congratulations! You've guessed the word!");
        document.getElementById("restart-game").style.display = "block";
    } else if (currentRow === maxAttempts - 1) {
        alert(`Game over! The word was ${answer}`);
        document.getElementById("restart-game").style.display = "block";
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
    
    currentRow++;
}

// Restart game logic
document.getElementById("restart-game").addEventListener("click", () => {
    currentRow = 0;
    answer = words[Math.floor(Math.random() * words.length)];
    console.log("New Answer:", answer); // For debugging
    usedLetters.clear();

    // Clear the game board
    Array.from(gameBoard.children).forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("correct", "wrong-place", "not-in-word");
    });

    // Clear used letters display
    document.getElementById("used-letters").innerHTML = "";

    // Hide restart button
    document.getElementById("restart-game").style.display = "none";
});
