// Function that binds unobtrusive event handlers to HTML elements
function initEventBindings() {
    // Bind unobtrusive event handlers
    $("#score-link").click(function(){scoreLinkEvent();});
    $("#home-link").click(function(){homeLinkEvent();});
    $("#back-button").click(function(){homeLinkEvent();});
    $("#clear-button").click(function(){scoreClearEvent();});
}

// Function that handles loading the high score value from local storage
function initScoreDisplay() {
    // Obtain the highScore from local storage, use 0 if it doesn't exist
    var rawScore = window.localStorage.getItem("highScore");
    var highScore = rawScore ? rawScore : 0;
    $("#score-heading").text("High Score: " + highScore);
}

// Function that handles clearing the score from local storage
function scoreClearEvent() {
    window.localStorage.removeItem("highScore");
    initScoreDisplay(); // Refresh the displayed score
}

// Function that handles the event for the score naviation link
function scoreLinkEvent() {
    // Set the score link naviation item to active and home link to inactive
    $("#score-link").addClass("active");
    $("#home-link").removeClass("active");
    // Hide the welcome section and show the score section
    $("#welcome-section").addClass("element-hidden")
    $("#score-section").removeClass("element-hidden");
    initScoreDisplay(); // Refresh the displayed score
}

// Function that handles the event for the home navigation link
function homeLinkEvent() {
    // Set the home link naviation item to active and core link to inactive
    $("#home-link").addClass("active");
    $("#score-link").removeClass("active");
    // Hide the score section and show the welcome section
    $("#score-section").addClass("element-hidden")
    $("#welcome-section").removeClass("element-hidden");
}

// Bind unobtrusive event handlers to HTML pages as soon as the page loads
window.onload = initEventBindings;
