let inGame = false;
let action = 0;
let actionShop = 0;
let actionPass = 0;
let actionPodium = 0;
let rightBar = 0;
let langVisibility = 0;
let language = "english";
let sound = true;
let notWord = false;
let changeTime = false
let roundlanguage = "english";
let hintN = false;
let hammerN = false;
let chanceN = false;
let hintValue = 0;
let hammerValue = 0;
let chanceValue = 0;
let openG = true;
let giftTimeouts = [];
const slider = document.getElementById("slider");
const box = document.getElementById("box");

slider.addEventListener("input", () => {
    /* box.style.top = slider.value + "px"; */
});

let costs = {
    restart: 150,
    hint: 100,
    hammer: 200,
    chance: 300,
}

let timer = {
    seconds: 0,
    decoseconds: 0,
    minutes: 0,
    decominutes: 0,
}

let shots = {
    first: 0,
    second: 0,
    third: 0,
    fourth: 0,
    fifth: 0,
    sixth: 0,
    seventh: 0,
}

const stats = {
    secret:"",
    usedLetters: [],
    grid: Array(6)
        .fill()
        .map(() => Array(5).fill("")),
    currentRow: 0,
    currentCol: 0,
};

const game = document.getElementById("wrap");
drawGrid(game);
document.getElementById("hintValue").textContent = hintValue;
document.getElementById("hammerValue").textContent = hammerValue;
document.getElementById("chanceValue").textContent = chanceValue;

changeEnglish();

function drawBox(container, row, column, letter = ""){
    const box = document.createElement("div");
    box.className = "box";
    box.id = `box${row}${column}`;
    box.textContent = letter;

    container.appendChild(box);
    return box;
}

function drawGrid(container){
    const grid = document.createElement("div");
    grid.className = "grid";

    for(let i = 0; i < 6; i++){
        for(let j = 0; j < 5; j++){
            drawBox(grid, i, j);
        }
    }

    container.appendChild(grid);

}

function options(){
    let leftBarApperDesaper = document.getElementById("left-bar");
    leftBarApperDesaper.classList.remove("init");
    if(action === 0){
        leftBarApperDesaper.classList.remove("out");
        leftBarApperDesaper.classList.add("in");
        action = 1;
    }else if(action === 1){
        leftBarApperDesaper.classList.remove("in");
        leftBarApperDesaper.classList.add("out");
        document.getElementById("shop").classList.add("desapear");
        document.getElementById("pass").classList.add("desapear");
        document.getElementById("leaderboard").classList.add("desapear");
        action = 0;
    }
}
document.getElementById("shop").style.zIndex = -1;
document.getElementById("pass").style.zIndex = -1;
document.getElementById("leaderboard").style.zIndex = -1;
function start(){
    roundlanguage = language;
    if(roundlanguage === "portuguese"){
        stats.secret = PALAVRAS[Math.floor(Math.random() * PALAVRAS.length)].toUpperCase();
        let c = document.getElementById("ç");
        let blank = document.getElementById("bl");
        
        c.style.visibility = "visible";
        blank.classList.remove("blank");    
    }else{
        stats.secret =  WORDS[Math.floor(Math.random() * WORDS.length + 1)].toUpperCase()
    }
    document.getElementById("restartBack").style.visibility = "visible";
    document.getElementById("restart").style.visibility = "visible";
    document.getElementById("restartCount").style.visibility = "visible";
    keyboard();
    changeTime = true;
    inGame = true;
    console.log(stats.secret)
}

function backgroundR(){
    document.getElementById("restartBack").style.backgroundColor = "#474747";
    document.getElementById("restart").classList.add("ro");
    setTimeout(() => {
        document.getElementById("restart").classList.remove("ro");
    }, 500)
}

function RbackgroundR(){
    document.getElementById("restartBack").style.backgroundColor = "#2f2f30";
}

function backgroundL(){
    document.getElementById("langBack").style.backgroundColor = "#474747";
    document.getElementById("lang").classList.add("ro");
    setTimeout(() => {
        document.getElementById("lang").classList.remove("ro");
    }, 500)
}

function LbackgroundL(){
    document.getElementById("langBack").style.backgroundColor = "#2f2f30";
}

function updateGrid(){
    for(let i = 0; i < stats.grid.length; i++){
        for(let j = 0; j < stats.grid[i].length; j++){
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = stats.grid[i][j].toUpperCase();
        }
    }
}

