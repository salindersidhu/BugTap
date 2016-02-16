// Enable whole-script strict mode syntax
'use strict';

// Sprite stores attributes for a sprite sheet such as Image
function Sprite() {
    this.image = null;
    this.numFrames = null;
    this.frameWidth = null;
}

// ResourceManager handles creation and storage of game resources
function ResourceManager() {
    // Module constants and variables
    const _this = this;
    _this.imageDict = {};
    _this.spriteDict = {};
    // Function that creates and returns a new Image
    function makeImage(source, width, height) {
        var image = new Image();
        image.src = source;
        image.width = width;
        image.height = height;
        return image;
    }
    // Function that creates and stores a new Image with a specific ID
    function addImage(id, source, width, height) {
        _this.imageDict[id] = makeImage(source, width, height);
    }
    // Function that creates and stores a new Sprite with a specific ID
    function addSprite(id, source, width, height, numFrames) {
        var sprite = new Sprite();
        sprite.image = makeImage(source, width, height);
        sprite.numFrames = numFrames;
        sprite.frameWidth = width / numFrames;
        _this.spriteDict[id] = sprite;
    }
    // Function that returns the Image corresponding to an ID
    function getImage(id) {
        return _this.imageDict[id];
    }
    // Function that returns the Sprite corresponding to an ID
    function getSprite(id) {
        return _this.spriteDict[id];
    }
    // Functions returned by the module
    return {
        addImage : addImage,
        getImage : getImage,
        addSprite : addSprite,
        getSprite : getSprite
    }
}

// GameSystem handles the core Game event management and rendering tasks
function GameSystem(FPS, resMan, canvasID, canvasWidth, canvasHeight) {
    // Module constants and variables
    const _this = this;
    _this.FPS = FPS;
    _this.resMan = resMan;
    _this.canvasID = canvasID;
    _this.canvasWidth = canvasWidth;
    _this.canvasHeight = canvasHeight;
    _this.isGameOver = false;
    _this.isGamePaused = false;
    _this.isGameStarted = false;
    _this.ctx = null;
    // Function that initializes the GameSystem
    function init() {
        // Obtain the canvas and canvas context from the DOM
        var canvas = $(_this.canvasID).get(0);
        _this.ctx = canvas.getContext('2d');
        //
        canvas.addEventListener('mousedown', function() {
            mouseClickEvents(event, canvas);
        }, false);
        // Execute the GameSystem event loop indefinitely
        setInterval(gameSystemLoop, 100 / _this.FPS);
    }
    // Function that continuously updates and renders the GameSystem
    function gameSystemLoop() {
        if (_this.isGameStarted && !_this.isGamePaused && !_this.isGameOver) {
            // Update the GameSystem
            update();
            // Render the GameSystem
            render();
        }
    }
    // Function that handles all of the GameSystem's update events
    function update() {
    }
    // Function that handles all of the GameSystem's drawing
    function render() {
    }
    // Function that handles all the mouse click events for the GameSystem
    function mouseClickEvents(event, canvas) {
        // Process mouse click events if Game is active and not paused
        if (_this.isGameStarted && !_this.isGamePaused && !_this.isGameOver) {
            // Obtain the mouse coordinates relative to the canvas
            var mouseX = event.pageX - canvas.offsetLeft;
            var mouseY = event.pageY - canvas.offsetTop;
        }
    }
    // Function that toggles the GameSystem's state between paused or running
    function togglePauseResume() {
        _this.isGamePaused = !_this.isGamePaused;
    }
    // Function that returns if the GameSystem is paused
    function getIsPaused() {
        return _this.isGamePaused;
    }
    // Function that returns if the GameSystem has started
    function getIsStarted() {
        return _this.isGameStarted;
    }
    // Function that officially starts the GameSystem
    function start() {
        _this.isGameStarted = true;
    }
    // Functions returned by the module
    return {
        init : init,
        start : start,
        getIsPaused : getIsPaused,
        getIsStarted : getIsStarted,
        togglePauseResume : togglePauseResume
    }
}

