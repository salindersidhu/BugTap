// Enable whole-script strict mode syntax
"use strict";

// An Object that stores and Image and additional attributes for a sprite
function SpriteSheet() {
    // Create a new Image and default variables for SpriteSheet
    this.image = new Image();
    this.numFrames = null;
    this.frameWidth = null;
    // Return the SpriteSheet object
    return this;
}

// A module that handles creation and storage of resources
function ResourceManager() {
    // Module constants and variables
    var _this = this;
    this.imageDict = {};
    this.spriteSheetDict = {};
    // Functon that creates and stores a new Image
    function addImage(id, source, width, height) {
        var image = new Image();
        image.src = source;
        image.width = width;
        image.height = height;
        _this.imageDict[id] = image;
    }
    // Function that creates and stores a new SpriteSheet
    function addSpriteSheet(id, source, width, height, numFrames) {
        var spriteSheet = new SpriteSheet();
        spriteSheet.image.src = source;
        spriteSheet.image.width = width;
        spriteSheet.image.height = height;
        spriteSheet.numFrames = numFrames;
        spriteSheet.frameWidth = width / numFrames;
        _this.spriteSheetDict[id] = spriteSheet;
    }
    // Function that returns the Image corresponding to an ID
    function getImage(id) {
        return _this.imageDict[id];
    }
    // Function that returns the SpriteSheet corresponding to an ID
    function getSpriteSheet(id) {
        return _this.spriteSheetDict[id];
    }
    // Functions returned by the module
    return {
        addImage : addImage,
        getImage : getImage,
        addSpriteSheet : addSpriteSheet,
        getSpriteSheet : getSpriteSheet,
    }
}