function virtualKeyboardClick(e){
    if(inGame === false) return;
    if(hintN && e === "ç"){
        let virtualKeyboard = document.getElementById("blank");
        let keys = document.getElementsByClassName("keys");
        for(let i = 0; i < keys.length; i++){
            keys[i].style.fontWeight = "normal";
        }
        virtualKeyboard.classList.add("animated");
        if(stats.secret.includes(e.toUpperCase())){
            virtualKeyboard.classList.add("wrong");
        }else{
            virtualKeyboard.classList.add("empty");
        }
        setTimeout(() =>{
            virtualKeyboard.classList.remove("animated");
        }, 500);
        if(!stats.usedLetters.includes(e)){
            stats.usedLetters.push(e);
        }
    }else if(hintN){
        let virtualKeyboard = document.getElementById(e);
        let keys = document.getElementsByClassName("keys");
        for(let i = 0; i < keys.length; i++){
            keys[i].style.fontWeight = "normal";
        }
        virtualKeyboard.classList.add("animated");
        if(stats.secret.includes(e.toUpperCase())){
            virtualKeyboard.classList.add("wrong");
        }else{
            virtualKeyboard.classList.add("empty");
        }
        setTimeout(() =>{
            virtualKeyboard.classList.remove("animated");
        }, 500);
        if(!stats.usedLetters.includes(e)){
            stats.usedLetters.push(e);
        }
        hintValue--;
        document.getElementById("hintValue").textContent = hintValue;
        hintN = false;
    }else{
        addLetter(e);
        updateGrid();
    }
}

function deleteVirtual(){
    if(inGame === false) return;
    removeAnnounce();
    removeLetter();
    updateGrid();
}

function enter(){
    if(inGame === false) return;
    if(stats.currentCol === 5){
        const word = getCurrentWord();
        if(isWordValid(word)){
            revealWord(word);
            stats.currentRow++;
            stats.currentCol = 0;
        }else{
            announce("The list doesn't contain this word");
        }
    }else{
        announce("You need to fill all the boxes");
    }
    updateGrid();
}

function deleteAll(){
    if(inGame === false) return;
    removeAnnounce();
    removeAllLetters();
    updateGrid();
}

function hammer(){
    if(inGame === false) return;
    if(hammerValue > 0){
        if(hammerN){
            document.getElementById("arrow").style.visibility = "hidden";
            document.getElementById("decominutes").style.visibility = "visible";
            document.getElementById("minutes").style.visibility = "visible";
            document.getElementById("timeDivision").style.visibility = "visible";
            document.getElementById("decoseconds").style.visibility = "visible";
            document.getElementById("seconds").style.visibility = "visible";
            document.getElementById("points").style.visibility = "visible";
            hammerN = false;
        }else{
            document.getElementById("arrow").style.visibility = "visible";
            document.getElementById("decominutes").style.visibility = "hidden";
            document.getElementById("minutes").style.visibility = "hidden";
            document.getElementById("timeDivision").style.visibility = "hidden";
            document.getElementById("decoseconds").style.visibility = "hidden";
            document.getElementById("seconds").style.visibility = "hidden";
            document.getElementById("points").style.visibility = "hidden";
            removeAnnounce();
            hammerN = true;
        }
        updateUser();
    }
}

function hint(){
    if(inGame === false) return;
    if(hintValue > 0){
        if(hintN){
            let keys = document.getElementsByClassName("keys");
            for(let i = 0; i < keys.length; i++){
                keys[i].style.fontWeight = "normal";
            }
            hintN = false;
        }else{
            let keys = document.getElementsByClassName("keys");
            for(let i = 0; i < keys.length; i++){
                keys[i].style.fontWeight = "bold";
            }
            hintN = true;
        }
        updateUser();
    }
}

function chance(){
    if(inGame === false) return;
    const grid = document.getElementsByClassName("grid")[0];
    if(chanceValue > 0 && !chanceN && inGame){
        console.log(inGame);
        let i = stats.grid.length;
        // Add a new row to stats.grid
        stats.grid.push(Array(5).fill(""));
        for(let j = 0; j < 5; j++){
            drawBox(grid, i, j);
        }

        for(let y = 0; y <= i; y++){
            for(let x = 0; x < 5; x++){
                const box = document.getElementById(`box${y}${x}`);
                if(window.innerWidth < 600){
                    box.style.height = "40px";
                }else{
                    box.style.height = "50px";
                }
            }
        }
        chanceN = true;
        chanceValue--;
        document.getElementById("chanceValue").textContent = chanceValue;
        updateUser();
    }
}

function eraseChance() {
    chanceN = false;
    // Remove the extra row visually and from stats.grid
    if (stats.grid.length > 6) {
        stats.grid.pop();
        // Remove the extra row's boxes from the DOM
        for (let j = 0; j < 5; j++) {
            const box = document.getElementById(`box6${j}`);
            if (box) box.remove();
        }
    }
    // Reset all box heights to normal (60px)
    for(let y = 0; y < stats.grid.length; y++){
        for(let x = 0; x < 5; x++){
            const box = document.getElementById(`box${y}${x}`);
            if (box) box.style.height = ""; // Let CSS handle the height
        }
    }
}

function line(line){
    for(let i = stats.currentRow; i <= 5; i++){
        const box = document.getElementById(`box${i}${line}`);
        box.classList.add("rotate");
        setTimeout(function(){
            box.textContent = stats.secret[line];
            stats.grid[i][line] = stats.secret[line];
            box.style.color = "#538d4e";
        }, 250)

        setTimeout(function(){
            box.classList.remove("rotate")
        }, 500)
    }
    hammerValue--;
    document.getElementById("hammerValue").textContent = hammerValue;
    document.getElementById("arrow").style.visibility = "hidden";
    document.getElementById("decominutes").style.visibility = "visible";
    document.getElementById("minutes").style.visibility = "visible";
    document.getElementById("timeDivision").style.visibility = "visible";
    document.getElementById("decoseconds").style.visibility = "visible";
    document.getElementById("seconds").style.visibility = "visible";
    document.getElementById("points").style.visibility = "visible";
}

