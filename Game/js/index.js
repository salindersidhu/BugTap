function TapTapBug(FPS, timeTextID) {
    var _this = this;               // Store a reference to the module
    this.timer = 61;                // Game's timer
    this.isGamePaused = true;       // If game is paused
    this.ctx = null;                // Game's drawing canvas
    this.FPS = FPS                  // Frames per second
    this.timeTextID = timeTextID;   // The ID of the time text element
    init();                         // Initialize game

    // Function that handles initialization of game
    function init() {
        // Obtain the canvas from the DOM and configure the context
        canvas = $("#game-canvas").get(0);
        _this.ctx = canvas.getContext("2d");
        // Execute the game loop indefinitely
        setInterval(gameLoop, 1000 / _this.FPS);
    }
    // Function that updates the game and renders the game content
    function gameLoop() {
        if (!_this.isGamePaused) {
            // Update game
            update();
        }
    }
    function update() {
        // Update countdown timer and corresponding time text element
        _this.timer -= 1 / _this.FPS;
        $(_this.timeTextID).text("Time: " + Math.floor(_this.timer));
    }
    // Function that sets the value of the instance varaible isGamePaused
    function setPaused(isGamePaused) {
        _this.isGamePaused = isGamePaused;
    }
    // Functions that are returned
    return {
        setPaused : setPaused
    }
}

var setup = (function() {
    var FPS = 60;                                       // Frames per second
    var CANVAS_WIDTH = 400;                             // Canvas width
    var CANVAS_HEIGHT = 600;                            // Canvas height
    var PLAY_BUTTON_IMAGE = "assets/button_play.png";   // Play button image
    var PAUSE_BUTTON_IMAGE = "assets/button_pause.png"; // Pause button image
    var isGameStarted = false;                          // If game has started
    var isGamePaused = true;                            // If game is paused
    var game = new TapTapBug(FPS, "#time-text");        // New game instance

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
        game.setPaused(isGamePaused);
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
