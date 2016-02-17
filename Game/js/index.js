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

// SpriteAnimation handles control and rendering of animations
function SpriteAnimation(sprite, initFrame, FPS, TPF) {
    // Module constants and variables
    const _this = this;
    _this.initFrame = initFrame;
    _this.FPS = FPS;
    _this.TPF = TPF;
    _this.image = sprite.image;
    _this.width = sprite.image.width;
    _this.fwidth = sprite.frameWidth;
    _this.height = sprite.image.height;
    _this.numFrames = sprite.numFrames;
    _this.opacity = 1;
    _this.frameIndex = initFrame; // Default is -1 for animations
    _this.tickCounter = 0;
    // Function that returns the opacity of the SpriteAnimation
    function getOpacity() {
        return _this.opacity;
    }
    // Function that reduces the opacity of the SpriteAnimation
    function reduceOpacity(secondsTillFade) {
        _this.opacity -= 1 / (_this.FPS * secondsTillFade);
        if (_this.opacity < 0) {
            _this.opacity = 0;
        }
    }
    // Function that updates the frame index of the SpriteAnimation
    function updateFrame() {
        _this.tickCounter += 1;
        // Update the frame index when the timer has triggered
        if (_this.tickCounter > _this.TPF) {
            _this.tickCounter = 0;
            // Update and reset the frame index at the end of the animation
            _this.frameIndex = ++_this.frameIndex % _this.numFrames;
        }
    }
    // Function that draws the SpriteAnimation
    function render(ctx, x, y, angle) {
        // Configure the translation points to center of image when rotating
        const translateX = x + (_this.width / (2 * _this.numFrames));
        const translateY = y + (_this.height / 2);
        ctx.save();
        // Configure the canvas opacity
        ctx.globalAlpha = _this.opacity;
        // Translate and rotate canvas to draw the animated Sprite at an angle
        ctx.translate(translateX, translateY);
        ctx.rotate(angle);
        ctx.translate(-translateX, -translateY);
        // Draw the animated Sprite
        ctx.drawImage(
            _this.image,
            _this.frameIndex * _this.fwidth,
            0,
            _this.fwidth,
            _this.height,
            x,
            y,
            _this.fwidth,
            _this.height);
        ctx.restore();
    }
    // Functions returned by the module
    return {
        render : render,
        getOpacity : getOpacity,
        updateFrame : updateFrame,
        reduceOpacity : reduceOpacity
    }
}

