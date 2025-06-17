if(localStorage.getItem("userLoged") !== null && localStorage.getItem("userLoged") !== undefined && localStorage.getItem("userLogedPass") !== "null" && localStorage.getItem("userLogedPass") !== undefined){
    getUser(localStorage.getItem("userLoged"), localStorage.getItem("userLogedPass"));
}

function account(){
    document.getElementById("account").style.visibility = "visible";
    if(localStorage.getItem("userLoged") != null || localStorage.getItem("userLoged") != undefined){
        document.getElementById("Log-In").style.visibility = "hidden";
        document.getElementById("Log-In").classList.add("hidden");
        document.getElementById("shader").style.visibility = "visible";
    }else{
    document.getElementById("Log-In").style.visibility = "visible";
    document.getElementById("Log-In").classList.remove("hidden");
    document.getElementById("email-username").focus();
    document.getElementById("shader").style.visibility = "visible";
    }
}

function createProblem(message, type){
    if(type === "login"){
        document.getElementById("informationL").textContent = message;
        document.getElementById("informationL").style.color = "red";
        document.getElementById("informationL").style.visibility = "visible";
        document.getElementById("informationL").style.fontSize = "16px";

        setTimeout(() => {
            document.getElementById("informationL").style.visibility = "hidden";
            document.getElementById("informationL").value = "";
            document.getElementById("informationL").style.color = "";
            document.getElementById("informationL").style.fontSize = "";
        }, 5000);
        return;
    }else{
        document.getElementById("information").textContent = message;
        document.getElementById("information").style.color = "red";
        document.getElementById("information").style.visibility = "visible";
        document.getElementById("information").style.fontSize = "16px";

        setTimeout(() => {
            document.getElementById("information").style.visibility = "hidden";
            document.getElementById("information").value = "";
            document.getElementById("information").style.color = "";
            document.getElementById("information").style.fontSize = "";
        }, 5000);
        return;
    }
}

