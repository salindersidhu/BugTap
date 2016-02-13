var setup = (function() {
    // Game variables
    var FPS = 60;               // Frames per second (Default: 60)
    var CANVAS_WIDTH = 400;     // Canvas width (Default: 400)
    var CANVAS_HEIGHT = 600;    // Canvas height (Default: 600)
    var isGameRunning = false;  // If game is running (Default: false)

    // Function that sets up the HTML element events and game canvas
    this.init = function() {
        // Bind unobtrusive event handlers
        $("#score-link").click(function(){scoreLinkEvent();});
        $("#home-link").click(function(){homeLinkEvent();});
        $("#back-button").click(function(){homeLinkEvent();});
        $("#clear-button").click(function(){scoreClearEvent();});
        $("#play-button").click(function(){playLinkEvent();});
    }
    // Function that handles loading the high score value from local storage
    this.refreshScoreEvent = function() {
        // Obtain the highScore from local storage, use 0 if it doesn't exist
        var rawScore = window.localStorage.getItem("highScore");
        var highScore = rawScore ? rawScore : 0;
        $("#score-heading").text("High Score: " + highScore);
    }
    // Function that handles clearing the score from local storage
    this.scoreClearEvent = function() {
        window.localStorage.removeItem("highScore");
        refreshScoreEvent(); // Refresh the displayed score
    }
    // Function that handles the event for the score naviation link
    this.scoreLinkEvent = function() {
        // If game is not running
        if (!isGameRunning) {
            // Set score link item to active and home link to inactive
            $("#score-link").addClass("active");
            $("#home-link").removeClass("active");
            // Hide the welcome section and show the score section
            $("#welcome-section").hide();
            $("#score-section").show();
            refreshScoreEvent(); // Refresh the displayed score
        }
    }
    // Function that handles the event for the home navigation link
    this.homeLinkEvent = function() {
        // If game is not running
        if (!isGameRunning) {
            // Set home link to active and score link to inactive
            $("#home-link").addClass("active");
            $("#score-link").removeClass("active");
            // Hide the score section and show the welcome section
            $("#score-section").hide();
            $("#welcome-section").show();
        }
    }
    // Function that handles the event for the play game button
    this.playLinkEvent = function() {
        // Hide the welcome section and show the game section
        $("#welcome-section").hide();
        $("#game-section").show();
        isGameRunning = true; // Game has now started
    }
    // Functions that are returned
    return {
        init : this.init
    }
})();

// Setup the game and events
window.onload = setup.init;
