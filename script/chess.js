
// This event listener ensures that the 'draw' function is called when the DOM content is loaded.
document.addEventListener("DOMContentLoaded", draw);

// Function to draw the chessboard and initialize the game
function draw() {
    const chessboard = document.getElementById("chessboard");

    // Loop to create the 8x8 chessboard grid
    for (let row = 8; row >= 1; row--) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement("div");
            cell.setAttribute('data-col', col + 1);
            cell.setAttribute('data-row', row);

            // Add alternating background colors for a chessboard pattern (black and white squares)
            if ((row + col) % 2 === 0) {
                cell.classList.add(...['white', 'cell']);
            } else {
                cell.classList.add(...['black', 'cell']);
            }

            // Append the cell to the chessboard
            chessboard.appendChild(cell);

            // If it's the first row, add labels (A, B, C, ...)
            if (row === 1) {
                const label = document.createElement("span");
                label.classList.add("label");
                label.textContent = String.fromCharCode(65 + col); // A, B, C, ...
                cell.appendChild(label);
            }

            // If it's the first column and not row 1, add labels (2, 3, 4, ...)
            if (col === 0 && row !== 1) {
                const label = document.createElement("span");
                label.classList.add("label");
                label.textContent = row; // 2, 3, 4, ...
                cell.appendChild(label);
            };
        };
    };

    // Initialize the game's score and best score
    if (localStorage.getItem('bestScore')) {
        bestScoreBox.innerText = localStorage.getItem('bestScore');
        bestScore = localStorage.getItem('bestScore');
    } else { bestScoreBox.innerText = '0' };

    // Initialize the game by setting up event listeners for cell clicks
    getClickedCoordinate();
}

// Game variables
let score = 0;
const scoreBox = document.getElementById('currentScore');
scoreBox.innerText = score;

let bestScore = 0;
const bestScoreBox = document.getElementById('bestScore');

// Variable to save clickedCoordinate
let clickedCoordinate = [];

// Function to add event listeners for cell clicks
function getClickedCoordinate() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('click', getCoordinate);
    });
}

// Function to handle a cell click event
function getCoordinate(e) {
    const cell = e.target;
    const clickedCol = cell.getAttribute('data-col');
    const clickedRow = cell.getAttribute('data-row');
    clickedCoordinate = [+clickedCol, +clickedRow];

    // Reset styles for all cells
    const allCells = document.querySelectorAll('.cell');
    allCells.forEach(cell => {
        cell.classList.remove("clicked_wrong");
        cell.classList.remove("clicked_right");
    });

    // Check if the clicked cell matches the random target cell
    if (JSON.stringify(randomArr) === JSON.stringify(clickedCoordinate) && remainingTime > 0) {
        addTimeToTimer();
        score += 1;
        scoreBox.innerText = score;
        cell.classList.add('clicked_right')
        if (score > bestScore) {
            bestScoreBox.innerText = score
            localStorage.setItem('bestScore', bestScoreBox.innerText)
        }
        createRandomCoordinate();
    } else {
        if (remainingTime >= 1) {
            cell.classList.add('clicked_wrong')
            minusTimeFromTimer();
        }
        if (remainingTime === 0) {
            timer.innerText = 'game over';
            coorBox.innerText = score;
        }
    }
}

// Function to create a random target cell
const coorBox = document.querySelector('.coordinate');
coorBox.innerText = 'go';

let randomArr = [];
function createRandomCoordinate() {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8];
    const randomCol = Math.floor((Math.random() * arr.length));
    const randomRow = Math.floor((Math.random() * arr.length));
    let randomColLet = '';
    randomColLet = String.fromCharCode(65 + randomCol);
    randomArr = [arr[randomCol], arr[randomRow]];
    randomArrToPrint = `${randomColLet},${randomRow + 1}`;
    coorBox.innerText = randomArrToPrint;
}

// Event listener for starting a new game
const startBtn = document.getElementById('newgame');
const timer = document.querySelector('.timer');
startBtn.addEventListener('click', game);

// Function to start a new game
function game() {
    timer.style.color = 'black'
    timer.innerText = '30';
    remainingTime = 30;
    score = 0;
    scoreBox.innerText = score;
    createRandomCoordinate();
    startTimer()
}

// Timer functionality
let countdown;
let remainingTime = 30; // Separate variable to track remaining time
const addTime = 2;
const minusTime = 1;

// Function to start the timer
function startTimer() {
    if (!countdown) {
        countdown = setInterval(function () {
            remainingTime--;
            if (remainingTime > 0) {
                timer.innerText = remainingTime < 10 ? '0' + remainingTime : remainingTime;
                timer.style.color = remainingTime < 10 ? 'red' : 'black';
            } else if (remainingTime === 0) {
                timer.innerText = 'game over';
                coorBox.innerText = score;
            } else {
                clearInterval(countdown);
                countdown = null;
            }
        }, 1000);
    }
}

// Function to add time to the timer
function addTimeToTimer() {
    remainingTime += addTime;
    timer.style.color = 'green'
    timer.innerText = remainingTime < 10 ? '0' + remainingTime : remainingTime;
}

// Function to subtract time from the timer
function minusTimeFromTimer() {
    remainingTime -= minusTime;
    timer.style.color = 'red';
    timer.innerText = remainingTime < 10 ? '0' + remainingTime : remainingTime;
}

// Toggle Switch functionality
const toggleSwitch = document.getElementById("toggle");
const statusToggle = document.getElementById("status");

toggleSwitch.addEventListener("change", function () {
    if (toggleSwitch.checked) {
        statusToggle.textContent = "pro mode";
        const labels = document.querySelectorAll('.label');
        labels.forEach(label => {
            label.remove();
        });

    } else {
        statusToggle.textContent = "study mode";
        const chessboard = document.getElementById("chessboard");
        while (chessboard.firstChild) {
            chessboard.firstChild.remove();
        }
        draw();
    }
});

// Event listener to reset the best score
const resetBtn = document.getElementById('resetScore');
resetBtn.addEventListener('click', () => {
    localStorage.removeItem('bestScore');
    bestScoreBox.innerText = 0;
    game();
})
