let inGame = true;
let action = 0;
let language = "english";
const hintLetter = Math.floor(Math.random() * 5);

const stats = {
    secret:WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase(),
    grid: Array(6)
        .fill()
        .map(() => Array(5).fill("")),
    currentRow: 0,
    currentCol: 0,
};

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

        action = 0;
    }
}

function start(){
    const game = document.getElementById("wrap");
    drawGrid(game);

    keyboard();
    console.log(stats.secret)
}

start();

function updateGrid(){
    
    for(let i = 0; i < stats.grid.length; i++){
        for(let j = 0; j < stats.grid[i].length; j++){
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = stats.grid[i][j].toUpperCase();
        }
    }
}

function virtualKeyboardClick(e){
    addLetter(e);
    updateGrid();
}

function deleteVirtual(){
    removeAnnounce();
    removeLetter();
    updateGrid();
}

function enter(){
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
    removeAnnounce();
    removeAllLetters();
    updateGrid();
}

function hint(){
    for(let i = stats.currentRow; i <= 5; i++){
        const box = document.getElementById(`box${i}${hintLetter}`);
        box.textContent = stats.secret[hintLetter];
        box.style.color = "#538d4e";
    }
}

function hideHint(){
    for(let i = stats.currentRow; i <= 5; i++){
        const box = document.getElementById(`box${i}${hintLetter}`);
        box.textContent = "";
        box.style.color = "white";
    }
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
        const virtualKeyboard = document.getElementById(letter.toLowerCase());
        setTimeout(() =>{
            audio.play();
        }, 0);
        /* audio.play(); */
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
            inGame = false;
        }else if(gameOver){
            youLose(`Better luck next time! the word was: ${stats.secret}.`);
            inGame = false;
        }

    }, 3 * animation_duration);
}