async function createUser() {
    let email = document.getElementById("email").value.trim();
    let name = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value;

    // Validation
    if (!email || !name || !password) {
        createProblem("Missing email, name or password");
        return;
    }
    if (name.length < 3) {
        createProblem("Name must be at least 3 characters long");
        return;
    }
    if (name.length > 20) {
        createProblem("Name must be at most 20 characters long");
        return;
    }
    if (/[^a-zA-Z0-9\-_]/.test(name)) {
        createProblem("Name must not contain special characters except '-' and '_'");
        return;
    }
    if (name.includes(" ")) {
        createProblem("Name must not contain spaces");
        return;
    }
    if (password.length < 8) {
        createProblem("Password must be at least 8 characters long");
        return;
    }
    if (password.length > 20) {
        createProblem("Password must be at most 20 characters long");
        return;
    }
    if (password.includes(" ")) {
        createProblem("Password must not contain spaces");
        return;
    }
    if (!/\d/.test(password)) {
        createProblem("Password must contain at least one number");
        return;
    }
    if (!/[!@#$%^&*()_\-]/.test(password)) {
        createProblem("Password must contain at least one special character");
        return;
    }

    const host = window.location.hostname === "127.0.0.1" ? 
        "http://127.0.0.1:8080" : 
        "https://flask-cloudrun-943017112681.europe-west10.run.app";

    // Check if user/email exists
    const verify = await fetch(`${host}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
    });
    const result = await verify.json();
    if (result === "User already taken" || result === "Account with this email already exists") {
        createProblem(result);
        return;
    }

    // Send verification email
    sendEmail(email, name, password, host);
    
}

async function sendEmail(email, name, password, host) {
    const mail = await fetch(`${host}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
    });
    
    if (!mail.ok) {
        createProblem("Failed to send verification email. Try again");
        return;
    }
    const code = await mail.json();
    console.log('Verification code sent:', code);

    document.getElementById("Verification-Code").classList.remove("hidden");
    document.getElementById("Sign-Up").classList.add("hidden");
    let seconds = document.getElementById("secondsV");
    let decoseconds = document.getElementById("decosecondsV");
    let minutes = document.getElementById("minutesV");
    let decominutes = document.getElementById("decominutesV");

    // Reset timer display
    seconds.textContent = 9;
    decoseconds.textContent = 5;
    minutes.textContent = 9;
    decominutes.textContent = 0;

    let interval = setInterval(() => {
        let sec = parseInt(seconds.textContent);
        let dec = parseInt(decoseconds.textContent);
        let min = parseInt(minutes.textContent);
        let dmin = parseInt(decominutes.textContent);

        if (dmin !== 0) {
            decominutes.textContent = 0;
            minutes.textContent = 9;
            decoseconds.textContent = 5;
            seconds.textContent = 9;
            return;
        }
        if (sec > 0) {
            seconds.textContent = sec - 1;
        } else if (dec > 0) {
            decoseconds.textContent = dec - 1;
            seconds.textContent = 9;
        } else if (min > 0) {
            minutes.textContent = min - 1;
            decoseconds.textContent = 5;
            seconds.textContent = 9;
        } else {
            console.log("Time's up!");
            clearInterval(interval);
            document.getElementById("Verification-Code").classList.add("hidden");
            document.getElementById("Sign-Up").classList.remove("hidden");
            document.getElementById("email").value = "";
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
        }
    }, 1000);
    let resendBtn = document.getElementById("resend");
    resendBtn.onclick = async () => {
        sendEmail(email, name, password, host);
        clearInterval(interval);
    }

    // Only add the event listener once
    const loginVBtn = document.getElementById("loginVBtn");
    loginVBtn.onclick = async () => {
        const verificationInput = document.getElementById("verificationcode");
        console.log("loginVBtn clicked");
        console.log("Input value:", verificationInput.value, "Expected code:", code.code);
        if (!verificationInput) {
            document.getElementById("informationV").textContent = "Verification input not found";
            document.getElementById("informationV").style.color = "red";
            document.getElementById("informationV").style.visibility = "visible";
            setTimeout(() => {
                document.getElementById("informationV").style.visibility = "hidden";
                document.getElementById("informationV").textContent = "";
            }, 5000);
            return;
        }
        if (verificationInput.value === String(code.code)) {
            console.log("Code matched, sending registration...");
            const response = await fetch(`${host}/user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name, password })
            });
            if (response.ok) {
                getUser(name, password);
                clearInterval(interval);
                document.getElementById("Verification-Code").classList.add("hidden");
                loginVBtn.disabled = true; // Prevent double submit
            } else {
                document.getElementById("informationV").textContent = "Registration failed. Please try again";
                document.getElementById("informationV").style.color = "red";
                document.getElementById("informationV").style.visibility = "visible";
                setTimeout(() => {
                    document.getElementById("informationV").style.visibility = "hidden";
                    document.getElementById("informationV").textContent = "";
                }, 5000);
            }
        } else {
            document.getElementById("informationV").textContent = "Incorrect verification code";
            document.getElementById("informationV").style.color = "red";
            document.getElementById("informationV").style.visibility = "visible";
            setTimeout(() => {
                document.getElementById("informationV").style.visibility = "hidden";
                document.getElementById("informationV").textContent = "";
            }, 5000);
        }
    };
}

async function getUser(userLoged, userLogedPass){
    if(userLoged != "none" && userLogedPass != "none"){
        var emailname = userLoged;
        var password = userLogedPass;
    }else{
        var emailname = document.getElementById("email-username").value;
        var password = document.getElementById("passwordL").value;
    }
    
    const host = window.location.hostname === "127.0.0.1" ? 
        "http://127.0.0.1:8080" : 
        "https://flask-cloudrun-943017112681.europe-west10.run.app";
    const response = await fetch(`${host}/user?emailname=${encodeURIComponent(emailname)}&password=${encodeURIComponent(password)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    console.log("response:", response);

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    console.log('User :', result);
    if(result === "Incorrect password"){
        createProblem(result, "login");
        return;
    }

    if(result === "User or email not found"){
        createProblem(result, "login");
        if(userLoged != "none" && userLogedPass != "none"){
            logOut();
            document.getElementById("Log-In").classList.add("hidden");
            document.getElementById("Log-In").style.visibility = "hidden";
        }
        return;
    }

    if(result === "Missing email, name or passwouserLogedEmailrd"){
        createProblem(result, "login");
        return;
    }
    updateValues(result);
    localStorage.setItem("userLoged", result.name);
    localStorage.setItem("userLogedPass", result.password);
    localStorage.setItem("userLogedEmail", result.email);
    console.log(localStorage.getItem("userLoged"));
}

async function updateUser() {
    const experience_points = 1000;
    const coins = document.getElementById("money").textContent;
    const hint_keyboard_letter = document.getElementById("hintValue").textContent;
    const hint_column_letter = document.getElementById("hammerValue").textContent;
    const hint_chance = document.getElementById("chanceValue").textContent;
    const restart_counter = document.getElementById("restartCount").textContent;
    const total_games_played = document.getElementById("totalGames").textContent.replace("Total Games: ", "");
    const total_wins = document.getElementById("totalWins").textContent.replace("Total Wins: ", "");
    
    const host = window.location.hostname === "127.0.0.1" ? 
        "http://127.0.0.1:8080" : 
        "https://flask-cloudrun-943017112681.europe-west10.run.app";
    const response = await fetch(`${host}/user`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            name: localStorage.getItem("userLoged"),
            experience_points: parseInt(experience_points),
            coins: parseInt(coins),
            hint_keyboard_letter: parseInt(hint_keyboard_letter),
            hint_column_letter: parseInt(hint_column_letter),
            hint_chance: parseInt(hint_chance),
            restart_counter: parseInt(restart_counter),
            total_games_played: parseInt(total_games_played),
            total_games_won: parseInt(total_wins),
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    console.log('User updated:', result);
    document.getElementById("Log-In").classList.add("hidden");
    document.getElementById("Sign-Up").classList.add("hidden");
}



function updateValues(result){
    document.getElementById("money").textContent = result.coins;
    document.getElementById("hammerValue").textContent = result.hint_column_letter;
    document.getElementById("hintValue").textContent = result.hint_keyboard_letter;
    document.getElementById("chanceValue").textContent = result.hint_chance;
    document.getElementById("restartCount").textContent = result.restart_counter;
    document.getElementById("user-account").classList.remove("hidden");
    document.getElementById("Log-In").style.visibility = "hidden";
    document.getElementById("Log-In").classList.add("hidden");
    document.getElementById("profileName").textContent = result.name;
    document.getElementById("passwordL").value = "";
    document.getElementById("email-username").value = "";
    hintValue = result.hint_keyboard_letter;
    hammerValue = result.hint_column_letter;
    chanceValue = result.hint_chance;
    restartCount = result.restart_counter;
    if(result.total_games_won != undefined){
        document.getElementById("totalWins").textContent = `Total Wins: ${result.total_games_won}`;
    }
    if(result.total_games_played != undefined){
        document.getElementById("totalGames").textContent = `Total Games: ${result.total_games_played}`;
    }
}

function signUp(){
    document.getElementById("Sign-Up").classList.remove("hidden");
    document.getElementById("email").focus();
    document.getElementById("Log-In").classList.add("hidden");
    document.getElementById("email-username").value = "";
    document.getElementById("passwordL").value = "";
    document.getElementById("information").textContent = "";
}

function logOut(){
    localStorage.removeItem("userLoged");
    localStorage.removeItem("userLogedPass");
    document.getElementById("Log-In").classList.remove("hidden");
    document.getElementById("Log-In").style.visibility = "visible";
    document.getElementById("Sign-Up").classList.add("hidden");
    document.getElementById("user-account").classList.add("hidden");
    document.getElementById("email-username").value = "";
    document.getElementById("passwordL").value = "";
    document.getElementById("information").textContent = "";
    document.getElementById("informationL").textContent = "";
    document.getElementById("informationL").style.visibility = "hidden";
    document.getElementById("information").style.visibility = "hidden";
    document.getElementById("hintValue").textContent = 0;
    document.getElementById("hammerValue").textContent = 0;
    document.getElementById("chanceValue").textContent = 0;
    document.getElementById("restartCount").textContent = 0;
    document.getElementById("money").textContent = 0;
    hintValue = 0;
    hammerValue = 0;
    chanceValue = 0;
    restartCount = 0;
}