// GameSystem handles the core Game event management and rendering tasks
function GameSystem(FPS, resMan, canvasID) {
    // Module constants and variables
    const _this = this;
    _this.FPS = FPS;
    _this.resMan = resMan;
    _this.canvasID = canvasID;
    _this.isGamePaused = false;
    _this.isGameActive = false;
    _this.boundGame = null;
    // Function that initializes the GameSystem
    function init() {
        // Obtain the canvas and canvas context from the DOM
        const canvas = $(_this.canvasID).get(0);
        const ctx = canvas.getContext('2d');
        // Add event listener for mouse click events to the canvas
        canvas.addEventListener('mousedown', function() {
            mouseClickEvents(event, canvas);
        }, false);
        // Add event listener for mouse move events to the canvas
        canvas.addEventListener('mousemove', function() {
            mouseMoveEvents(event, canvas);
        }, false);
        // Initialize the bound game module
        _this.boundGame.init(_this.FPS, _this.resMan, ctx, canvas,
            /*_this.isGameOver,*/ _this.isGamePaused);
        // Execute the GameSystem event loop indefinitely
        setInterval(gameSystemLoop, 1000 / _this.FPS);
    }
    // Function that continuously updates and renders the GameSystem
    function gameSystemLoop() {
        if (_this.isGameActive && !_this.isGamePaused) {
            // Update the bound game module
            _this.boundGame.update();
            // Render the bound game module
            _this.boundGame.render();
        }
    }
    // Function that handles all the mouse click events for GameSystem
    function mouseClickEvents(event, canvas) {
        // Process mouse click events if GameSystem is active and not paused
        if (_this.isGameActive && !_this.isGamePaused) {
            // Obtain the mouse coordinates relative to the canvas
            const mouseX = event.pageX - canvas.offsetLeft;
            const mouseY = event.pageY - canvas.offsetTop;
            // Trigger bound game module's mouse click event
            _this.boundGame.mouseClickEvent(mouseX, mouseY);
        }
    }
    // Function that handles all mouse move events for GameSystem
    function mouseMoveEvents(event, canvas) {
        // Process mouse move events if GameSystem is active and not paused
        if (_this.isGameActive && !_this.isGamePaused) {
            // Obtain the mouse coordinates relative to the canvas
            const mouseX = event.pageX - canvas.offsetLeft;
            const mouseY = event.pageY - canvas.offsetTop;
            // Trigger bound game module's mouse move event
            _this.boundGame.mouseMoveEvent(mouseX, mouseY);
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
    function getIsActive() {
        return _this.isGameActive;
    }
    // Function that officially starts the GameSystem
    function start() {
        // Reset the bound game module
        _this.boundGame.reset();
        _this.isGameActive = true;
    }
    // Function that officially stops the GameSystem
    function stop() {
        _this.isGameActive = false;
    }
    // Function that binds a game module to the GameSystem
    function bindGame(game) {
        _this.boundGame = game;
    }
    // Functions returned by the module
    return {
        init : init,
        stop : stop,
        start : start,
        bindGame : bindGame,
        getIsPaused : getIsPaused,
        getIsActive : getIsActive,
        togglePauseResume : togglePauseResume
    }
}

// Food handles event management and rendering tasks for Food
function Food(sprite, FPS, selectedFrame, x, y) {
    // Module constants and variables
    const _this = this;
    _this.animation = new SpriteAnimation(sprite, selectedFrame, FPS, 0);
    _this.x = x;
    _this.y = y;
    _this.width = sprite.frameWidth;
    _this.height = sprite.image.height;
    _this.isEaten = false;
    _this.canDelete = false;
    // Function that handles updating the Food's state
    function update() {
        // If Food has been eaten then fade it out within half a second
        if (_this.isEaten) {
            _this.animation.reduceOpacity(0.5);
            // Set the Food delete flag to true once the Food has faded
            if (_this.animation.getOpacity() === 0) {
                _this.canDelete = true;
            }
        }
    }
    // Function that handles drawing the Object
    function render(ctx) {
        _this.animation.render(ctx, _this.x, _this.y, _this.angle);
    }
    // Function that returns if the Food has been eaten
    function getIsEaten() {
        return _this.isEaten;
    }
    // Function that sets the state of the Food to eaten
    function setEaten() {
        _this.isEaten = true;
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
    // Function that returns the Food's delete flag
    function getCanDelete() {
        return _this.canDelete;
    }
    // Functions returned by the module
    return {
        getX : getX,
        getY : getY,
        update : update,
        render : render,
        getWidth : getWidth,
        setEaten : setEaten,
        getHeight : getHeight,
        getIsEaten : getIsEaten,
        getCanDelete : getCanDelete
    }
}

// Bug handles all event management and rendering tasks for Bug
function Bug(sprite, points, speed, FPS, x, y, foodObjects) {
    // Module constants and variables
    const _this = this;
    _this.points = points;
    _this.speed = speed;
    _this.x = x;
    _this.y = y;
    _this.width = sprite.frameWidth;
    _this.height = sprite.image.height;
    _this.foodObjects = foodObjects;
    _this.animation = new SpriteAnimation(sprite, -1, FPS, 10 / speed);
    _this.angle = 0;
    _this.isDead = false;
    _this.canDelete = false;
    _this.foodPos = [];
    // Function that handles updating the Bug's state
    function update() {
        // Update the Bug if it is alive
        if (!_this.isDead) {
            // Find the nearest Food from the Bug's current position
            findNearestFood();
            // Handle collision with Food
            handleFoodCollision();
            // Update the Bug's animation
            _this.animation.updateFrame();
            // Move the Bug to the nearest Food's position
            moveToPoint(_this.foodPos[0], _this.foodPos[1]);
        } else {
            // Fade the Bug within 2 seconds
            _this.animation.reduceOpacity(2);
            // Set the Bug delete flag to true once the Bug has faded
            if (_this.animation.getOpacity() === 0) {
                _this.canDelete = true;
            }
        }
    }
    // Function that handles drawing the Bug
    function render(ctx) {
        _this.animation.render(ctx, _this.x, _this.y, _this.angle);
    }
    // Function that moves the Bug's position to a specific target point
    function moveToPoint(targetX, targetY) {
        // Calculate the distance to the target point
        var distX = targetX - _this.x -
            (_this.width / 2);
        var distY = targetY - _this.y -
            (_this.height / 2);
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
    // Function that handles collision with Food and the current Bug
    function handleFoodCollision() {
        for (var i = 0; i < _this.foodObjects.length; i++) {
            var food = _this.foodObjects[i];
            // If Food has not been eaten
            if (!food.getIsEaten()) {
                // Check if the Bug is colliding with a Food object
                if ((_this.x < (food.getX() +
                    food.getWidth()) && (_this.x +
                    _this.width) > food.getX()) &&
                    (_this.y < (food.getY() +
                    food.getHeight()) && (_this.height +
                    _this.y) > food.getY())) {
                    // Set the Food's state to eaten
                    food.setEaten();
                }
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
            }
        }
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
    // Function that returns the Bug's delete flag
    function getCanDelete() {
        return _this.canDelete;
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
    return {
        getX : getX,
        getY : getY,
        update : update,
        render : render,
        setDead : setDead,
        getWidth : getWidth,
        getPoints : getPoints,
        getIsDead : getIsDead,
        getHeight : getHeight,
        getCanDelete : getCanDelete
    }
}

// TapTapBugGame handles event management and rendering tasks for TapTapBugGame
function TapTapBugGame() {
    // Module constants and variables
    const _this = this;
    _this.FPS = null;
    _this.resMan = null;
    _this.ctx = null;
    _this.canvas = null;
    _this.isGamePaused = null;
    _this.updateScoreFunc = null;
    _this.updateTimeFunc = null;
    _this.sprFoodID = null;
    _this.imgBackgroundID = null;
    _this.bgPattern = null;
    _this.bugDB = {};
    _this.bugProbs = [];
    _this.bugMakeTimes = [];
    _this.bugObjects = [];
    _this.foodObjects = [];
    _this.bugMakeTime = 0;
    _this.score = 0;
    _this.ticks = 0;
    _this.timeAlloted = 0;
    _this.isGameOver = false;
    // Function that initializes TapTapBugGame
    function init(FPS, resMan, ctx, canvas, isGamePaused) {
        // Set game variables
        _this.FPS = FPS;
        _this.resMan = resMan;
        _this.ctx = ctx;
        _this.canvas = canvas;
        _this.isGamePaused = isGamePaused;
        // Set the game's background
        setBackground();
        // Create the required Food for the Game
        makeFood(6, 30, 10, 330, 120, 380);
        // Reset the Bug make timer and init Bug make probability distribution
        resetBugMakeTimer();
        setMakeBugProbability();
    }
    // Function that resets the instance variables to their default values
    function reset() {
    }
    // Function that handles updating attributes for TapTapBugGame
    function update() {
        // Update the time alloted and it's corresponding time display text
        _this.timeAlloted -= 1 / _this.FPS;
        _this.updateTimeFunc(Math.floor(_this.timeAlloted));
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
        // Create new Bug objects
        makeBugs();
    }
    // Function that handles drawing tasks for TapTapBugGame
    function render() {
        // Render the Game's background
        _this.ctx.fillStyle = _this.bgPattern;
        _this.ctx.fillRect(0, 0, _this.canvas.width, _this.canvas.height);
        // Render all of the Food
        for (var i = 0; i < _this.foodObjects.length; i++) {
            _this.foodObjects[i].render(_this.ctx);
        }
        // Render all of the Bugs
        for (var i = 0; i < _this.bugObjects.length; i++) {
            _this.bugObjects[i].render(_this.ctx);
        }
    }
    // Function that handles all mouse click tasks for TapTapBugGame
    function mouseClickEvent(mouseX, mouseY) {
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
                    _this.updateScoreFunc(_this.score);
                }
                // Kill the Bug
                bug.setDead();
            }
        }
    }
    // Function that handles all mouse move tasks for TapTapBugGame
    function mouseMoveEvent(mouseX, mouseY) {
    }
    // Function that makes a specific amount of Food positioned randomly
    function makeFood(amount, tol, lowX, highX, lowY, highY) {
        var foodCount = 0;
        var prevPos = [[]];
        var prevFrames = [];
        // Obtain the Food's Sprite
        const foodSpr = _this.resMan.getSprite(_this.sprFoodID);
        while (foodCount < amount) {
            // Condition the Sprite's bound variables to stay within the canvas
            if ((lowX + foodSpr.frameWidth) < 0) {
                lowX = 0;
            }
            if ((highX + foodSpr.frameWidth) > _this.canvas.width) {
                highX -= (highX + foodSpr.frameWidth) % _this.canvas.width;
            }
            if ((lowY + foodSpr.image.height) < 0) {
                lowY = 0;
            }
            if ((highY + foodSpr.image.height) > _this.canvas.height) {
                highY -= (highY + foodSpr.image.height) % _this.canvas.height;
            }
            // Generate random positions specified by the bound variables
            const x = getRandomNumber(lowX, highX);
            const y = getRandomNumber(lowY, highY);
            // Generate a random frame index for the Food's Sprite image
            var randFrame = getRandomNumber(0, foodSpr.numFrames - 1);
            var isOverlap = false;
            // Ensure new position doesn't overlap with previous positions
            for (var i = 0; i < prevPos.length; i++) {
                // If there is overlap, set overlap to true
                if (Math.abs(x - prevPos[i][0]) <= foodSpr.frameWidth + tol &&
                    Math.abs(y - prevPos[i][1]) <= foodSpr.image.height +
                    tol) {
                    isOverlap = true;
                }
            }
            // Ensure that a new frame index is generated for each Food
            while(prevFrames.indexOf(randFrame) >= 0) {
                // If all possible frame indicies are used, clear the array
                if (prevFrames.length === foodSpr.numFrames) {
                    prevFrames = [];
                }
                randFrame = getRandomNumber(0, foodSpr.numFrames - 1);
            }
            // If there is no overlap then create the Food
            if (!isOverlap) {
                _this.foodObjects.push(new Food(foodSpr, _this.FPS, randFrame,
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
            // Reset the Bug make timer
            resetBugMakeTimer();
            // Configure Bug using randomly generated attributes
            var bugSpriteID = getRandomItem(_this.bugProbs);
            var bugItem = _this.bugDB[bugSpriteID];
            var bugSprite = _this.resMan.getSprite(bugSpriteID);
            var y = getRandomItem([0 - bugSprite.image.height,
                _this.canvas.height + bugSprite.frameWidth]);
            var x = getRandomItem([bugSprite.frameWidth,
                _this.canvas.width - bugSprite.frameWidth]);
            console.log(x, y);
            // Create a new Bug using the above attributes
            _this.bugObjects.push(new Bug(bugSprite, bugItem['points'],
                bugItem['speed'], _this.FPS, x, y, _this.foodObjects));
        }
    }
    // Function that creates the probability distribution for making Bugs
    function setMakeBugProbability() {
        for (var key in _this.bugDB) {
            var factor = _this.bugDB[key]['weight'] * 10;
            // Append Bug ID equal to the weight of the Bug's probability
            for (var i = 0; i < factor; i++) {
                _this.bugProbs.push(key);
            }
        }
    }
    // Function that sets the background for the game
    function setBackground() {
        // Obtain the background Image from the ResourceManager
        const image = _this.resMan.getImage(_this.imgBackgroundID);
        // Execute function when background Image has fully loaded
        image.onload = function() {
            // Create a pattern using the background Image
            _this.bgPattern = _this.ctx.createPattern(image, 'repeat');
        }
    }
    // Function that sets the bug make time variables to their default values
    function resetBugMakeTimer() {
        _this.ticks = 0;
        _this.bugMakeTime = getRandomItem(_this.bugMakeTimes);
    }
    // Function that adds information about a new Bug to the Bug database
    function addBug(spriteID, points, speed, weight) {
        _this.bugDB[spriteID] = {'points' : points, 'speed' : speed,
            'weight' : weight};
    }
    // Function that sets the amount of time alloted for the game
    function setAllotedTime(timeAlloted) {
        _this.timeAlloted = timeAlloted + 1;
    }
    // Function that sets the make times array for the Bug
    function setBugMakeTimes(makeTimes) {
        _this.bugMakeTimes = makeTimes;
    }
    // Function that binds the update score function to the game
    function bindUpdateScoreFunc(updateScoreFunc) {
        _this.updateScoreFunc = updateScoreFunc;
    }
    // Function that binds the update time function to the game
    function bindUpdateTimeFunc(updateTimeFunc) {
        _this.updateTimeFunc = updateTimeFunc;
    }
    // Function that sets the Sprite ID for the Food
    function setSpriteFoodID(sprFoodID) {
        _this.sprFoodID = sprFoodID;
    }
    // Function that sets the background Image ID for the game
    function setImageBackgroundID(imgBackgroundID) {
        _this.imgBackgroundID = imgBackgroundID;
    }
    // Function that randomly returns an item from an array
    function getRandomItem(itemArray) {
        return itemArray[Math.floor(Math.random() * itemArray.length)];
    }
    // Function that returns a random number between an inclusive range
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // Functions returned by the module
    return {
        init : init,
        reset : reset,
        addBug : addBug,
        render : render,
        update : update,
        setAllotedTime : setAllotedTime,
        mouseMoveEvent : mouseMoveEvent,
        setBugMakeTimes : setBugMakeTimes,
        setSpriteFoodID : setSpriteFoodID,
        mouseClickEvent : mouseClickEvent,
        bindUpdateTimeFunc : bindUpdateTimeFunc,
        bindUpdateScoreFunc : bindUpdateScoreFunc,
        setImageBackgroundID : setImageBackgroundID
    }
}

// Setup handles the config of the game page and behaviour of DOM elements
function Setup() {
    // Module constants and variables
    const _this = this;
    _this.FPS = 60;
    _this.WIN_LS_HIGHSCORE = 'taptapbug_highscore';
    // DOM element IDs
    _this.ID_CANVAS = '#game-canvas';
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
    _this.sys = null;
    _this.ttbGame = null;
    // Function that initializes tasks to setup the game page and DOM elements
    function init() {
        // Initialize main objects required for the game
        initGameObjects();
        // Initialize game resources
        initResources();
        // Bind unobtrusive event handlers
        bindEventHandlers();
        // Configure TapTapBugGame
        configGame();
        // Initialize GameSystem
        _this.sys.init();
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
    // Function that initializes all the main objects for the game
    function initGameObjects() {
        // Create new ResourceManager, GameSystem and TapTapBugGame objects
        _this.resMan = new ResourceManager();
        _this.ttbGame = new TapTapBugGame();
        _this.sys = new GameSystem(_this.FPS, _this.resMan, _this.ID_CANVAS);
    }
    // Function that adds all of the game resources using the ResourceManager
    function initResources() {
        _this.resMan.addImage('IMG_BG', _this.IMG_BG, 387, 600);
        _this.resMan.addSprite('SPR_FOOD', _this.SPR_FOOD, 896, 56, 16);
        _this.resMan.addSprite('SPR_R_BUG', _this.SPR_R_BUG, 90, 50, 2);
        _this.resMan.addSprite('SPR_O_BUG', _this.SPR_O_BUG, 90, 50, 2);
        _this.resMan.addSprite('SPR_G_BUG', _this.SPR_G_BUG, 90, 50, 2);
    }
    // Function that configures the games attributes
    function configGame() {
        _this.ttbGame.setAllotedTime(60);
        _this.ttbGame.setBugMakeTimes([0.5, 0.9, 1.2]);
        _this.ttbGame.setSpriteFoodID('SPR_FOOD');
        _this.ttbGame.setImageBackgroundID('IMG_BG');
        _this.ttbGame.bindUpdateScoreFunc(updateScore);
        _this.ttbGame.bindUpdateTimeFunc(updateTime);
        _this.ttbGame.addBug('SPR_R_BUG', 3, 2.5, 0.4);
        _this.ttbGame.addBug('SPR_O_BUG', 1, 2, 0.4);
        _this.ttbGame.addBug('SPR_G_BUG', 5, 4, 0.2);
        _this.sys.bindGame(_this.ttbGame);
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
        if (!_this.sys.getIsActive()) {
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
        if (!_this.sys.getIsActive()) {
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
        _this.sys.start();
    }
    // Function that handles the events for the pause / resume button
    function pauseResumeButtonEvent() {
        // Pause the game if the game is running and resume if game is paused
        _this.sys.togglePauseResume();
        // Change the image of the button depending on the state of the game
        if (_this.sys.getIsPaused()) {
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