// A module that controls and renders static image sprites using SpriteSheets
function StaticSprite(spriteSheet, selectedFrame, FPS) {
    // Module constants and variables
    var _this = this;
    this.selectedFrame = selectedFrame;
    this.FPS = FPS;
    this.image = spriteSheet.image;
    this.width = spriteSheet.frameWidth;
    this.height = spriteSheet.image.height;
    this.opacity = 1;
    // Function that returns the opacity of the static sprite
    function getOpacity() {
        return _this.opacity;
    }
    // Function that reduces the opacity of the static sprite
    function reduceOpacitiy(secondsToFade) {
        _this.opacity -= 1 / (_this.FPS * secondsToFade);
        if (_this.opacity < 0) {
            _this.opacity = 0;
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

// A module that controls and renders animated sprites using SpriteSheets
function AnimatedSprite(spriteSheet, TPF, FPS) {
    // Module constants and variables
    var _this = this;
    this.TPF = TPF;
    this.FPS = FPS;
    this.image = spriteSheet.image;
    this.width = spriteSheet.frameWidth;
    this.height = spriteSheet.image.height;
    this.numFrames = spriteSheet.numFrames;
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
            // Update and reset the frame index at the end of the animation
            _this.frameIndex = (_this.frameIndex + 1) % _this.numFrames;
        }
    }
    // Function that handles drawing the animated sprite on the canvas
    function render(ctx, x, y, angle) {
        // Configure the translation points to center of image when rotating
        var translateX = x + (_this.image.width / (2 * _this.numFrames));
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
            _this.frameIndex * _this.width,
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
        updateFrame : updateFrame,
        reduceOpacitiy : reduceOpacitiy
    }
}

// A Module that handles all the controls, events and drawing of the Food
function Food(spriteSheet, selectedFrame, FPS, x, y) {
	// Module constants and variables
    var _this = this;
    this.x = x;
    this.y = y;
    this.width = spriteSheet.frameWidth;
    this.height = spriteSheet.image.height;
    this.staticSprite = new StaticSprite(spriteSheet, selectedFrame, FPS);
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
    // Function that returns if the Food has been eaten
    function getIsEaten() {
        return _this.isEaten;
    }
    // Function that returns the Food's delete flag
    function getCanDelete() {
        return _this.canDelete;
    }
    // Function that returns the Food's x position
    function getX() {
        return _this.x;
    }
    // Function that returns the Food's y position
    function getY() {
        return _this.y;
    }
    // Function that returns the Food's width
    function getWidth() {
        return _this.width;
    }
    // Function that returns the Food's height
    function getHeight() {
        return _this.height;
    }
    // Functions returned by the module
    return {
        getX : getX,
        getY : getY,
        render : render,
        update : update,
        setEaten : setEaten,
        getWidth : getWidth,
        getHeight : getHeight,
        getIsEaten : getIsEaten,
        getCanDelete : getCanDelete
    }
}

// A Module that handles all the controls, events and drawing for the Bug
function Bug(spriteSheet, points, speed, FPS, x, y, foodObjects) {
	// Module constants and variables
	var _this = this;
    this.points = points;
    this.speed = speed;
    this.x = x;
    this.y = y;
    this.width = spriteSheet.frameWidth;
    this.height = spriteSheet.image.height;
    this.foodObjects = foodObjects;
    this.animatedSprite = new AnimatedSprite(spriteSheet, 10 / speed, FPS);
    this.angle = 0
    this.isDead = false;
    this.canDelete = false;
    this.foodPos = [];
    // Function that handles updating the Bug's state
    function update() {
        // Update the Bug if it is alive
        if(!_this.isDead) {
            // Find the nearest Food from the Bug's current position
            findNearestFood();
            // Handle collision with Food
            handleFoodCollision();
            // Update the Bug's animation
            _this.animatedSprite.updateFrame();
            // Move the Bug to the nearest Food's position
            moveToPoint(_this.foodPos[0], _this.foodPos[1]);
        } else {
            // Fade the Bug within 2 seconds
            _this.animatedSprite.reduceOpacitiy(2);
            // Set the Bug delete flag to true once the Bug has faded
            if (_this.animatedSprite.getOpacity() == 0) {
                _this.canDelete = true;
            }
        }
    }
    // Function that finds and sets the nearest Food from the Bug's position
    function findNearestFood() {
        var shortestDist = Number.MAX_VALUE;
        // Find the nearest Food object and obtain its position
        for (var i = 0; i < _this.foodObjects.length; i++) {
            var food = _this.foodObjects[i];
            // If the Food has not been eaten
            if (!food.getIsEaten()) {
                // Calculate the distance between the Bug and Food
                var foodX = food.getX() + (food.getWidth() / 2);
                var foodY = food.getY() + (food.getHeight() / 2);
                var distX = foodX - _this.x;
                var distY = foodY - _this.y;
                // Calculate the hypotenuse to find shortest distance to Food
                var hypotenuse = Math.sqrt((distX * distX) + (distY * distY));
                // If hypotenuse is shorter than current shortest distance
                if (hypotenuse < shortestDist) {
                    // Set Food target position to current Food's position
                    _this.foodPos = [foodX, foodY];
                    shortestDist = hypotenuse; // Update shortest distance
                }
            } else {
                // If the last Food was eaten kill this Bug
                if (_this.foodObjects.length == 1) {
                    setDead();
                }
            }
        }
    }
    // Function that handles collision with Food and the current Bug
    function handleFoodCollision() {
        for (var i = 0; i < _this.foodObjects.length; i++) {
            var food = _this.foodObjects[i];
            // If Food has not been eaten
            if (!food.getIsEaten()) {
                // Check if the Bug is colliding with a Food object
                if ((_this.x < (food.getX() + food.getWidth()) &&
                    (_this.x + _this.width) > food.getX()) &&
                    (_this.y < (food.getY() + food.getHeight()) &&
                    (_this.height + _this.y) > food.getY())) {
                    // Set the Food's state to eaten
                    food.setEaten();
                }
            }
        }
    }
    // Function that moves the Bug's position to a specific target point
    function moveToPoint(targetX, targetY) {
        // Calculate the distance to the target point
        var distX = targetX - _this.x - (_this.width / 2);
        var distY = targetY - _this.y - (_this.height / 2);
        // Calculate the hypotenuse
        var hypotenuse = Math.sqrt((distX * distX) + (distY * distY));
        distX /= hypotenuse;
        distY /= hypotenuse;
        // Move towards point
        _this.x += distX * _this.speed;
        _this.y += distY * _this.speed;
        // Update the Bug's angle depending on the movement direction
        _this.angle = Math.atan2(distY, distX);
    }
    // Function that handles drawing the Bug
    function render(ctx) {
        _this.animatedSprite.render(ctx, _this.x, _this.y, _this.angle);
    }
    // Function that sets the state of the Bug to dead
    function setDead() {
        _this.isDead = true;
    }
    // Function that returns if the Bug has been killed
    function getIsDead() {
        return _this.isDead;
    }
    // Return the number of points the Bug is worth
    function getPoints() {
        return _this.points;
    }
    // Function that returns the Bug's delete flag
    function getCanDelete() {
        return _this.canDelete;
    }
    // Function that returns the Bug's x position
    function getX() {
        return _this.x;
    }
    // Function that returns the Bug's y position
    function getY() {
        return _this.y;
    }
    // Function that returns the Bug's width
    function getWidth() {
        return _this.width;
    }
    // Function that returns the Bug's height
    function getHeight() {
        return _this.height;
    }
    // Functions returned by the module
    return {
        getX : getX,
        getY : getY,
        render : render,
        update : update,
        setDead : setDead,
        getWidth : getWidth,
        getHeight : getHeight,
        getIsDead : getIsDead,
        getPoints : getPoints,
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
    this.bugDB = {};
    this.bugProbs = [];
    this.bugMakeTimes = [];
    this.bugMakeTime = 0;
    this.ticks = 0;
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
        makeFood(6, 10, 330, 100, 400);
        // Reset the Bug make timer and init Bug make probability distribution
        resetBugMakeTimer();
        setMakeBugProbability();
        // Execute the game loop indefinitely
        setInterval(gameLoop, 1000 / _this.FPS);
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
    // Function that handles all mouse click events for the Game
    function mouseClickEvents(event, canvas) {
        // Process mouse click events if Game is not paused
        if (!_this.isGamePaused) {
            // Obtain the mouse coordinates relative to the canvas
            var mouseX = event.pageX - canvas.offsetLeft;
            var mouseY = event.pageY - canvas.offsetTop;
            // Handle mouse click on Bug objects
            for (var i = 0; i < _this.bugObjects.length; i++) {
                var bug = _this.bugObjects[i];
                // If a Bug was clicked
                if ((mouseX > bug.getX() && mouseX < (bug.getX() +
                    bug.getWidth())) && (mouseY > bug.getY() && mouseY <
                    (bug.getY() + bug.getHeight()))) {
                    // Update score only once
                    if (!bug.getIsDead()) {
                        // Update score and update corresponding DOM element
                        _this.score += bug.getPoints();
                        $(_this.scoreTextID).text("Score: " + _this.score);
                    }
                    // Kill the Bug
                    bug.setDead();
                }
            }
        }
    }
    // Function that handles all the update events for the Game
    function update() {
        // Update the countdown timer and its corresponding time text
        _this.timer -= 1 / _this.FPS;
        $(_this.timeTextID).text("Time: " + Math.floor(_this.timer));
        // Create a new Bug
        makeBugs();
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
        // Update all of the Bugs
        for (var i = 0; i < _this.bugObjects.length; i++) {
            // Obtain Bug from bugObjects array and update it
            var bug = _this.bugObjects[i];
            bug.update();
            // Delete Bug if it is flagged for removal
            if (bug.getCanDelete()) {
                _this.bugObjects.splice(_this.bugObjects.indexOf(bug), 1);
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
        // Render all of the Bugs
        for (var i = 0; i < _this.bugObjects.length; i++) {
            _this.bugObjects[i].render(_this.ctx);
        }
    }
    // Function that makes a specific amount of Food positioned randomly
    function makeFood(amount, lowerX, upperX, lowerY, upperY) {
        var foodCount = 0;
        var prevPos = [[]];
        var prevFrames = [];
        // Obtain the Food's SpriteSheet
        var sprFood = _this.resMan.getSpriteSheet(_this.sprFoodID);
        while (foodCount < amount) {
            // Condition the Sprite's bound variables to stay within the canvas
            if ((lowerX + sprFood.frameWidth) < 0) {
                lowerX = 0;
            }
            if ((upperX + sprFood.frameWidth) > _this.canvasWidth) {
                upperX -= (upperX + sprFood.frameWidth) % _this.canvasWidth;
            }
            if ((lowerY + sprFood.image.height) < 0) {
                lowerY = 0;
            }
            if ((upperY + sprFood.image.height) > _this.canvasHeight) {
                upperY -= (upperY + sprFood.image.height) % _this.canvasHeight;
            }
            // Generate random position specified by the bound arguments
            var x = getRandomNumber(lowerX, upperX);
            var y = getRandomNumber(lowerY, upperY);
            // Generate a random frame index for the Food's static sprite
            var randFrame = getRandomNumber(0, sprFood.numFrames - 1);
            var isOverlap = false;
            // Ensure new position doesn't overlap with previous positions
            for (var i = 0; i < prevPos.length; i++) {
                // If there is overlap within limit, set overlap to true
                if (Math.abs(x - prevPos[i][0]) <= sprFood.frameWidth &&
                    Math.abs(y - prevPos[i][1]) <= sprFood.image.height) {
                    isOverlap = true;
                }
            }
            // Ensure that a new frame index is generated for each Food
            while(prevFrames.indexOf(randFrame) >= 0) {
                // If all possible frame indicies are used, clear the array
                if (prevFrames.length == sprFood.numFrames) {
                    prevFrames = [];
                }
                randFrame = getRandomNumber(0, sprFood.numFrames - 1);
            }
            // If there is no overlap then create food
            if (!isOverlap) {
                _this.foodObjects.push(new Food(sprFood, randFrame, _this.FPS,
                    x, y));
                prevPos.push([x, y]);
                prevFrames.push(randFrame);
                foodCount += 1;
            }
        }
    }
    // Function that handles creating a new Bug with random attributes
    function makeBugs() {
        _this.ticks += 1;
        // If Bug make timer has triggered
        if (_this.ticks > _this.bugMakeTime * _this.FPS) {
            // Reset the Bug make timer system
            resetBugMakeTimer();
            // Configure Bug using randomly generated attributes
            var bugSpriteID = getRandomItem(_this.bugProbs);
            var bugItem = _this.bugDB[bugSpriteID];
            var bugSprite = _this.resMan.getSpriteSheet(bugSpriteID);
            var y = getRandomItem([0 - bugSprite.image.height,
                _this.canvasHeight + bugSprite.frameWidth]);
            var x = getRandomItem([bugSprite.frameWidth,
                _this.canvasWidth - bugSprite.frameWidth]);
            // Create a new Bug using the above attributes
            _this.bugObjects.push(new Bug(bugSprite, bugItem["points"],
                bugItem["speed"], _this.FPS, x, y, _this.foodObjects));
        }
    }
    // Function that creates the probability distribution for making Bugs
    function setMakeBugProbability() {
        for (var key in _this.bugDB) {
            var factor = _this.bugDB[key]["weight"] * 10;
            // Append Bug ID equal to the weight of the Bug's probability
            for (var i = 0; i < factor; i++) {
                _this.bugProbs.push(key);
            }
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
    // Function that sets the bug make time variables to their default values
    function resetBugMakeTimer() {
        _this.ticks = 0;
        _this.bugMakeTime = getRandomItem(_this.bugMakeTimes);
    }
    // Function that adds
    function addBug(spriteID, points, speed, weight) {
        _this.bugDB[spriteID] = {"points" : points, "speed" : speed,
            "weight" : weight};
    }
    // Function that sets the make times array for the Bug
    function setBugMakeTimes(makeTimes) {
        _this.bugMakeTimes = makeTimes;
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
    // Function that controls if the Game is paused or running
    function setPaused(isGamePaused) {
        _this.isGamePaused = isGamePaused;
    }
    // Function that randomly returns an item from an array
    function getRandomItem(items) {
        return items[Math.floor(Math.random() * items.length)];
    }
    // Function that returns a random number between an inclusive range
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // Functions returned by the module
    return {
        init : init,
        addBug : addBug,
        setPaused : setPaused,
        setTimeTextID : setTimeTextID,
        setScoreTextID : setScoreTextID,
        setSpriteFoodID : setSpriteFoodID,
        setBugMakeTimes : setBugMakeTimes,
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
    this.IMG_BG = "assets/background_table.png";
    this.SPR_FOOD = "assets/food_sprite.png";
    this.SPR_RED_BUG = "assets/red_bug_sprite.png";
    this.SPR_ORANGE_BUG = "assets/orange_bug_sprite.png";
    this.SPR_GREY_BUG = "assets/grey_bug_sprite.png";
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
        _this.resMan.addSpriteSheet("SPR_FOOD", _this.SPR_FOOD, 896, 56, 16);
        _this.resMan.addSpriteSheet("SPR_RED_BUG", _this.SPR_RED_BUG, 90, 50,
            2);
        _this.resMan.addSpriteSheet("SPR_ORANGE_BUG", _this.SPR_ORANGE_BUG,
            90, 50, 2);
        _this.resMan.addSpriteSheet("SPR_GREY_BUG", _this.SPR_GREY_BUG, 90,
            50, 2);
        // Setup remaining Game attributes
        _this.game.setBackgroundImage("IMG_BG");
        _this.game.setSpriteFoodID("SPR_FOOD");
        _this.game.setTimeTextID(_this.ID_TIME_TEXT);
        _this.game.setScoreTextID(_this.ID_SCORE_TEXT);
        _this.game.setBugMakeTimes([0.5, 1, 1.5]);
        _this.game.addBug("SPR_RED_BUG", 3, 2.5, 0.3);
        _this.game.addBug("SPR_ORANGE_BUG", 1, 2, 0.4);
        _this.game.addBug("SPR_GREY_BUG", 5, 5, 0.3);
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
