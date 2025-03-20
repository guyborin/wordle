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
let usedLetters = [];
let hammerN = 0;
let changeTime = false
let mode = "easy";
let roundMode = "easy";
let rightGuesses = [];
let guesses = 0;
let hintN = false;

let timer = {
    seconds: 0,
    decoseconds: 0,
    minutes: 0,
    decominutes: 0,
}

const stats = {
    secret:WORDS[Math.floor(Math.random() * WORDS.length + 1)].toUpperCase(),
    grid: Array(6)
        .fill()
        .map(() => Array(5).fill("")),
    currentRow: 0,
    currentCol: 0,
};

const game = document.getElementById("wrap");
drawGrid(game);

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
    leftBarApperDesaper.classList.remove("init")
    if(action === 0){
        leftBarApperDesaper.classList.remove("out");
        leftBarApperDesaper.classList.add("in");
        action = 1;
    }else if(action === 1){
        leftBarApperDesaper.classList.remove("in");
        leftBarApperDesaper.classList.add("out");
        document.getElementById("language").style.visibility = "hidden";

        action = 0;
    }
}

function start(){
    roundMode = mode
    document.getElementById("restartBack").style.visibility = "visible";
    document.getElementById("restart").style.visibility = "visible";
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
    if(hintN){
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
        if(!usedLetters.includes(e)){
            usedLetters.push(e);
        }
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
    document.getElementById("arrow").style.visibility = "visible";
    document.getElementById("annoncement").style.visibility = "hidden";
}

function hint(){
    if(inGame === false) return;
    let keys = document.getElementsByClassName("keys");
    for(let i = 0; i < keys.length; i++){
        keys[i].style.fontWeight = "bold";
    }
    hintN = true;
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
    document.getElementById("arrow").style.visibility = "hidden";
}

function keyboard(){
    document.body.onkeydown = (e) => {
        if(inGame){
            const key = e.key;
            if(key === "Enter"){
                if(stats.currentCol === 5){
                    const word = getCurrentWord();
                    if(roundMode === "mid" && rightGuesses.length > 0 && isWordValid(word)){
                        for(let i = 0; i <= rightGuesses.length/2; i++){
                            if(word[rightGuesses[i * 2]] === stats.secret[rightGuesses[i * 2]]){
                                guesses++;
                            }
                        }

                        if(guesses === rightGuesses.length/2){
                            revealWord(word);
                            stats.currentRow++;
                            stats.currentCol = 0;
                            guesses = 0;
                        }else{
                            announce("In this dificulty you need to write all right words in place");
                            guesses = 0;
                        }

                    }else if(roundMode === "mid" && rightGuesses.length === 0 && isWordValid(word)){
                        revealWord(word);
                        stats.currentRow++;
                        stats.currentCol = 0;
                    }else if(roundMode === "easy" && isWordValid(word)){
                        revealWord(word);
                        stats.currentRow++;
                        stats.currentCol = 0;
                    }else{
                        announce("The list doesn't contain this word");
                    }
                }
            }

            if(key === "Backspace"){
                removeAnnounce();
                removeLetter();
            }

            if(isLetter(key)){
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
if(language === "portuguese"){
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
        if(!usedLetters.includes(letter)){
            usedLetters.push(letter);
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
                rightGuesses.push(letter, i);
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
            inGame = false;
        }else if(gameOver){
            youLose();
            inGame = false;
        }

    }, 3 * animation_duration);
}



function isLetter(key){
    return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(letter){
    if(stats.currentCol === 5 || !inGame) return;

    console.log(stats.currentRow,stats.currentCol);
    stats.grid[stats.currentRow][stats.currentCol] = letter;
    document.getElementById(`box${stats.currentRow}${stats.currentCol}`).style.borderColor = "#905f70";
    document.getElementById(`box${stats.currentRow}${stats.currentCol}`).style.color = "white";
    stats.currentCol++;
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
}

function announce(text){
    let annoncement = document.getElementById("annoncement");
    if(language === "portuguese"){
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

function youLose(){
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
        for(let i = 0; i < usedLetters.length; i++){
            const virtualKeyboard = document.getElementById(usedLetters[i].toLowerCase());
            virtualKeyboard.classList.remove("wrong");
            virtualKeyboard.classList.remove("correct");
            virtualKeyboard.classList.remove("empty");
            virtualKeyboard.classList.remove("animated");
        }

        box.classList.remove("correct");
        box.classList.remove("wrong");
        box.classList.remove("empty");
        box.style.borderColor = "#3a3a3c";

        if(value === "gift1"){
            let gift = document.getElementById("gift1");
            box.style.backgroundColor = "#fa7e44";
            box.style.borderColor = "#fa7e44";
            box.appendChild(gift);
            gift.classList.remove("hidden")
            gift.style.visibility = "visible";
        }else if(value === "gift2"){
            let gift = document.getElementById("gift2");
            box.style.backgroundColor = "#fa7e44";
            box.style.borderColor = "#fa7e44";
            box.appendChild(gift);
            gift.classList.remove("hidden")
            gift.style.visibility = "visible";
        }else if(value === "gift3"){
            let gift = document.getElementById("gift3");
            box.style.backgroundColor = "#fa7e44";
            box.style.borderColor = "#fa7e44";
            box.appendChild(gift);
            gift.classList.remove("hidden")
        }else if(value === "gift4"){
            let gift = document.getElementById("gift4");
            box.style.backgroundColor = "#fa7e44";
            box.style.borderColor = "#fa7e44";
            box.appendChild(gift);
            gift.classList.remove("hidden")
        }else if(value === "gift5"){
            let gift = document.getElementById("gift5");
            box.style.backgroundColor = "#fa7e44";
            box.style.borderColor = "#fa7e44";
            box.appendChild(gift);
            gift.classList.remove("hidden")
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

    box.classList.add("animated");
    box.style.animationDelay = `${(boxI * animation_duration) / 2}ms`;
}


function removeAnnounce(){
    const announcement = document.getElementById("annoncement");
    announcement.textContent = "";
}

function mute(){
    const mute = document.getElementById("mute")
    mute.style.visibility = "visible";
    sound = false;
}

function unmute(){
    const unmute = document.getElementById("mute");
    unmute.style.visibility = "hidden";
    sound = true;
}

function createNewWordle(){
    inGame = false;
    document.getElementById("shader").style.visibility = "visible";
    document.getElementById("newWordle").style.visibility = "visible";
}

function hide(){
    document.getElementById("shader").style.visibility = "hidden";
    document.getElementById("newWordle").style.visibility = "hidden";
    inGame = true;
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

function restart(word){
    removeAnnounce();
    roundMode = mode
    if(language === "portuguese"){
        word = PALAVRAS[Math.floor(Math.random() * PALAVRAS.length)].toUpperCase();
    }

    for(let i = 0; i < usedLetters.length; i++){
        const virtualKeyboard = document.getElementById(usedLetters[i].toLowerCase());
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
        document.getElementById("gift" + i).style.visibility = "hidden";
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
}

function changeLanguages(){
    if(langVisibility === 0){
        document.getElementById("language").style.visibility = "visible";
        langVisibility = 1
    }else if(langVisibility === 1){
        document.getElementById("language").style.visibility = "hidden";
        langVisibility = 0
    }
    
}

function changePortuguese(){
    document.getElementById("portugues").style.backgroundColor = "#538D4E";
    document.getElementById("english").style.backgroundColor = "#474747";
    let c = document.getElementById("ç");
    let blank = document.getElementById("bl");
    
    c.style.visibility = "visible";
    blank.classList.remove("blank");


    if(language === "english"){
        language = "portuguese";
        restart();
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
        restart(WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase());
    }
}

function info1(){
    document.getElementById("bla").style.visibility = "visible";
}

function info1hide(){
    document.getElementById("bla").style.visibility = "hidden";
}

function homePage(){
    window.location.assign("../BrainStorm/BrainStorm.html")
}

function shopChange(){
    let shop = document.getElementById("shop");
    shop.classList.remove("init");
    shop.classList.remove("appear");
    shop.classList.remove("desapear");

    if (actionShop === 1 && rightBar === 1){
        shop.classList.add("desapear");
        actionShop = 0;
        rightBar = 0;
    }else if(rightBar === 2){
        let pass = document.getElementById("pass");
        pass.classList.add("desapear");
        actionPass = 0;
        shop.classList.remove("desapear");
        shop.classList.add("appear");
        actionShop = 1;
        rightBar = 1;
    }else if(rightBar === 3){
        let podium = document.getElementById("leaderboard");
        podium.classList.add("desapear");
        actionPodium = 0;
        shop.classList.add("appear");
        actionShop = 1;
        rightBar = 1;
    }else{
        shop.classList.add("appear");
        actionShop = 1;
        rightBar = 1;
    }
}

function passChange(){
    let pass = document.getElementById("pass");
    pass.classList.remove("init");
    pass.classList.remove("appear");
    pass.classList.remove("desapear");

    if (actionPass === 1 && rightBar === 2){
        pass.classList.add("desapear");
        actionPass = 0;
        rightBar = 0;
    }else if(rightBar === 1){
        let shop = document.getElementById("shop");
        shop.classList.add("desapear");
        actionShop = 0;
        pass.classList.remove("desapear");
        pass.classList.add("appear");
        actionPass = 1;
        rightBar = 2;
    }else if(rightBar === 3){
        let podium = document.getElementById("leaderboard");
        podium.classList.add("desapear");
        actionPodium = 0;
        pass.classList.add("appear");
        actionPass = 1;
        rightBar = 2;
    }else{
        pass.classList.add("appear");
        actionPass = 1;
        rightBar = 2;
    }
    
}

function podiumChange(){
    let podium = document.getElementById("leaderboard");
    podium.classList.remove("init");
    podium.classList.remove("appear");
    podium.classList.remove("desapear");

    if (actionPodium === 1 && rightBar === 3){
        podium.classList.add("desapear");
        actionPodium = 0;
        rightBar = 0;
    }else if(rightBar === 2){
        let pass = document.getElementById("pass");
        pass.classList.add("desapear");
        actionPass = 0;
        podium.classList.remove("desapear");
        podium.classList.add("appear");
        actionPodium = 1;
        rightBar = 3;
    }else if(rightBar === 1){
        let shop = document.getElementById("shop");
        shop.classList.add("desapear");
        actionShop = 0;
        podium.classList.add("appear");
        actionPodium = 1;
        rightBar = 3;
    }else{
        podium.classList.add("appear");
        actionPodium = 1;
        rightBar = 3;
    }
    
}

function midBattery(){
    document.getElementById("midBattery").style.visibility = "visible";
    mode = "mid";
}

function highBattery(){
    document.getElementById("highBattery").style.visibility = "visible";
    mode = "hard";
}

function lowBattery(){
    document.getElementById("highBattery").style.visibility = "hidden";
    document.getElementById("midBattery").style.visibility = "hidden";
    mode = "easy";
}
