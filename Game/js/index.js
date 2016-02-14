// A module that handles creation and storage of resources such as Images
function ResourceManager() {
    // Module constants and variables
    var _this = this;       // Reference to this module
    this.imageDict = {};    // Dictionary of Images (value) with a string (key)

    // Functon that creates and stores a new Image
    function addImage(id, imageSource, width, height) {
        var image = new Image();
        image.src = imageSource;
        image.width = width;
        image.height = height;
        _this.imageDict[id] = image;
    }
    // Function that returns the Image corresponding to an ID
    function getImage(id) {
        return _this.imageDict[id];
    }
    // Functions returned by the module
    return {
        addImage : addImage,
        getImage : getImage
    }
}

// A singleton module that handles the setup of Game and HTML elements
var setup = (function() {
    // Singleton module constants and variables
    var FPS = 60;
    var CANVAS_WIDTH = 400;
    var CANVAS_HEIGHT = 600;
    var IMG_BUTTON_PLAY = "assets/button_play.png";
    var IMG_BUTTON_PAUSE = "assets/button_pause.png";
    var ID_SCORE_LINK = "#score-link";
    var ID_HOME_LINK = "#home-link";
    var ID_BUTTON_CLEAR = "#clear-button";
    var ID_BUTTON_BACK = "#back-button";
    var ID_BUTTON_PLAY = "#play-button";
    var ID_BUTTON_PR = "#pause-resume-button";
    var ID_HEADING_SCORE = "#score-heading";
    var ID_SCORE_SECTION = "#score-section";
    var ID_HOME_SECTION = "#home-section";
    var ID_GAME_SECTION = "#game-section";
    var isGameStarted = false;
    var isGamePaused = true;
    //var game = new TapTapBug(FPS, "#time-text");

    var test = new ResourceManager();
    test.getImage("FF");

    // Function that sets up the HTML element events and game canvas
    this.init = function() {
        // Bind unobtrusive event handlers
        $(ID_SCORE_LINK).click(function(){scoreLinkEvent();});
        $(ID_HOME_LINK).click(function(){homeLinkEvent();});
        $(ID_BUTTON_BACK).click(function(){homeLinkEvent();});
        $(ID_BUTTON_CLEAR).click(function(){scoreClearEvent();});
        $(ID_BUTTON_PLAY).click(function(){playLinkEvent();});
        $(ID_BUTTON_PR).click(function(){pauseResumeToggleEvent();});
    }
    // Function that handles the pause and resume button events
    this.pauseResumeToggleEvent = function() {
        // Pause the game is game is running and resume the game if paused
        isGamePaused = !isGamePaused;
        //game.setPaused(isGamePaused);
        // Change the image of the button depending on the state of the game
        if (isGamePaused) {
            $(ID_BUTTON_PR + " img").attr("src", IMG_BUTTON_PLAY);
        } else {
            $(ID_BUTTON_PR + " img").attr("src", IMG_BUTTON_PAUSE);
        }
    }
    // Function that handles loading the high score value from local storage
    this.refreshScoreEvent = function() {
        // Obtain the highScore from local storage, use 0 if it doesn't exist
        var rawScore = window.localStorage.getItem("highScore");
        var highScore = rawScore ? rawScore : 0;
        $(ID_HEADING_SCORE).text("High Score: " + highScore);
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
            $(ID_SCORE_LINK).addClass("active");
            $(ID_HOME_LINK).removeClass("active");
            // Hide the welcome section and show the score section
            $(ID_HOME_SECTION).hide();
            $(ID_SCORE_SECTION).show();
            refreshScoreEvent(); // Refresh the displayed score
        }
    }
    // Function that handles the event for the home navigation link
    this.homeLinkEvent = function() {
        // If game is not running
        if (!isGameStarted) {
            // Set home link to active and score link to inactive
            $(ID_HOME_LINK).addClass("active");
            $(ID_SCORE_LINK).removeClass("active");
            // Hide the score section and show the welcome section
            $(ID_SCORE_SECTION).hide();
            $(ID_HOME_SECTION).show();
        }
    }
    // Function that handles the event for the play game button
    this.playLinkEvent = function() {
        // Hide the welcome section and show the game section
        $(ID_HOME_SECTION).hide();
        $(ID_GAME_SECTION).show();
        // Start the page and unpause it
        isGameStarted = true;
        pauseResumeToggleEvent();
    }
    // Functions returned by the module
    return {
        init : this.init
    }
})();

// Setup the game and events
window.onload = setup.init;
