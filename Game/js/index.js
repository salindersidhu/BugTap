// A module that handles creation and storage of resources such as Images
function ResourceManager() {
    // Module constants and variables
    var _this = this;
    this.imageDict = {};
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

// A module that controls and renders static image sprites using Images
function StaticSprite(spriteImage, numFrames, selectedFrame, FPS) {
    // Module constants and variables
    var _this = this;
    this.selectedFrame = selectedFrame;
    this.FPS = FPS;
    this.image = spriteImage;
    this.width = spriteImage.width / numFrames;
    this.height = spriteImage.height;
    this.opacity = 1;
    // Function that returns the opacity of the static sprite
    function getOpacity() {
        return _this.opacity;
    }
    // Function that reduces the opacity of the static sprite
    function reduceOpacitiy(secondsToFade) {
        _this.opacity -= 1 / (_this.FPS * secondsToFade);
        if (_this.opacity < 0) {
            _this.opacity - 0;
        }
    }
    // Function that handles drawing the static sprite on the canvas
    function render(ctx, x, y) {
        ctx.save();
        // Configure the canvas opacity
        ctx.globalAlpha = _this.opacity;
        // Draw the static sprite
        ctx.drawImage(
            _this.image,
            _this.width * _this.selectedFrame,
            0,
            _this.width,
            _this.height,
            x,
            y,
            _this.width,
            _this.height);
        ctx.restore();
    }
    // Functions returned by the module
    return {
        render : render,
        getOpacity : getOpacity,
        reduceOpacitiy : reduceOpacitiy
    }
}

// A module that controls and renders animated sprites using Images
function AnimatedSprite(spriteImage, numFrames, TPF, FPS) {
    // Module constants and variables
    var _this = this;
    this.numFrames = numFrames;
    this.TPF = TPF;
    this.FPS = FPS;
    this.image = spriteImage;
    this.width = spriteImage.width;
    this.height = spriteImage.height;
    this.opacity = 1;
    this.frameIndex = -1;
    this.tickCounter = 0;
    // Function that returns the opacity of the animated sprite
    function getOpacity() {
        return _this.opacity;
    }
    // Function that reduces the opacity of the animated sprite
    function reduceOpacitiy(secondsToFade) {
        _this.opacity -= 1 / (_this.FPS * secondsToFade);
        if (_this.opacity < 0) {
            _this.opacity = 0;
        }
    }
    // Function that updates the frame index of the animated sprite
    function updateFrame() {
        _this.tickCounter += 1;
        // Update the frame index based on the passage of time
        if (_this.tickCounter > _this.TPF) {
            _this.tickCounter = 0;
            // Reset the frame index at the end of the animation
            _this.frameIndex = (_this.frameIndex + 1) % _this.numFrames;
        }
    }
    // Function that handles drawing the animated sprite on the canvas
    function render(ctx, x, y, angle) {
        // Configure the translation points when rotating the canvas
        var translateX = x + (_this.width / (2 * _this.numFrames));
        var translateY = y + (_this.height / 2);
        ctx.save();
        // Configure the canvas opacity
        ctx.globalAlpha = _this.opacity;
        // Translate and rotate canvas to draw the animated sprite at an angle
        ctx.translate(translateX, translateY);
        ctx.rotate(angle);
        ctx.translate(-translateX, -translateY);
        // Draw the animated sprite
        ctx.drawImage(
            _this.image,
            _this.frameIndex * _this.width / _this.numFrames,
            0,
            _this.width / _this.numFrames,
            _this.height,
            x,
            y,
            _this.width / _this.numFrames,
            _this.height);
        ctx.restore();
    }
    // Functions returned by the module
    return {
        render : render,
        getOpacity : getOpacity,
        updateFrame : updateFrame,
        reduceOpacitiy : reduceOpacitiy
    }
}

// A Module that handles all the controls, events and drawing of the Food
function Food(resMan, imageID, numFrames, selectedFrame, FPS, x, y) {
	// Module constants and variables
    var _this = this;
    this.x = x;
    this.y = y;
    this.staticSprite = new StaticSprite(resMan.getImage(imageID), numFrames,
        selectedFrame, FPS);
    this.isEaten = false;
    this.canDelete = false;
    // Function that handles updating the Food's state
    function update() {
        // If Food has been eaten then fade it out within half a second
        if (_this.isEaten) {
            _this.staticSprite.reduceOpacitiy(0.5);
            // Set the Food delete flag to true once the Food has faded
            if (_this.staticSprite.getOpacity() == 0) {
                _this.canDelete = true;
            }
        }
    }
    // Function that handles drawing the Food
    function render(ctx) {
        // Render the static sprite representing the Food
        _this.staticSprite.render(ctx, _this.x, _this.y);
    }
    // Function that sets the state of the Food to eaten
    function setEaten() {
        _this.isEaten = true;
    }
    // Function that returns the Food's delete flag
    function getCanDelete() {
        return _this.canDelete;
    }
    // Functions returned by the module
    return {
        render : render,
        update : update,
        setEaten : setEaten,
        getCanDelete : getCanDelete
    }
}

// A module that handles all game related tasks for the Tap Tap Bug Game
function Game(FPS, resMan, canvasID, canvasWidth, canvasHeight) {
    // Module constants and variables
    var _this = this;
    this.FPS = FPS;
    this.canvasID = canvasID;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.resMan = resMan;
    this.bugObjects = [];
    this.foodObjects = [];
    this.score = 0;
    this.timer = 61;
    this.timeTextID = null;
    this.scoreTextID = null;
    this.sprFoodID = null;
    this.bgPattern = null;
    this.ctx = null;
    this.isGamePaused = true;
    // Function that handles initialization of the Game
    function init() {
        // Obtain the canvas and canvas context from the DOM
        var canvas = $(_this.canvasID).get(0);
        _this.ctx = canvas.getContext("2d");
        // Add mouse click event handler to the canvas
        canvas.addEventListener("mousedown", function() {
            mouseClickEvents(event, canvas);
        }, false);
        // Create the required Food for the Game
        createFood(6, 56, 10, 331, 100, 400)
        // Execute the game loop indefinitely
        setInterval(gameLoop, 1000 / _this.FPS);
    }
    // Function that handles all mouse click events for the Game
    function mouseClickEvents(event, canvas) {
        // Process mouse click events if Game is not paused
        if (!_this.isGamePaused) {
            // Obtain the mouse coordinates relative to the canvas
            mouseX = event.pageX - canvas.offsetLeft;
            mouseY = event.pageY - canvas.offsetTop;
        }
    }
    // Function that sets the background Image for the Game
    function setBackgroundImage(imageID) {
        // Obtain the background Image from the ResourceManager
        var image = _this.resMan.getImage(imageID);
        // Execute function when background Image has fully loaded
        image.onload = function() {
            // Create a pattern using the background Image
            _this.bgPattern = _this.ctx.createPattern(image, "repeat");
        }
    }
    // Function that sets the ID of the time text DOM element
    function setTimeTextID(timeTextID) {
        _this.timeTextID = timeTextID;
    }
    // Function that sets the ID of the score text DOM element
    function setScoreTextID(scoreTextID) {
        _this.scoreTextID = scoreTextID;
    }
    // Function that sets the sprite Image for the Food
    function setSpriteFoodID(sprFoodID) {
        _this.sprFoodID = sprFoodID;
    }
    // Function that updates the Game and renders the Game's content
    function gameLoop() {
        if (!_this.isGamePaused) {
            // Update the Game
            update();
            // Render the Game
            render();
        }
    }
    // Function that handles all the update events for the Game
    function update() {
        // Update the countdown timer and its corresponding time text
        _this.timer -= 1 / _this.FPS;
        $(_this.timeTextID).text("Time: " + Math.floor(_this.timer));
        // Update all of the Food
        for (var i = 0; i < _this.foodObjects.length; i++) {
            // Obtain Food from foodObjects array and update it
            var food = _this.foodObjects[i];
            food.update();
            // Delete Food if it is flagged for removal
            if (food.getCanDelete()) {
                _this.foodObjects.splice(_this.foodObjects.indexOf(food), 1);
            }
        }
    }
    // Function that handles all the drawing for the Game
    function render() {
        // Render the Game's background
        _this.ctx.fillStyle  = _this.bgPattern;
        _this.ctx.fillRect(0, 0, _this.canvasWidth, _this.canvasHeight);
        // Render all of the Food
        for (var i = 0; i < _this.foodObjects.length; i++) {
            _this.foodObjects[i].render(_this.ctx);
        }
    }
    // Function that controls if the Game is paused or running
    function setPaused(isGamePaused) {
        _this.isGamePaused = isGamePaused;
    }
    // Function that returns a random number between an inclusive range
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // Function that creates a specific amount of Food positioned randomly
    function createFood(amount, limit, lowerX, upperX, lowerY, upperY) {
        // Keep track of Food created and position of previously created Food
        var foodCount = 0;
        var prevPos = [[]];
        var prevFoodFrames = [];
        while (foodCount < amount) {
            // Generate random position specified by the bound arguments
            var x = getRandomNumber(lowerX, upperX);
            var y = getRandomNumber(lowerY, upperY);
            // Generate a random frame index for the Food's static sprite
            var foodFrame = getRandomNumber(0, 15);
            var isOverlap = false;
            // Ensure new position doesn't overlap with previous positions
            for (var i = 0; i < prevPos.length; i++) {
                // If there is overlap within limit, set overlap to true
                if (Math.abs(x - prevPos[i][0]) <= limit &&
                    Math.abs(y - prevPos[i][1]) <= limit) {
                    isOverlap = true;
                }
            }
            // Ensure that a new frame index is generated for each Food
            while (prevFoodFrames.indexOf(foodFrame) >= 0) {
                foodFrame = getRandomNumber(0, 15);
            }
            // If there is no overlap, create food and record new position
            if (!isOverlap) {
                _this.foodObjects.push(new Food(_this.resMan, _this.sprFoodID,
                    16, foodFrame, _this.FPS, x, y));
                prevPos.push([x, y]);
                prevFoodFrames.push(foodFrame);
                foodCount += 1
            }
        }
    }
    // Functions returned by the module
    return {
        init : init,
        setPaused : setPaused,
        setTimeTextID : setTimeTextID,
        setScoreTextID : setScoreTextID,
        setSpriteFoodID : setSpriteFoodID,
        setBackgroundImage : setBackgroundImage,
    }
}

// A module that handles the setup of the Tap Tap Bug Game and DOM elements
function Setup() {
    // Singleton module constants and variables
    var _this = this;
    this.FPS = 60;
    this.CANVAS_WIDTH = 387;
    this.CANVAS_HEIGHT = 600;
    this.IMG_BUTTON_PLAY = "assets/button_play.png";
    this.IMG_BUTTON_PAUSE = "assets/button_pause.png";
    this.IMG_BG = "assets/table_texture.png";
    this.SPR_FOOD = "assets/food_sprite.png";
    this.ID_SCORE_LINK = "#score-link";
    this.ID_HOME_LINK = "#home-link";
    this.ID_BUTTON_CLEAR = "#clear-button";
    this.ID_BUTTON_BACK = "#back-button";
    this.ID_BUTTON_PLAY = "#play-button";
    this.ID_BUTTON_PR = "#pause-resume-button";
    this.ID_HEADING_SCORE = "#score-heading";
    this.ID_SCORE_SECTION = "#score-section";
    this.ID_HOME_SECTION = "#home-section";
    this.ID_GAME_SECTION = "#game-section";
    this.ID_CANVAS = "#game-canvas";
    this.ID_TIME_TEXT = "#time-text";
    this.ID_SCORE_TEXT = "#score-text";
    this.isGameStarted = false;
    this.isGamePaused = true;
    this.resMan = null;
    this.game = null;
    // Function that sets up the HTML element events and game canvas
    function init() {
        // Initialize ResourceManager and Game
        _this.resMan = new ResourceManager();
        _this.game = new Game(_this.FPS, _this.resMan, _this.ID_CANVAS,
            _this.CANVAS_WIDTH, _this.CANVAS_HEIGHT);
        // Add all of the Game's Image resources
        _this.resMan.addImage("IMG_BG", _this.IMG_BG, 387, 600);
        _this.resMan.addImage("SPR_FOOD", _this.SPR_FOOD, 896, 56);
        // Setup remaining Game specific tasks
        _this.game.setBackgroundImage("IMG_BG");
        _this.game.setSpriteFoodID("SPR_FOOD");
        _this.game.setTimeTextID(_this.ID_TIME_TEXT);
        _this.game.setScoreTextID(_this.ID_SCORE_TEXT);
        // Finish initializing the Game
        _this.game.init();
        // Bind unobtrusive event handlers
        $(_this.ID_SCORE_LINK).click(function(){scoreLinkEvent();});
        $(_this.ID_HOME_LINK).click(function(){homeLinkEvent();});
        $(_this.ID_BUTTON_BACK).click(function(){homeLinkEvent();});
        $(_this.ID_BUTTON_CLEAR).click(function(){scoreClearEvent();});
        $(_this.ID_BUTTON_PLAY).click(function(){playLinkEvent();});
        $(_this.ID_BUTTON_PR).click(function(){pauseResumeToggleEvent();});
    }
    // Function that handles the pause and resume button events
    function pauseResumeToggleEvent() {
        // Pause the game is game is running and resume the game if paused
        _this.isGamePaused = !_this.isGamePaused;
        _this.game.setPaused(_this.isGamePaused);
        // Change the image of the button depending on the state of the game
        if (_this.isGamePaused) {
            $(_this.ID_BUTTON_PR + " img").attr("src", _this.IMG_BUTTON_PLAY);
        } else {
            $(_this.ID_BUTTON_PR + " img").attr("src", _this.IMG_BUTTON_PAUSE);
        }
    }
    // Function that handles loading the high score value from local storage
    function refreshScoreEvent() {
        // Obtain the highScore from local storage, use 0 if it doesn't exist
        var rawScore = window.localStorage.getItem("highScore");
        var highScore = rawScore ? rawScore : 0;
        $(_this.ID_HEADING_SCORE).text("High Score: " + highScore);
    }
    // Function that handles clearing the score from local storage
    function scoreClearEvent() {
        window.localStorage.removeItem("highScore");
        refreshScoreEvent(); // Refresh the displayed score
    }
    // Function that handles the event for the score naviation link
    function scoreLinkEvent() {
        // If game is not running
        if (!_this.isGameStarted) {
            // Set score link item to active and home link to inactive
            $(_this.ID_SCORE_LINK).addClass("active");
            $(_this.ID_HOME_LINK).removeClass("active");
            // Hide the welcome section and show the score section
            $(_this.ID_HOME_SECTION).hide();
            $(_this.ID_SCORE_SECTION).show();
            refreshScoreEvent(); // Refresh the displayed score
        }
    }
    // Function that handles the event for the home navigation link
    function homeLinkEvent() {
        // If game is not running
        if (!_this.isGameStarted) {
            // Set home link to active and score link to inactive
            $(_this.ID_HOME_LINK).addClass("active");
            $(_this.ID_SCORE_LINK).removeClass("active");
            // Hide the score section and show the welcome section
            $(_this.ID_SCORE_SECTION).hide();
            $(_this.ID_HOME_SECTION).show();
        }
    }
    // Function that handles the event for the play game button
    function playLinkEvent() {
        // Hide the welcome section and show the game section
        $(_this.ID_HOME_SECTION).hide();
        $(_this.ID_GAME_SECTION).show();
        // Start the page and unpause it
        _this.isGameStarted = true;
        pauseResumeToggleEvent();
    }
    // Functions returned by the module
    return {
        init : init
    }
}

// Setup the game and events
window.onload = new Setup().init;
