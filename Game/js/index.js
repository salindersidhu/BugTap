function TapTapBug(FPS) {
    // Store a reference to the module
    var _this = this;
    // Game's timer (Default: 60)
    this.timer = 60;
    // If game is paused (Default: true)
    this.isGamePaused = true;
    // Obtain the canvas from the DOM and configure the context
    canvas = $("#game-canvas").get(0);
    var ctx = canvas.getContext("2d");
    // Execute the game loop indefinitely
    setInterval(gameLoop, 1000 / FPS);

    // Function that updates the game and renders the game content
    function gameLoop() {
        if (!_this.isGamePaused) {
        }
    }
    // Function that sets the value of the instance varaible isGamePaused
    function setGamePaused(isGamePaused) {
        _this.isGamePaused = isGamePaused;
    }
    // Functions that are returned
    return {
        setGamePaused : setGamePaused
    }
}

var setup = (function() {
    // Frames per second (Default: 60)
    var FPS = 60;
    // Canvas width (Default: 400)
    var CANVAS_WIDTH = 400;
    // Canvas height (Default: 600)
    var CANVAS_HEIGHT = 600;
    // Play button image
    var PLAY_BUTTON_IMAGE = "assets/button_play.png";
    // Pause button image
    var PAUSE_BUTTON_IMAGE = "assets/button_pause.png";
    // If game has started (Default: false)
    var isGameStarted = false;
    // If game is paused (Default: false)
    var isGamePaused = true;
    // Create a new game instance
    var game = new TapTapBug(FPS);

    // Function that sets up the HTML element events and game canvas
    this.init = function() {
        // Bind unobtrusive event handlers
        $("#score-link").click(function(){scoreLinkEvent();});
        $("#home-link").click(function(){homeLinkEvent();});
        $("#back-button").click(function(){homeLinkEvent();});
        $("#clear-button").click(function(){scoreClearEvent();});
        $("#play-button").click(function(){playLinkEvent();});
        $("#pause-resume-button").click(function(){pauseResumeToggleEvent();});
    }
    // Function that handles the pause and resume button
    this.pauseResumeToggleEvent = function() {
        // Pause the game is game is running and resume the game if paused
        isGamePaused = !isGamePaused;
        game.setGamePaused(isGamePaused);
        // Change the image of the button depending on the state of the game
        if (isGamePaused) {
            $("#pause-resume-button img").attr("src", PLAY_BUTTON_IMAGE);
        } else {
            $("#pause-resume-button img").attr("src", PAUSE_BUTTON_IMAGE);
        }
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
        if (!isGameStarted) {
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
        if (!isGameStarted) {
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
        isGameStarted = true; // Game has now started
        pauseResumeToggleEvent(); // Game is now running (unpaused)
    }
    // Functions that are returned
    return {
        init : this.init
    }
})();

// Setup the game and events
window.onload = setup.init;