// Setup handles the config of the game page and behaviour of DOM elements
function Setup() {
    // Module constants and variables
    const _this = this;
    _this.CANVAS_WIDTH = 387;
    _this.CANVAS_HEIGHT = 600;
    _this.WIN_LS_HIGHSCORE = 'taptapbug_highscore';
    // DOM element IDs
    _this.ID_SCORE_LINK = '#score-link';
    _this.ID_HOME_LINK = '#home-link';
    _this.ID_BUTTON_CLEAR = '#clear-button';
    _this.ID_BUTTON_BACK = '#back-button';
    _this.ID_BUTTON_PLAY = '#play-button';
    _this.ID_BUTTON_PR = '#pause-resume-button';
    _this.ID_HEADING_SCORE = '#score-heading';
    _this.ID_SCORE_SECTION = '#score-section';
    _this.ID_HOME_SECTION = '#home-section';
    _this.ID_GAME_SECTION = '#game-section';
    _this.ID_GAME_CANVAS = '#game-canvas';
    _this.ID_SCORE_TEXT = '#score-text';
    _this.ID_TIME_TEXT = '#time-text';
    _this.ID_LOST_MSG = '#game-lose-message';
    _this.ID_WON_MSG = '#game-won-message';
    // Resource element IDs
    _this.IMG_BUTTON_PLAY = 'assets/button_play.png';
    _this.IMG_BUTTON_PAUSE = 'assets/button_pause.png';
    _this.IMG_BG = 'assets/background_table.png';
    _this.SPR_FOOD = 'assets/food_sprite.png';
    _this.SPR_R_BUG = 'assets/red_bug_sprite.png';
    _this.SPR_O_BUG = 'assets/orange_bug_sprite.png';
    _this.SPR_G_BUG = 'assets/grey_bug_sprite.png';
    // Instance variables
    _this.resMan = null;
    _this.gameSys = null;
    _this.taptapbug = null;
    // Function that initializes tasks to setup the game page and DOM elements
    function init() {
        // Create new ResourceManager and GameSystem objects
        _this.resMan = new ResourceManager();
        _this.gameSys = new GameSystem(_this.FPS, _this.resMan,
            _this.ID_GAME_CANVAS, _this.CANVAS_WIDTH, _this.CANVAS_HEIGHT);
        // Initialize game resources
        initResources();
        // Bind unobtrusive event handlers
        bindEventHandlers();
        // Initialize GameSystem
        _this.gameSys.init();
    }
    // Function that binds event functions to specific links and buttons
    function bindEventHandlers() {
        $(_this.ID_SCORE_LINK).click(function() {
            navScoreEvent();
        });
        $(_this.ID_HOME_LINK).click(function() {
            navHomeEvent();
        })
        $(_this.ID_BUTTON_BACK).click(function() {
            navHomeEvent();
        });
        $(_this.ID_BUTTON_CLEAR).click(function() {
            clearScoreButtonEvent();
        });
        $(_this.ID_BUTTON_PLAY).click(function() {
            playGameButtonEvent();
        });
        $(_this.ID_BUTTON_PR).click(function() {
            pauseResumeButtonEvent();
        });
    }
    // Function that adds all of the game resources using the ResourceManager
    function initResources() {
        _this.resMan.addImage('IMG_BG', _this.IMG_BG, 387, 600);
        _this.resMan.addSprite('SPR_FOOD', _this.SPR_FOOD, 896, 56, 16);
        _this.resMan.addSprite('SPR_R_BUG', _this.SPR_R_BUG, 90, 50, 2);
        _this.resMan.addSprite('SPR_O_BUG', _this.SPR_O_BUG, 90, 50, 2);
        _this.resMan.addSprite('SPR_G_BUG', _this.SPR_G_BUG, 90, 50, 2);
    }
    // Function that updates the score text
    function updateScore(score) {
        $(_this.ID_SCORE_TEXT).text('Score: ' + score);
    }
    // Function that updates the time text
    function updateTime(time) {
        $(_this.ID_TIME_TEXT).text('Time: ' + time);
    }
    // Function that saves the highscore to local storage
    function saveScore(score) {
        if (score > getScore()) {
            window.localStorage.setItem(_this.WIN_LS_HIGHSCORE, score);
        }
    }
    // Function that handles the events for the score navigation link
    function navScoreEvent() {
        // Call events if game is not running
        if (!_this.gameSys.getIsStarted()) {
            // Set score link item to active and home link item to inactive
            $(_this.ID_SCORE_LINK).addClass('active');
            $(_this.ID_HOME_LINK).removeClass('active');
            // Hide the home page section and show the score page section
            $(_this.ID_HOME_SECTION).hide();
            $(_this.ID_SCORE_SECTION).show();
            // Refresh displayed score
            refreshScore();
        }
    }
    // Function that handles the events for the home navigation link
    function navHomeEvent() {
        // Call events if game is not running
        if (!_this.gameSys.getIsStarted()) {
            // Set home link item to active and score link item to inactive
            $(_this.ID_HOME_LINK).addClass('active');
            $(_this.ID_SCORE_LINK).removeClass('active');
            // Hide the score page section and show the home page section
            $(_this.ID_SCORE_SECTION).hide();
            $(_this.ID_HOME_SECTION).show();
        }
    }
    // Function that handles the events for the play game button
    function playGameButtonEvent() {
        // Hide the home page section and show the game page section
        $(_this.ID_HOME_SECTION).hide();
        $(_this.ID_GAME_SECTION).show();
        // Start the GameSystem
        _this.gameSys.start();
    }
    // Function that handles the events for the pause / resume button
    function pauseResumeButtonEvent() {
        // Pause the game if the game is running and resume if game is paused
        _this.gameSys.togglePauseResume();
        // Change the image of the button depending on the state of the game
        if (_this.gameSys.getIsPaused()) {
            $(_this.ID_BUTTON_PR + ' img').attr('src', _this.IMG_BUTTON_PLAY);
        } else {
            $(_this.ID_BUTTON_PR + ' img').attr('src', _this.IMG_BUTTON_PAUSE);
        }
    }
    // Function that handles the events for the clear score button
    function clearScoreButtonEvent() {
        window.localStorage.removeItem(_this.WIN_LS_HIGHSCORE);
        // Refresh displayed score
        refreshScore();
    }
    // Function that updates the score heading with score from local storage
    function refreshScore() {
        // Obtain the highScore from local storage and use 0 as default value
        $(_this.ID_HEADING_SCORE).text('High Score: ' + getScore());
    }
    // Function that return the highscore entry from local storage
    function getScore() {
        // Obtain the score, use 0 if score does not exist
        var rawScore = window.localStorage.getItem(_this.WIN_LS_HIGHSCORE);
        return rawScore ? rawScore : 0;
    }
    // Functions returned by the module
    return {
        init : init
    }
}

// Setup the game page and DOM element events
window.onload = new Setup().init;
