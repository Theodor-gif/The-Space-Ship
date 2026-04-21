

class game {
    constructor() {
        this.minutes = 0;
        this.seconds = 0;
        this.screen  = document.querySelector("body");
        this.screen.setAttribute("style",
            "height:100vh; overflow:hidden; display:flex; flex-direction:column;" +
            "align-items:center; background-image:linear-gradient(rgb(9,109,140), rgb(131,204,233))");
        this.user   = new player(300, 700, '100px', '100px');
        this.enemy  = new enemy();
        this.lifes  = 3;
    }
 
    gameScreen() {
        // --- HUD ---
        const time = document.createElement("div");
        time.innerHTML = `
            <h2 id="totalTime">Time : <span id="m1">0</span><span id="m2">${this.minutes}</span>
                :<span id="s1">0</span><span id="s2">${this.seconds}</span></h2>
            <h2>Lifes : <span id="lifes">${this.lifes}</span></h2>`;
        time.setAttribute("style",
            `display:flex; justify-content:space-evenly; color:white;
             font-family:"Bitcount Grid Double",system-ui; width:100vw; font-size:1.5rem;`);
        this.screen.appendChild(time);
 
        const secondsDisplay      = document.querySelector("#s2");
        const minutesDisplay      = document.querySelector("#m2");
        const firstSecondsDisplay = document.querySelector("#s1");
        const firstMinutesDisplay = document.querySelector("#m1");
        const playerLifes         = document.querySelector("#lifes");
 
        // --- Game screen container ---
        const gameScreen = document.createElement("div");
        gameScreen.setAttribute("style",
            "border:30px solid white; width:700px; height:800px;" +
            "background-image:url('./Images/background-image2.png');" +
            "position:relative; border-radius:20px; display:flex;" +
            "justify-content:start; align-items:center; flex-direction:column;");
        this.screen.appendChild(gameScreen);

        const gameButton = document.createElement("div");
        gameButton.innerHTML = `
            <h2>The Buttons</h2>
            <img src="./Images/move-buttons.png" alt="buttons" width="150px">`;
        gameButton.setAttribute("style",
            `font-family:"Bitcount Grid Double",system-ui;
             width:90%; color:white; display:flex; justify-content:space-evenly;
             align-items:center; font-size:1.5rem;`
             );
        this.screen.appendChild(gameButton);


        const gameTitle = document.createElement("div");
        gameTitle.innerHTML = `
            <h1>The Space Ship</h1>`;
        gameTitle.setAttribute("style",
            `text-align:center; font-family:"Bitcount Grid Double",system-ui;
             color:white; font-size:2rem; text-shadow:5px 5px 5px grey;`);
        gameScreen.appendChild(gameTitle);
 
        // --- Start screen ---
        const startGameScreen = document.createElement("div");
        startGameScreen.innerHTML = `
            <h1 id="title">Ready for Flying!!</h1>
            <label for="user-name">Player Name</label><br>
            <input type="text" id="user-name" name="user-name"><br>
            <button type="button" id="gameStart">START</button>`;
        startGameScreen.setAttribute("style",
            `text-align:center; font-family:"Bitcount Grid Double",system-ui;
             background-color:white; width:300px; height:300px; border-radius:10px;
             display:flex; justify-content:center; flex-direction:column;
             align-items:center; border:10px double rgb(131,204,233);`);
        gameScreen.appendChild(startGameScreen);
 
        const playerName    = document.querySelector("#user-name");
        const playerElement = this.user.playerDraw();
        gameScreen.appendChild(playerElement);
 
        const target = this.enemy.drawEnemy();
        gameScreen.appendChild(target);
 
        // FIX: create Game Over div but do NOT append it yet —
        // querySelector("#restart") ran before the element existed, causing a null crash
        const final = document.createElement("div");
        // Note: innerHTML is set later (when game ends) so the time is correct
        final.setAttribute("style",
            `font-family:"Bitcount Grid Double",system-ui; background-color:white;
             width:300px; height:300px; border-radius:10px; display:flex;
             justify-content:center; flex-direction:column; align-items:center;
             border:10px double rgb(131,204,233); z-index:999; position:absolute;
             margin-top:250px;`);
 
        // --- Helpers ---
        let animate, timeAnimate;
 
        const endGame = () => {
            clearInterval(animate);
            clearInterval(timeAnimate);
 
            // FIX: set innerHTML now so it captures the actual final time & player name
            final.innerHTML = `
                <h1>Game Over</h1>
                <h3>${playerName.value}</h3>
                <h3>Your Time : ${String(this.minutes).padStart(2,'0')}:${String(this.seconds).padStart(2,'0')}</h3>
                <button type="button" id="restart">Restart</button>`;
 
            gameScreen.appendChild(final); // FIX: append here so #restart exists in the DOM
 
            // FIX: querySelector runs AFTER the element is in the DOM
            document.querySelector("#restart").addEventListener("click", () => {
                // Full reset
                this.minutes = 0;
                this.seconds = 0;
                this.lifes   = 3;
                playerLifes.textContent         = this.lifes;
                secondsDisplay.textContent      = "0";
                minutesDisplay.textContent      = "0";
                firstSecondsDisplay.textContent = "0";
                firstMinutesDisplay.textContent = "0";
                this.enemy.speed = 15;
                this.user.x = 300;
                this.user.y = 700;
                this.user.playerPosition();
                this.enemy.top  = 0;
                this.enemy.left = Math.floor(Math.random() * 600) + 1;
                this.enemy.positionEnemy();
                gameScreen.removeChild(final);
                startGameScreen.style.display = "flex";
                target.style.display = "none";
                gameTitle.style.display = "flex";
            });
        };
 
        // --- Start button ---
        document.querySelector("#gameStart").addEventListener("click", () => {
            if (!playerName.value) return;
 
            startGameScreen.style.display = "none";
            target.style.display = "block";
            gameTitle.style.display = "none";
 
            animate = setInterval(() => {
                this.user.playerMove();
                this.enemy.update();
 
                // Clamp player inside game screen
                if (this.user.y < 0)    this.user.y = 0;
                if (this.user.x < 0)    this.user.x = 0;
                if (this.user.y > 700)  this.user.y = 700;
                if (this.user.x > 600)  this.user.x = 600;
 
                this.user.playerPosition();
 
                // Collision detection
                if (this.user.x < this.enemy.left + this.enemy.width  &&
                    this.user.x + this.user.width  > this.enemy.left   &&
                    this.user.y < this.enemy.top   + this.enemy.height &&
                    this.user.y + this.user.height > this.enemy.top) {
 
                    this.lifes--;
                    playerLifes.textContent = this.lifes;
 
                    if (this.lifes <= 0) {
                        endGame();
                    } else {
                        this.enemy.top  = 0;
                        this.enemy.left = Math.floor(Math.random() * 600) + 1;
                        this.enemy.positionEnemy();
                    }
                }
            }, 1000 / 60);
 
            timeAnimate = setInterval(() => {
                this.seconds++;
 
                // FIX: was > 60, meaning it hit 61 before resetting
                if (this.seconds >= 60) {
                    this.seconds = 0;
                    this.minutes++;
                    minutesDisplay.textContent = this.minutes;
                    firstMinutesDisplay.textContent = this.minutes > 9 ? "" : "0";
                }
 
                secondsDisplay.textContent      = this.seconds;
                firstSecondsDisplay.textContent = this.seconds < 10 ? "0" : "";

 
            }, 1000);
        });
    }
}
 
const play = new game();
play.gameScreen();