function isLetter(key){
    return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(letter){
    console.log(stats.currentRow,stats.currentCol);
    if(stats.currentCol === 5) return;

    console.log(stats.currentRow,stats.currentCol);
    stats.grid[stats.currentRow][stats.currentCol] = letter;
    document.getElementById(`box${stats.currentRow}${stats.currentCol}`).style.borderColor = "#905f70";
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
    annoncement.textContent = text;
}

function youWin(){
    setTimeout(() =>{
        for(let i = 0; i <= 5; i++){
            for(let j = 0; j <= 6; j++){
                if(i === 0 && j === 0){
                    endGame("Y", i, j, "correct");
    
                }
    
                if(i === 1 && j === 0){
                    endGame("O", i, j, "correct");
                }
    
                if(i === 2 && j === 0){
                    endGame("U", i, j, "correct");
                }
    
                if(i === 3 && j === 0){
                    endGame("", i, j, "empty");
                }
    
                if(i === 4 && j === 0){
                    endGame("", i, j, "empty");
                }

                if(i === 0 && j === 1){
                    endGame("", i, j, "empty");
                }

                if(i === 1 && j === 1){
                    endGame("W", i, j, "correct");
                }

                if(i === 2 && j === 1){
                    endGame("O", i, j, "correct");
                }

                if(i === 3 && j === 1){
                    endGame("N", i, j, "correct");
                }

                if(i === 4 && j === 1){
                    endGame("!", i, j, "correct");
                }

                
                if(i === 4 && j === 2){
                    endGame("", i, j, "empty");
                }

                if(i === 0 && j === 2){
                    endGame("", i, j, "empty");
                }

                if(i === 1 && j === 2){
                    endGame("", i, j, "empty");
                }

                if(i === 2 && j === 2){
                    endGame("", i, j, "empty");
                }

                if(i === 3 && j === 2){
                    endGame("", i, j, "empty");
                }

                if(i === 4 && j === 2){
                    endGame("", i, j, "empty");
                }

                if(i === 0 && j === 3){
                    endGame("P", i, j, "correct");
                }

                if(i === 1 && j === 3){
                    endGame("L", i, j, "correct");
                }

                if(i === 2 && j === 3){
                    endGame("A", i, j, "correct");
                }

                if(i === 3 && j === 3){
                    endGame("Y", i, j, "correct");
                }

                if(i === 4 && j === 3){
                    endGame("", i, j, "empty");
                }


                if(i === 0 && j === 4){
                    endGame("A", i, j, "correct");
                }

                if(i === 1 && j === 4){
                    endGame("G", i, j, "correct");
                }

                if(i === 2 && j === 4){
                    endGame("A", i, j, "correct");
                }

                if(i === 3 && j === 4){
                    endGame("I", i, j, "correct");
                }

                if(i === 4 && j === 4){
                    endGame("N", i, j, "correct");
                }

                if(i === 0 && j === 5){
                    endGame("", i, j, "empty");
                }

                if(i === 1 && j === 5){
                    endGame("", i, j, "opt");
                }

                if(i === 2 && j === 5){
                    endGame("", i, j, "empty");
                }

                if(i === 3 && j === 5){
                    endGame("", i, j, "opt2");
                }

                if(i === 4 && j === 5){
                    endGame("", i, j, "empty");
                }
            }
        }              
    }, 700);

}

function endGame(letter, boxI, boxJ, value){
    const box = document.getElementById(`box${boxJ}${boxI}`);
    const animation_duration = 500;
    
    setTimeout(() =>{    
        box.classList.remove("correct");
        box.classList.remove("wrong");
        box.classList.remove("empty");
        box.style.borderColor = "#3a3a3c";

        if(value === "opt"){
            box.style.backgroundColor = "#fa7e44";
            box.style.borderColor = "#fa7e44";
        }else if(value === "opt2"){
            box.style.backgroundColor = "#fa7e44";
            box.style.borderColor = "#fa7e44";
        }else if(value === "correct"){
            box.classList.add("correct");
            box.style.borderColor = "#538d4e";
        }else if(value === "wrong"){
            box.classList.add("wrong");
            box.style.borderColor = "#b59f3b";
        }else{
            box.classList.add("empty");
            box.style.borderColor = "#5c5656";
        }
        box.textContent = letter;
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
}

function unmute(){
    const unmute = document.getElementById("mute");
    unmute.style.visibility = "hidden";
}

function createNewWordle(){
    inGame = false;
    document.getElementById("shader").style.visibility = "visible";
    document.getElementById("newWordle").style.visibility = "visible";
}

function cancelNewWordle(){
    document.getElementById("shader").style.visibility = "hidden";
    document.getElementById("newWordle").style.visibility = "hidden";
    inGame = true;
}

function check(){
    const notAWord = document.getElementById("noWord");
    notAWord.style.visibility = "hidden";
    const newWord = document.getElementById("word");
    const word = newWord.value.toLowerCase();
    if(word.length === 5){
        if(WORDS.includes(word)){
            restart(word);
            cancelNewWordle();
        }else{
            notAWord.style.visibility = "visible";
        }
    }
}

function restart(word){
    for(let i = 0; i <= stats.currentRow; i++){
        for(let j = 0; j < 5; j++){
            const box = document.getElementById(`box${i}${j}`);
            if (box.textContent === "")
                break;
            const letter = box.textContent;
            const virtualKeyboard = document.getElementById(letter.toLowerCase());
            virtualKeyboard.classList.remove("wrong");
            virtualKeyboard.classList.remove("correct");
            virtualKeyboard.classList.remove("empty");
            virtualKeyboard.classList.remove("animated");

            box.classList.remove("wrong");
            box.classList.remove("correct");
            box.classList.remove("empty");
            box.classList.remove("animated");
            box.style.borderColor = "#3a3a3c";
            stats.grid[i][j] = "";
            box.textContent = "";
        }
    }    
    
    stats.currentCol = 0;
    stats.currentRow = 0;
    
    stats.secret = word.toUpperCase();
    console.log(stats.secret);  
}

function changePortuguese(){
    language = "portuguese";
    restart(restart(PALAVRAS[Math.floor(Math.random() * PALAVRAS.length)].toUpperCase()));
}