function keyboard(){
    document.body.onkeydown = (e) => {
        if(inGame){
            const key = e.key;
            if(key === "Enter"){
                if(stats.currentCol === 5){
                    const word = getCurrentWord();
                    if(isWordValid(word)){
                        revealWord(word);
                        stats.currentRow++;
                        stats.currentCol = 0;
                    }else{
                        announce("The list doesn't contain this word");
                    }
                }else{
                    announce("You need to fill all the boxes");
                }
            }

            if(key === "Backspace"){
                removeAnnounce();
                removeLetter();
            }

            if(isLetter(key)){                
                if(stats.currentCol != 5){
                    removeAnnounce();
                }

                addLetter(key);

            }
            
            updateGrid();
        }
    }
}

function getCurrentWord() {
    return stats.grid[stats.currentRow].reduce((prev, curr) => prev + curr);
}

function isWordValid(word) {
if(roundlanguage === "portuguese"){
        return PALAVRAS.includes(word);
    }else{
        return WORDS.includes(word);
    }


}

function revealWord(guess){
    const row = stats.currentRow;
    const animation_duration = 500;
    const audio = document.getElementById("audio1");
    const audio1 = document.getElementById("audio2");
    const audio2 = document.getElementById("audio3");
    const audio3 = document.getElementById("audio4");
    const audio4 = document.getElementById("audio5");
    for(let i = 0; i < 5; i++){
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;
        if(!stats.usedLetters.includes(letter)){
            stats.usedLetters.push(letter);
        }
        const virtualKeyboard = document.getElementById(letter.toLowerCase());
        if(sound){
            setTimeout(() =>{
                audio.play();
            }, 0);
            setTimeout(() =>{
                audio1.play();
            }, 250);
            setTimeout(() =>{
                audio2.play();
            }, 500);
            setTimeout(() =>{
                audio3.play();
            }, 750);
            setTimeout(() =>{
                audio4.play();
            }, 1000);
        }

        setTimeout(() =>{
            virtualKeyboard.classList.add("animated");
            virtualKeyboard.classList.remove("wrong");
            if(letter === stats.secret[i]){
                box.style.borderColor = "#538d4e";
                box.classList.add("correct");
                virtualKeyboard.classList.add("correct");
            }else if(stats.secret.includes(letter)){
                box.style.borderColor = "#b59f3b";
                box.classList.add("wrong");
                virtualKeyboard.classList.add("wrong");
            }else{
                box.style.borderColor = "#5c5656";
                box.classList.add("empty");
                virtualKeyboard.classList.add("empty");
            }
            setTimeout(() =>{
                box.classList.remove("animated");
                virtualKeyboard.classList.remove("animated");
            }, 500);
        }, ((i + 1) * animation_duration) / 2);

        
        box.classList.add("animated");
        box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
    }
    

    const isWinning = stats.secret === guess.toUpperCase();
    const gameOver = stats.currentRow === 5;
    setTimeout(() => {
        if(isWinning){
            youWin();
            if(stats.currentRow === 1){
                shots.first++;
            }else if(stats.currentRow === 2){
                shots.second++;
            }else if(stats.currentRow === 3){
                shots.third++;
            }else if(stats.currentRow === 4){
                shots.fourth++;
            }else if(stats.currentRow === 5){
                shots.fifth++;
            }else if(stats.currentRow === 6){
                shots.sixth++;
            }else if(stats.currentRow === 7){
                shots.seventh++;
            }
            updateUser();

            inGame = false;
        }else if((!chanceN && stats.currentRow === 6) || (chanceN && stats.currentRow === 7)){
            youLose();
            inGame = false;
            chanceN = false;
        }
    }, 3 * animation_duration);
}



function isLetter(key){
    return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(letter){
    if(stats.currentCol === 5 || !inGame && stats.currentRow != 6) return;
    
    if(stats.currentRow === 6){
        console.log(stats.currentRow,stats.currentCol);
        stats.grid[stats.currentRow][stats.currentCol] = letter;
        document.getElementById(`box${6}${stats.currentCol}`).style.borderColor = "#905f70";
        document.getElementById(`box${6}${stats.currentCol}`).style.color = "white";
        stats.currentCol++; 
    }else{
        console.log(stats.currentRow,stats.currentCol);
        stats.grid[stats.currentRow][stats.currentCol] = letter;
        document.getElementById(`box${stats.currentRow}${stats.currentCol}`).style.borderColor = "#905f70";
        document.getElementById(`box${stats.currentRow}${stats.currentCol}`).style.color = "white";
        stats.currentCol++; 
    }
}

function removeLetter(){
    if(stats.currentCol === 0) return;
    stats.grid[stats.currentRow][stats.currentCol - 1] = "";
    document.getElementById(`box${stats.currentRow}${stats.currentCol - 1}`).style.borderColor = "#3a3a3c";
    stats.currentCol--;
}

function removeAllLetters(){
    if(stats.currentCol === 0) return;
    for(let i = stats.currentCol; i >= 1; i--){
        stats.grid[stats.currentRow][stats.currentCol - 1] = "";
        document.getElementById(`box${stats.currentRow}${stats.currentCol - 1}`).style.borderColor = "#3a3a3c";
        stats.currentCol--;
    }
    stats.currentCol = 0;
}

function announce(text){
    let annoncement = document.getElementById("annoncement");
    if(roundlanguage === "portuguese"){
        annoncement.textContent = "Essa palavra não existe na lista";
    }else{
        annoncement.textContent = text;
    }

}

setInterval(() => {
    if(changeTime && inGame){
        if(timer.decominutes >= 5){
            document.getElementById("decominutes").style.color = "red";
            document.getElementById("minutes").style.color = "red";
            document.getElementById("timeDivision").style.color = "red";
            document.getElementById("decoseconds").style.color = "red";
            document.getElementById("seconds").style.color = "red";

            setTimeout(() => {
                document.getElementById("decominutes").style.color = "white";
                document.getElementById("minutes").style.color = "white";
                document.getElementById("timeDivision").style.color = "white";
                document.getElementById("decoseconds").style.color = "white";
                document.getElementById("seconds").style.color = "white";
            }, 500)
        }

        timer.seconds++;
        if(timer.decominutes === 5 && timer.minutes === 9 && timer.decoseconds === 5 && timer.seconds === 10){

            setTimeout(() => {
                youLose();
                document.getElementById("decominutes").textContent = timer.decominutes;
                document.getElementById("minutes").textContent = timer.minutes;
                document.getElementById("decoseconds").textContent = timer.decoseconds;
                document.getElementById("seconds").textContent = timer.seconds;
            }, 250)
            timer.decominutes = 0;
            timer.minutes = 0;
            timer.decoseconds = 0;
            timer.seconds = 0;
        }

        if(timer.minutes === 9 && timer.decoseconds === 5 && timer.seconds === 10){
            timer.decominutes++;
            timer.minutes = 0;
            timer.decoseconds = 0;
            timer.seconds = 0;
        }else if(timer.decoseconds === 5 && timer.seconds === 10){
            timer.minutes++;
            timer.decoseconds = 0;
            timer.seconds = 0;
        }
        
        if(timer.seconds === 10){
            timer.decoseconds++;
            timer.seconds = 0;
        }

        document.getElementById("decominutes").textContent = timer.decominutes;
        document.getElementById("minutes").textContent = timer.minutes;
        document.getElementById("decoseconds").textContent = timer.decoseconds;
        document.getElementById("seconds").textContent = timer.seconds;
    }
}, 1000)

function youWin(){
    openG = true;
    if(chanceN){
        setTimeout(() =>{
            endGame("Y", 0, 0, "correct");
            endGame("O", 1, 0, "correct");
            endGame("U", 2, 0, "correct");
            endGame("", 3, 0, "empty");
            endGame("", 4, 0, "empty");

            endGame("", 0, 1, "empty");
            endGame("W", 1, 1, "correct");
            endGame("O", 2, 1, "correct");
            endGame("N", 3, 1, "correct");
            endGame("!", 4, 1, "correct");

            endGame("", 0, 2, "empty");
            endGame("", 1, 2, "empty");
            endGame("", 2, 2, "empty");
            endGame("", 3, 2, "empty");
            endGame("", 4, 2, "empty");
            
            endGame("", 0, 3, "empty");
            endGame("", 1, 3, "empty");
            endGame("", 2, 3, "empty");
            endGame("", 3, 3, "empty");
            endGame("", 4, 3, "empty");

            endGame("P", 0, 4, "correct");
            endGame("I", 1, 4, "correct");
            endGame("C", 2, 4, "correct");
            endGame("K", 3, 4, "correct");
            endGame("", 4, 4, "empty");

            endGame("", 0, 5, "empty");
            endGame("O", 1, 5, "correct");
            endGame("N", 2, 5, "correct");
            endGame("E", 3, 5, "correct");
            endGame(":", 4, 5, "correct");

            endGame("", 0, 6, "gift1");
            endGame("", 1, 6, "gift2");
            endGame("", 2, 6, "gift3");
            endGame("", 3, 6, "gift4");
            endGame("", 4, 6, "gift5");
        }, 700); 
    }else{
        setTimeout(() =>{
            endGame("Y", 0, 0, "correct");
            endGame("O", 1, 0, "correct");
            endGame("U", 2, 0, "correct");
            endGame("", 3, 0, "empty");
            endGame("", 4, 0, "empty");

            endGame("", 0, 1, "empty");
            endGame("W", 1, 1, "correct");
            endGame("O", 2, 1, "correct");
            endGame("N", 3, 1, "correct");
            endGame("!", 4, 1, "correct");

            endGame("", 0, 2, "empty");
            endGame("", 1, 2, "empty");
            endGame("", 2, 2, "empty");
            endGame("", 3, 2, "empty");
            endGame("", 4, 2, "empty");

            endGame("P", 0, 3, "correct");
            endGame("I", 1, 3, "correct");
            endGame("C", 2, 3, "correct");
            endGame("K", 3, 3, "correct");
            endGame("", 4, 3, "empty");

            endGame("", 0, 4, "empty");
            endGame("O", 1, 4, "correct");
            endGame("N", 2, 4, "correct");
            endGame("E", 3, 4, "correct");
            endGame(":", 4, 4, "correct");

            endGame("", 0, 5, "gift1");
            endGame("", 1, 5, "gift2");
            endGame("", 2, 5, "gift3");
            endGame("", 3, 5, "gift4");
            endGame("", 4, 5, "gift5");
        }, 700);
    }
    const winsElem = document.getElementById("totalWins");
    const currentWins = parseInt(winsElem.textContent.replace("Total Wins: ", "")) || 0;
    winsElem.textContent = `Total Wins: ${currentWins + 1}`;   
    const gamesElem = document.getElementById("totalGames"); 
    const currentGames = parseInt(gamesElem.textContent.replace("Total Games: ", "")) || 0;
    gamesElem.textContent = `Total Games: ${currentGames + 1}`;
    updateUser();

}

function youLose(){
     if (!inGame) return;
    if(chanceN){
        setTimeout(() =>{
            endGame("Y", 0, 0, "wrong");
            endGame("O", 1, 0, "wrong");
            endGame("U", 2, 0, "wrong");
            endGame("", 3, 0, "empty");
            endGame("", 4, 0, "empty");

            endGame("", 0, 1, "empty");
            endGame("L", 1, 1, "wrong");
            endGame("O", 2, 1, "wrong");
            endGame("S", 3, 1, "wrong");
            endGame("E", 4, 1, "wrong");

            endGame("", 0, 2, "empty");
            endGame("", 1, 2, "empty");
            endGame("", 2, 2, "empty");
            endGame("", 3, 2, "empty");
            endGame("", 4, 2, "empty");

            endGame("", 0, 3, "empty");
            endGame("T", 1, 3, "wrong");
            endGame("H", 2, 3, "wrong");
            endGame("E", 3, 3, "wrong");
            endGame("", 4, 3, "empty");

            endGame("", 0, 4, "empty");
            endGame("W", 1, 4, "wrong");
            endGame("O", 2, 4, "wrong");
            endGame("R", 3, 4, "wrong");
            endGame("D", 4, 4, "wrong");

            endGame("W", 0, 5, "wrong");
            endGame("A", 1, 5, "wrong");
            endGame("S", 2, 5, "wrong");
            endGame(":", 3, 5, "wrong");
            endGame("", 4, 5, "empty");
            
            endGame(stats.secret[0], 0, 6, "correct");
            endGame(stats.secret[1], 1, 6, "correct");
            endGame(stats.secret[2], 2, 6, "correct");
            endGame(stats.secret[3], 3, 6, "correct");
            endGame(stats.secret[4], 4, 6, "correct");
        }, 700);
    }else{
        setTimeout(() =>{
            endGame("Y", 0, 0, "wrong");
            endGame("O", 1, 0, "wrong");
            endGame("U", 2, 0, "wrong");
            endGame("", 3, 0, "empty");
            endGame("", 4, 0, "empty");

            endGame("", 0, 1, "empty");
            endGame("L", 1, 1, "wrong");
            endGame("O", 2, 1, "wrong");
            endGame("S", 3, 1, "wrong");
            endGame("E", 4, 1, "wrong");

            endGame("", 0, 2, "empty");
            endGame("T", 1, 2, "wrong");
            endGame("H", 2, 2, "wrong");
            endGame("E", 3, 2, "wrong");
            endGame("", 4, 2, "empty");

            endGame("", 0, 3, "empty");
            endGame("W", 1, 3, "wrong");
            endGame("O", 2, 3, "wrong");
            endGame("R", 3, 3, "wrong");
            endGame("D", 4, 3, "wrong");

            endGame("W", 0, 4, "wrong");
            endGame("A", 1, 4, "wrong");
            endGame("S", 2, 4, "wrong");
            endGame(":", 3, 4, "wrong");
            endGame("", 4, 4, "empty");
            
            endGame(stats.secret[0], 0, 5, "correct");
            endGame(stats.secret[1], 1, 5, "correct");
            endGame(stats.secret[2], 2, 5, "correct");
            endGame(stats.secret[3], 3, 5, "correct");
            endGame(stats.secret[4], 4, 5, "correct");
        }, 700);
    }
    const gamesElem = document.getElementById("totalGames"); 
    const currentGames = parseInt(gamesElem.textContent.replace("Total Games: ", "")) || 0;
    gamesElem.textContent = `Total Games: ${currentGames + 1}`;
    updateUser();
}

function endGame(letter, boxI, boxJ, value){
    changeTime = false;
    const box = document.getElementById(`box${boxJ}${boxI}`);
    const animation_duration = 500;
    setTimeout(() => {
        box.textContent = "";
        box.style.color = "white";
        stats.grid[boxJ][boxI] = "";
    }, ((boxI + 1) * animation_duration) / 4)

    setTimeout(() =>{  
        for(let i = 0; i < stats.usedLetters.length; i++){
            const virtualKeyboard = document.getElementById(stats.usedLetters[i].toLowerCase());
            virtualKeyboard.classList.remove("wrong");
            virtualKeyboard.classList.remove("correct");
            virtualKeyboard.classList.remove("empty");
            virtualKeyboard.classList.remove("animated");
        }

        box.classList.remove("correct");
        box.classList.remove("wrong");
        box.classList.remove("empty");
        box.style.borderColor = "#3a3a3c";

        if(value.includes("gift")){
            let gift = document.getElementById(value);
            box.style.backgroundColor = "#fa7e44";
            box.style.borderColor = "#fa7e44";
            if (gift) {
                box.appendChild(gift);
                gift.classList.remove("hidden");
                gift.style.visibility = "visible";
                gift.style.display = ""; // Ensure it's visible
            }
        }else if(value === "correct"){
            box.classList.add("correct");
            box.style.borderColor = "#538d4e";
            box.textContent = letter;
        }else if(value === "wrong"){
            box.classList.add("wrong");
            box.style.borderColor = "#b59f3b";
            box.textContent = letter;
        }else{
            box.classList.add("empty");
            box.style.borderColor = "#5c5656";
            box.textContent = letter;
        }
        
    }, ((boxI + 1) * animation_duration) / 2);

    document.getElementById("restartCount").style.visibility = "hidden";
    const gamesElem = document.getElementById("totalGames");
    box.classList.add("animated");
    box.style.animationDelay = `${(boxI * animation_duration) / 2}ms`;
}


function removeAnnounce(){
    const announcement = document.getElementById("annoncement");
    announcement.textContent = "";
}

function mute(){
    document.getElementById("mute").style.visibility = "visible";
    document.getElementById("unmute").style.visibility = "hidden";
    sound = false;
}

function unmute(){
    document.getElementById("mute").style.visibility = "hidden";
    document.getElementById("unmute").style.visibility = "visible";
    sound = true;
}

function createNewWordle(){
    inGame = false;
    document.getElementById("shader").style.visibility = "visible";
    document.getElementById("newWordle").style.visibility = "visible";
}

function hide(){
    document.getElementById("shader").style.visibility = "hidden";
    document.getElementById("Log-In").classList.add("hidden");
    document.getElementById("Log-In").style.visibility = "hidden";
    document.getElementById("account").style.visibility = "hidden";
    document.getElementById("bug").style.visibility = "hidden";
    document.getElementById("Sign-Up").classList.add("hidden");
}

function check(){
    const notAWord = document.getElementById("noWord");
    const newWord = document.getElementById("word");
    const word = newWord.value.toLowerCase();
    if(word.length === 5){
        if(WORDS.includes(word)){
            restart(word.toUpperCase());
            hide();
            notWord = false;
            notAWord.style.visibility = "hidden";
        }else{
            notWord = true;
            notAWord.style.visibility = "visible";
        }
    }
}

function moveAllGiftsHome() {
    for (let i = 1; i <= 5; i++) {
        const gift = document.getElementById("gift" + i);
        const giftsContainer = document.getElementById("gifts");
        if (gift && gift.parentNode !== giftsContainer) {
            giftsContainer.appendChild(gift);
        }
        if (gift) {
            gift.classList.add("hidden");
            gift.style.visibility = "";
            gift.style.display = "";
            gift.style.fill = "white";
        }
    }
}

function moveMoneyRewardHome() {
    const moneyReward = document.getElementById("moneyReward");
    const container = document.getElementById("moneyRewardContainer");
    if (moneyReward && container && moneyReward.parentNode !== container) {
        container.appendChild(moneyReward);
        moneyReward.classList.add("hidden");
    }
}

function restart(word){
    giftTimeouts.forEach(timeout => clearTimeout(timeout));
    giftTimeouts = [];
    moveAllGiftsHome();
    moveMoneyRewardHome();
    let restartCount = document.getElementById("restartCount");
    eraseChance();
    restartCount.style.visibility = "visible";
    if(restartCount.textContent > 0 || !inGame){
        removeAnnounce();
        roundlanguage = language
        if(roundlanguage === "portuguese"){
            word = PALAVRAS[Math.floor(Math.random() * PALAVRAS.length)].toUpperCase();
            let c = document.getElementById("ç");
            let blank = document.getElementById("bl");
            
            c.style.visibility = "visible";
            blank.classList.remove("blank");        
        }

        for(let i = 0; i < stats.usedLetters.length; i++){
            const virtualKeyboard = document.getElementById(stats.usedLetters[i].toLowerCase());
            virtualKeyboard.classList.remove("wrong");
            virtualKeyboard.classList.remove("correct");
            virtualKeyboard.classList.remove("empty");
            virtualKeyboard.classList.remove("animated");
        }

        for(let i = 0; i < 6; i++){
            for(let j = 0; j < 5; j++){
                const box = document.getElementById(`box${i}${j}`);
                if (box.textContent)
                    box.textContent = "";

                box.classList.remove("wrong");
                box.classList.remove("correct");
                box.classList.remove("empty");
                box.classList.remove("animated");
                box.style.borderColor = "#3a3a3c";
                box.style.backgroundColor = "";
                stats.grid[i][j] = "";
            }
        }    
        
        for(let i = 1; i <= 5; i++){
            const gift = document.getElementById("gift" + i);
            if (gift) {
                gift.classList.add("hidden");
                gift.style.visibility = "";
                gift.style.display = "";
                gift.style.fill = "";
                document.getElementById("gifts").appendChild(gift);
            }
        }

        stats.currentCol = 0;
        stats.currentRow = 0;
        stats.secret = word;
        timer.decominutes = 0;
        timer.minutes = 0;
        timer.decoseconds = 0;
        timer.seconds = 0;
        document.getElementById("decominutes").textContent = timer.decominutes;
        document.getElementById("minutes").textContent = timer.minutes;
        document.getElementById("decoseconds").textContent = timer.decoseconds;
        document.getElementById("seconds").textContent = timer.seconds;
        setTimeout(() => {
            changeTime = true;
            inGame = true;
        }, 2000)
        console.log(stats.secret);
        if(inGame){
            restartCount.textContent = parseInt(restartCount.textContent) - 1;
            updateUser();
        }
        openG = true;
    }else{
        restartCount.style.color = "red";
        restartCount.style.fontStyle = "bold";
        setTimeout(() => {
            restartCount.style.color = "white";
            restartCount.style.fontStyle = "normal";
        }, 500)
    }
}

function giveup(){
    giftTimeouts.forEach(timeout => clearTimeout(timeout));
    giftTimeouts = [];
    moveAllGiftsHome();
    moveMoneyRewardHome();
    eraseChance();
    restartCount.style.visibility = "visible";
    removeAnnounce();

    for(let i = 0; i < stats.usedLetters.length; i++){
        const virtualKeyboard = document.getElementById(stats.usedLetters[i].toLowerCase());
        virtualKeyboard.classList.remove("wrong");
        virtualKeyboard.classList.remove("correct");
        virtualKeyboard.classList.remove("empty");
        virtualKeyboard.classList.remove("animated");
    }

    for(let i = 0; i < 6; i++){
        for(let j = 0; j < 5; j++){
            const box = document.getElementById(`box${i}${j}`);
            if (box.textContent)
                box.textContent = "";

            box.classList.remove("wrong");
            box.classList.remove("correct");
            box.classList.remove("empty");
            box.classList.remove("animated");
            box.style.borderColor = "#3a3a3c";
            box.style.backgroundColor = "";
            stats.grid[i][j] = "";
        }
    }   

    stats.currentCol = 0;
    stats.currentRow = 0;
    timer.decominutes = 0;
    timer.minutes = 0;
    timer.decoseconds = 0;
    timer.seconds = 0;
    document.getElementById("decominutes").textContent = timer.decominutes;
    document.getElementById("minutes").textContent = timer.minutes;
    document.getElementById("decoseconds").textContent = timer.decoseconds;
    document.getElementById("seconds").textContent = timer.seconds;
    changeTime = false;
    inGame = false;
    document.getElementById("restartCount").style.visibility = "hidden";
    document.getElementById("restart").style.visibility = "hidden";
    document.getElementById("restartBack").style.visibility = "hidden";
}


function changeLanguages(){
    if(langVisibility === 0){
        document.getElementById("language").classList.remove("hidden");
        document.getElementById("language").classList.add("appearLang");
        langVisibility = 1
        setTimeout(() => {
            document.getElementById("language").classList.remove("appearLang");
            document.getElementById("portugues").style.visibility = "visible";
            document.getElementById("english").style.visibility = "visible";
        }, 500);
    }else if(langVisibility === 1){
        document.getElementById("language").classList.add("desappearLang");         
        document.getElementById("portugues").style.visibility = "hidden";
        document.getElementById("english").style.visibility = "hidden";

        langVisibility = 0
        setTimeout(() => {
            document.getElementById("language").classList.remove("desappearLang");
            document.getElementById("language").classList.add("hidden");
        }, 490);
    }
    
}

function changePortuguese(){
    document.getElementById("portugues").style.backgroundColor = "#538D4E";
    document.getElementById("english").style.backgroundColor = "#474747";

    if(language === "english"){
        language = "portuguese";
    }
}

function changeEnglish(){
    document.getElementById("portugues").style.backgroundColor = "#474747";
    document.getElementById("english").style.backgroundColor = "#538D4E"
    let c = document.getElementById("ç");
    let blank = document.getElementById("bl");

    c.style.visibility = "hidden";
    blank.classList.add("blank");

    if(language === "portuguese"){
        language = "english";
    }
}

function toggleBar(elementId, action, barValue) {
    const element = document.getElementById(elementId);
    element.classList.remove("init", "appear", "desapear");

    if (action === 1 && rightBar === barValue) {
        element.classList.add("desapear");
            setTimeout(() => {
                element.style.zIndex = -1;
            }, 2000);
        return 0;
    } else {
        if (rightBar === 1) {
            const shop = document.getElementById("shop");
            shop.classList.add("desapear");
            setTimeout(() => {
                shop.style.zIndex = -1;
            }, 2000);
            actionShop = 0;
        } else if (rightBar === 2) {
            const pass = document.getElementById("pass");
            pass.classList.add("desapear");
            setTimeout(() => {
                pass.style.zIndex = -1;
            }, 2000);
            actionPass = 0;
        } else if (rightBar === 3) {
            const leaderboard = document.getElementById("leaderboard");
            leaderboard.classList.add("desapear");
            setTimeout(() => {
                leaderboard.style.zIndex = -1;
            }, 2000);
            actionPodium = 0;
        }

        element.classList.add("appear");
        element.style.zIndex = 1;
        return 1;
    }
}

function shopChange() {
    actionShop = toggleBar("shop", actionShop, 1);
    document.getElementById("shop").style.left = "105px";
    rightBar = actionShop === 1 ? 1 : 0;
}

function passChange() {
    actionPass = toggleBar("pass", actionPass, 2);
    rightBar = actionPass === 1 ? 2 : 0;
}

function podiumChange() {
    actionPodium = toggleBar("leaderboard", actionPodium, 3);
    rightBar = actionPodium === 1 ? 3 : 0;
}

function gift(gift){
    if(openG){
        let present = document.getElementById("gift" + gift);
        const box = document.getElementById(`box${5}${gift-1}`);
        present.classList.add("present");
        let timeout = setTimeout(() => {
            present.classList.remove("present");
            present.classList.add("hidden");
            let reward = Math.floor(Math.random() * 500 + 1);
            let money = Math.floor(Math.random() * (250 - 50) + 50);
            document.getElementById("money").textContent = money + parseInt(document.getElementById("money").textContent);
            let moneyRElem = document.getElementById("moneyR");
            if (moneyRElem) {
                moneyRElem.textContent = money;
            }
            const moneyReward = document.getElementById("moneyReward");
            if (moneyReward) {
                moneyReward.classList.remove("hidden");
                if (box && moneyReward.parentNode !== box) {
                    box.appendChild(moneyReward);
                }
            }
            present.classList.add("hidden");
            for(let i = 1; i <= 5; i++){
                let g = document.getElementById("gift" + i);
                if (g) g.style.fill = "#cacaca";
            }
            updateUser();
        }, 1900);
        giftTimeouts.push(timeout);
    }
    openG = false;
}

function buyHint(){
    if(document.getElementById("money").textContent >= costs.hint){
        document.getElementById("money").textContent = parseInt(document.getElementById("money").textContent) - costs.hint;
        hintValue++;
        console.log(hintValue);
        document.getElementById("hintValue").textContent = hintValue;
    }
    updateUser();
}

function buyHammer(){
    if(document.getElementById("money").textContent >= costs.hammer){
        document.getElementById("money").textContent = parseInt(document.getElementById("money").textContent) - costs.hammer;
        hammerValue++;
        document.getElementById("hammerValue").textContent = hammerValue;
    }
    updateUser();
}

function buyChance(){
    if(document.getElementById("money").textContent >= costs.chance){
        document.getElementById("money").textContent = parseInt(document.getElementById("money").textContent) - costs.chance;
        chanceValue++;
        document.getElementById("chanceValue").textContent = chanceValue;
    }
    updateUser();
}

function buyRestart(){
    if(document.getElementById("money").textContent >= costs.restart){
        document.getElementById("money").textContent = parseInt(document.getElementById("money").textContent) - costs.restart;
        document.getElementById("restartCount").textContent = parseInt(document.getElementById("restartCount").textContent) + 1;
        console.log(document.getElementById("restartCount").textContent);
    }
    updateUser();
}

function bug(){
    document.getElementById("bug").style.visibility = "visible";
    document.getElementById("shader").style.visibility = "visible";
}

async function sendBug(){
    const email = localStorage.getItem("userLogedEmail");
    const username = localStorage.getItem("userLoged");
    const host = window.location.hostname === "127.0.0.1" ? 
        "http://127.0.0.1:8080" : 
        "https://flask-cloudrun-943017112681.europe-west10.run.app";
    if(email !== null && email !== undefined && email !== "" && username !== null && username !== undefined && username !== ""){
        const bugText = document.getElementById("bugText").value;
        if(bugText.length > 0){
            const mail = await fetch(`${host}/send-feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, username, subject: document.getElementById("bugSelect").value, text: bugText }),
            });
        }else{
            alert("Please write a bug description.");
        }
    }
}