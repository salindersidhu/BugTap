// Sprite stores attributes for a sprite sheet such as Image
function Sprite() {
    'use strict';
    // Object attributes
    this.image = null;
    this.numFrames = null;
    this.frameWidth = null;
}

// ResourceManager handles creation and storage of game resources
function ResourceManager() {
    'use strict';
    // Module constants and variables
    var imageDict = {};
    var spriteDict = {};
    // Function that creates and returns a new Image
    function makeImage(src, width, height) {
        var image = new Image();
        image.src = src;
        image.width = width;
        image.height = height;
        return image;
    }
    // Function that creates and stores a new Image with a specific ID
    function addImage(id, source, width, height) {
        imageDict[id] = makeImage(source, width, height);
    }
    // Function that creates and stores a new Sprite with a specific ID
    function addSprite(id, source, width, height, numFrames) {
        var sprite = new Sprite();
        sprite.image = makeImage(source, width, height);
        sprite.numFrames = numFrames;
        sprite.frameWidth = width / numFrames;
        spriteDict[id] = sprite;
    }
    // Function that returns the Image corresponding to an ID
    function getImage(id) {
        return imageDict[id];
    }
    // Function that returns the Sprite corresponding to an ID
    function getSprite(id) {
        return spriteDict[id];
    }
    // Functions returned by the module
    return {
        addImage: addImage,
        getImage: getImage,
        addSprite: addSprite,
        getSprite: getSprite
    };
}

// BoundingBox provides an object an interface for collision detection
function BoundingBox(_x, _y, _width, _height) {
    'use strict';
    // Module constants and variables
    var x = _x;
    var y = _y;
    var width = _width;
    var height = _height;
    // Function returns true if this BoundingBox overlaps other BoundingBox
    function isOverlap(other) {
        return (
            x <= other.getX() &&
            y <= other.getY() &&
            (x + width) >= (other.getX() + other.getWidth()) &&
            (y + height) >= (other.getY() + other.getHeight())
        );
    }
    // Function returns true if BoundingBox intersects with the mouse cursor
    function isOverlapMouse(mouseX, mouseY) {
        return (
            mouseX > x && mouseX < (x + width) &&
            mouseY > y && mouseY < (y + height)
        );
    }
    // Function returns true if this BoundingBox intersects other BoundingBox
    function isIntersect(other) {
        return (
            x <= (other.getX() + other.getWidth()) &&
            (x + width) >= other.getX() &&
            y <= (other.getY() + other.getHeight()) &&
            (y + height) >= other.getY()
        );
    }
    // Function that sets the value of the BoundingBox's x and y positions
    function update(_x, _y) {
        x = _x;
        y = _y;
    }
    // Function that returns the BoundingBox's x position
    function getX() {
        return x;
    }
    // Function that returns the BoundingBox's y position
    function getY() {
        return y;
    }
    // Function that returns the width of the BoundingBox
    function getWidth() {
        return width;
    }
    // Function that returns the height of the BoundingBox
    function getHeight() {
        return height;
    }
    // Functions returned by the module
    return {
        getX: getX,
        getY: getY,
        update: update,
        getWidth: getWidth,
        getHeight: getHeight,
        isOverlap: isOverlap,
        isIntersect: isIntersect,
        isOverlapMouse: isOverlapMouse
    };
}

// SpriteAnimation handles control and rendering of animations
function SpriteAnimation(sprite, initFrame, _TPF) {
    'use strict';
    // Module constants and variables
    var TPF = _TPF;
    var image = sprite.image;
    var width = sprite.image.width;
    var frameWidth = sprite.frameWidth;
    var height = sprite.image.height;
    var numFrames = sprite.numFrames;
    var opacity = 1;
    var frameIndex = initFrame;
    var tickCounter = 0;
    // Function that returns the opacity of the SpriteAnimation
    function getOpacity() {
        return opacity;
    }
    // Function that reduces the opacity of the SpriteAnimation
    function reduceOpacity(FPS, fadeSpeed) {
        opacity -= 1 / (FPS * fadeSpeed);
        if (opacity < 0) {
            opacity = 0;
        }
    }
    // Function that updates the frame index of the SpriteAnimation
    function update() {
        tickCounter += 1;
        // Update the frame index when the timer has triggered
        if (tickCounter > TPF) {
            tickCounter = 0;
            // Update and reset the frame index at the end of the animation
            frameIndex = (frameIndex + 1) % numFrames;
        }
    }
    // Function that draws the SpriteAnimation
    function render(ctx, x, y, angle) {
        // Configure the translation points to center of image when rotating
        var translateX = x + (width / (2 * numFrames));
        var translateY = y + (height / 2);
        // Save current state of the canvas
        ctx.save();
        // Configure the canvas opacity
        ctx.globalAlpha = opacity;
        // Translate and rotate canvas to draw the animated Sprite at an angle
        ctx.translate(translateX, translateY);
        ctx.rotate(angle);
        ctx.translate(-translateX, -translateY);
        // Draw the animated Sprite
        ctx.drawImage(
            image,
            frameIndex * frameWidth,
            0,
            frameWidth,
            height,
            x,
            y,
            frameWidth,
            height
        );
        // Restore the canvas to the previous state
        ctx.restore();
    }
    // Functions returned by the module
    return {
        update: update,
        render: render,
        getOpacity: getOpacity,
        reduceOpacity: reduceOpacity
    };
}

// GameSystem handles the core Game event management and rendering tasks
function GameSystem(_FPS, _canvasID) {
    'use strict';
    // Module constants and variables
    var FPS = _FPS;
    var canvasID = _canvasID;
    var isGamePaused = false;
    var isGameActive = false;
    var definedGame = null;
    var resourceManager = new ResourceManager();
    // Function that initializes the GameSystem
    function init() {
        // Obtain the canvas and canvas context from the DOM
        var canvas = $(canvasID).get(0);
        var ctx = canvas.getContext('2d');
        // Add event listener for mouse click events to the canvas
        canvas.addEventListener('mousedown', function () {
            mouseClickEvents(event, canvas);
        }, false);
        // Add event listener for mouse move events to the canvas
        canvas.addEventListener('mousemove', function () {
            mouseMoveEvents(event, canvas);
        }, false);
        // Initialize the defined game module
        definedGame.init(FPS, resourceManager, ctx, canvas, isGamePaused);
        // Execute the GameSystem event loop indefinitely
        setInterval(gameSystemLoop, 1000 / FPS);
    }
    // Function that continuously updates and renders the GameSystem
    function gameSystemLoop() {
        if (isGameActive && !isGamePaused) {
            // Update the bound game module
            definedGame.update();
            // Render the defined game module
            definedGame.render();
        }
    }
    // Function that handles all of the mouse click events for GameSystem
    function mouseClickEvents(event, canvas) {
        // Process mouse click events if GameSystem is active and not paused
        if (isGameActive && !isGamePaused) {
            // Obtain the mouse coordinates relative to the canvas
            var mouseX = event.pageX - canvas.offsetLeft;
            var mouseY = event.pageY - canvas.offsetTop;
            // Trigger defined game module's mouse click event
            definedGame.mouseClickEvent(mouseX, mouseY);
        }
    }
    // Function that handles all of the mouse move events for GameSystem
    function mouseMoveEvents(event, canvas) {
        // Process mouse move events if GameSystem is active and not paused
        if (isGameActive && !isGamePaused) {
            // Obtain the mouse coordinates relative to the canvas
            var mouseX = event.pageX - canvas.offsetLeft;
            var mouseY = event.pageY - canvas.offsetTop;
            // Trigger defined game module's mouse move event
            definedGame.mouseMoveEvent(mouseX, mouseY);
        }
    }
    // Function that returns the GameSystem's ResourceManager
    function getResourceManager() {
        return resourceManager;
    }
    // Function that toggles the GameSystem's state between paused or running
    function togglePause() {
        isGamePaused = !isGamePaused;
    }
    // Function that returns if the GameSystem is paused
    function isPaused() {
        return isGamePaused;
    }
    // Function that returns if the GameSystem has started
    function isActive() {
        return isGameActive;
    }
    // Function that officially starts the GameSystem
    function start() {
        // Reset the defined game module
        definedGame.reset();
        isGameActive = true;
    }
    // Function that officially stops the GameSystem
    function stop() {
        isGameActive = false;
    }
    // Function that binds a defined game module to the GameSystem
    function bindGame(game) {
        definedGame = game;
    }
    // Functions returned by the module
    return {
        init: init,
        stop: stop,
        start: start,
        bindGame: bindGame,
        isPaused: isPaused,
        isActive: isActive,
        togglePause: togglePause,
        getResourceManager: getResourceManager
    };
}

// PointUpText draws text which scrolls upwards and fades out
function PointUpText(_text, _font, _colour, _upSpeed, _fadeSpeed, _x, _y) {
    'use strict';
    // Module constants and variables
    var text = _text;
    var font = _font;
    var colour = _colour;
    var upSpeed = _upSpeed;
    var fadeSpeed = _fadeSpeed;
    var x = _x;
    var y = _y;
    var opacity = 1;
    var varCanDelete = false;
    // Function that updates the PointUpText's opacity and movement
    function update(FPS) {
        // Move the PointUpText upwards
        y -= upSpeed;
        // Reduce opacity until 0, then set delete flag to true
        opacity -= 1 / (FPS * fadeSpeed);
        if (opacity < 0) {
            opacity = 0;
            varCanDelete = true;
        }
    }
    // Function that draws the PointUpText
    function render(ctx) {
        // Save current state of the canvas
        ctx.save();
        // Draw the point text on the canvas
        ctx.font = font;
        ctx.fillStyle = colour;
        ctx.fillText(text, x, y);
        // Restore the canvas to the previous state
        ctx.restore();
    }
    // Function that returns true if object can be deleted, false otherwise
    function canDelete() {
        return varCanDelete;
    }
    // Functions returned by the module
    return {
        update: update,
        render: render,
        canDelete: canDelete
    };
}

// Food handles event management and rendering tasks for Food
function Food(sprite, selectedFrame, _x, _y) {
    'use strict';
    // Module constants and variables
    var animation = new SpriteAnimation(sprite, selectedFrame, 0);
    var bBox = new BoundingBox(x, y, sprite.frameWidth, sprite.image.height);
    var x = _x;
    var y = _y;
    var varIsEaten = false;
    var varCanDelete = false;
    // Function that handles updating the Food's state
    function update(FPS) {
        // If Food has been eaten then fade it out within half a second
        if (varIsEaten) {
            animation.reduceOpacity(FPS, 0.5);
            // Set the Food delete flag to true once the Food has faded
            if (animation.getOpacity() === 0) {
                varCanDelete = true;
            }
        }
    }
    // Function that handles drawing the Object
    function render(ctx) {
        animation.render(ctx, x, y, 0);
    }
    // Function that returns if the Food has been eaten
    function isEaten() {
        return varIsEaten;
    }
    // Function that sets the state of the Food to eaten
    function setEaten() {
        varIsEaten = true;
    }
    // Function that returns true if Food can be deleted, false otherwise
    function canDelete() {
        return varCanDelete;
    }
    // Function that returns the Food's bounding box
    function getBox() {
        return bBox;
    }
    // Functions returned by the module
    return {
        getBox: getBox,
        update: update,
        render: render,
        isEaten: isEaten,
        setEaten: setEaten,
        canDelete: canDelete
    };
}

// TapTapBugGame handles event management and rendering tasks for TapTapBugGame
function TapTapBugGame() {
    'use strict';
    // Module constants and variables
    var FPS = null;
    var ctx = null;
    var canvas = null;
    var resourceManager = null;
    var bgPattern = null;
    var isGamePaused = null;
    var isGameOver = null;
    var sprFoodID = null;
    var mouseX = null;
    var mouseY = null;
    var score = null;
    var timeTicks = null;
    var remainingTime = null;
    var defaultAllotedTime = null;
    var bgPattern = null;
    var bugSpawnTimes = [];
    var bugSpwanProbs = [];
    var bugDB = {};
    var resourceIDs = {'FOOD': null, 'BACKGROUND': null};
    var gameObjects = {'BUGS': [], 'FOOD': [], 'POINTS': []};
    var eventFunctions = {'UPDATESCORE': null, 'UPDATETIME': null,
            'GAMEOVER': null};
    var foodSpawnSettings = {'AMOUNT': 0, 'STARTX': 0, 'ENDX': 0, 'STARTY': 0,
            'ENDY': 0, 'SPREADX': 0, 'SPREADY': 0};
    // Function that initializes TapTapBugGame
    function init(_FPS, _resourceManager, _ctx, _canvas, _isGamePaused) {
        // Set game variables
        FPS = _FPS;
        resourceManager = _resourceManager;
        ctx = _ctx;
        canvas = _canvas;
        isGamePaused = _isGamePaused;
        // Set the game's background
        var bgImage = resourceManager.getImage(resourceIDs.BACKGROUND);
        bgImage.onload = function () {
            // Create a pattern using the background Image
            bgPattern = ctx.createPattern(bgImage, 'repeat');
        };
        // Set the Bug spawn probability distribution
        Object.keys(bugDB).forEach(function (key) {
            var spawnProbs = [];
            spawnProbs.length = bugDB[key].WEIGHT * 10;
            // Append Bug ID equal to the weight of the Bug's spawn probability
            bugSpwanProbs = bugSpwanProbs.concat(spawnProbs.fill(key));
        });
    }
    // Function that resets the game variables to their default values
    function reset() {
        // Set default initialized values
        remainingTime = defaultAllotedTime;
        // Set default instance values
        timeTicks = 0;
        isGameOver = 0;
        // Clear all game objects
        Object.keys(gameObjects).forEach(function (key) {
            gameObjects[key] = [];
        });
        // Set default states and objects
        setScore(0);
        spawnFood();
    }
    // Function that handle all update tasks for TapTapBugGame
    function update() {
        // If game is not over update remaining time and spawn Bugs
        if (!isGameOver) {
            updateTime();
        }
        // Update the canvas cursor when hovering over a Bug
        updateCanvasCursor();
        // Handle game over event for TapTapBugGame
        updateGameOver();
        // Update all of the Food objects
        gameObjects.FOOD.forEach(function (food) {
            food.update(FPS);
            updateDeleteObject('FOOD', food);
        });
        // Update all of the Point objects
        gameObjects.POINTS.forEach(function (point) {
            point.update(FPS);
            updateDeleteObject('POINTS', point);
        });
    }
    // Function that handles all drawing tasks for TapTapBugGame
    function render() {
        // Render the Game's background
        ctx.fillStyle = bgPattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Render all of the game objects
        Object.keys(gameObjects).forEach(function (key) {
            gameObjects[key].forEach(function (gameObj) {
                gameObj.render(ctx);
            });
        });
    }
    // Function that spawns a specific amount of Food positioned randomly
    function spawnFood() {
        var foodCount = 0;
        var usedFrames = [];
        var usedPos = [];
        var randFrame = null;
        var isOverlap = null;
        var x = null;
        var y = null;
        // Obtain the Food's Sprite, frame width, height and number of frames
        var foodSprite = resourceManager.getSprite(resourceIDs.FOOD);
        var foodWidth = foodSprite.frameWidth;
        var foodHeight = foodSprite.image.height;
        var foodFrames = foodSprite.numFrames;
        // Generate Food with specific frame index within a specific range
        while (foodCount < foodSpawnSettings.AMOUNT) {
            // Generate random positions specified by the bound variables
            x = getRandomNumber(
                foodSpawnSettings.STARTX,
                foodSpawnSettings.ENDX
            );
            y = getRandomNumber(
                foodSpawnSettings.STARTY,
                foodSpawnSettings.ENDY
            );
            // Generate a random frame index for the Food's Sprite image
            randFrame = getRandomNumber(0, foodFrames - 1);
            isOverlap = false;
            // Ensure new position doesn't overlap with previous positions
            usedPos.forEach(function (position) {
                if (
                    Math.abs(x - position.x) <= (
                        foodWidth + foodSpawnSettings.SPREADX
                    ) &&
                    Math.abs(y - position.y) <= (
                        foodHeight + foodSpawnSettings.SPREADY
                    )
                ) {
                    // Break loop if position constraints are not met
                    isOverlap = true;
                    return;
                }
            });
            // Create Food if there is no overlap
            if (!isOverlap) {
                // Ensure that a new frame index is generated for each Food
                while (usedFrames.indexOf(randFrame) >= 0) {
                    // Use existing index if all frame indicies are used
                    if (usedFrames.length === foodSprite.numFrames) {
                        randFrame = getRandomItem(usedFrames);
                    } else {
                        randFrame = getRandomNumber(0, foodFrames - 1);
                    }
                }
                gameObjects.FOOD.push(new Food(foodSprite, randFrame, x, y));
                usedPos.push({'x': x, 'y': y});
                // Add the new frame index to used list if it doesn't exist
                if (usedFrames.indexOf(randFrame) < 0) {
                    usedFrames.push(randFrame);
                }
                foodCount += 1;
            }
        }
    }
    // Function that handles all mouse click tasks for TapTapBugGame
    function mouseClickEvent(mouseX, mouseY) {
        // Handle mouse clicks on Bug objects
        gameObjects.BUGS.forEach(function (bug) {
            // If mouse cursor is hovering over the Bug
            if (bug.getBox().isOverlapMouse(mouseX, mouseY)) {
                // Update score only once
                if (!bug.isDead()) {
                    score += bug.getPoints();
                    setScore(score);
                }
                // Kill the Bug
                bug.setDead();
            }
        });
    }
    // Function that handles all mouse move tasks for TapTapBugGame
    function mouseMoveEvent(_mouseX, _mouseY) {
        // Store the mouse coordinates when the mouse has moved
        mouseX = _mouseX;
        mouseY = _mouseY;
    }
    // Function that updates the canvas cursor when hovering over a Bug
    function updateCanvasCursor() {
        gameObjects.BUGS.forEach(function (bug) {
            // If hovering over Bug then change cursor to 'pointer' and break
            if (bug.getBox().isOverlapMouse(mouseX, mouseY)) {
                $('body').addClass('pointer-cursor');
                return;
            }
            // Change the cursor back to 'hovering' when hot hovering over Bug
            $('body').removeClass('pointer-cursor');
        });
    }
    // Function that handles the game over event for TapTapBugGame
    function updateGameOver() {
        // Game is over when the timer expires or all of the Food is eaten
        if (remainingTime < 1 || gameObjects.FOOD.length < 1) {
            isGameOver = true;
        }
        // If game is over and all Bugs are dead then call game over event
        if (isGameOver && gameObjects.BUGS.length < 1) {
            // If the timer expired then player has won
            if (remainingTime < 1) {
                eventFunctions.GAMEOVER(score, true);
            } else {
                eventFunctions.GAMEOVER(score, false);
            }
        }
    }
    // Function that handles completly deleting a game object
    function updateDeleteObject(type, gameObj) {
        if (gameObj.canDelete()) {
            // Remove the game object from the game object array
            gameObjects[type].splice(
                gameObjects[type].indexOf(gameObj),
                1
            );
            // Nullify the game object
            gameObj = null;
        }
    }
    // Function that adds new info about a Bug to the Bug database
    function addBugToDB(bugSpriteID, points, speed, weight) {
        bugDB[bugSpriteID] = {'POINTS': points, 'SPEED': speed,
                'WEIGHT': weight};
    }
    // Function that sets the amount of time alloted for the game
    function setAllotedTime(allotedTime) {
        defaultAllotedTime = allotedTime + 1;
    }
    // Function that sets the spawn times for the Bug
    function setBugSpawnTimes(spawnTimes) {
        bugSpawnTimes = spawnTimes;
    }
    // Function that sets the range to spawn and position the Food
    function setFoodSpawnRange(startX, endX, startY, endY) {
        foodSpawnSettings.STARTX = startX;
        foodSpawnSettings.ENDX = endX;
        foodSpawnSettings.STARTY = startY;
        foodSpawnSettings.ENDY = endY;
    }
    // Function that sets the spread values for positioning Food apart
    function setFoodSpread(spreadX, spreadY) {
        foodSpawnSettings.SPREADX = spreadX;
        foodSpawnSettings.SPREADY = spreadY;
    }
    // Function that sets the amount of Food to make for the game
    function setFoodAmount(amountFood) {
        foodSpawnSettings.AMOUNT = amountFood;
    }
    // Function that sets the score and calls the score update function
    function setScore(_score) {
        score = _score;
        eventFunctions.UPDATESCORE(score);
    }
    // Function that updates remaining time and calls the time update function
    function updateTime() {
        remainingTime -= 1 / FPS;
        eventFunctions.UPDATETIME(Math.floor(remainingTime));
    }
    // Function that sets the update score text function for the game
    function setUpdateScoreEvent(updateScoreEvent) {
        eventFunctions.UPDATESCORE = updateScoreEvent;
    }
    // Function that sets the update time text function for the game
    function setUpdateTimeEvent(updateTimeEvent) {
        eventFunctions.UPDATETIME = updateTimeEvent;
    }
    // Function that sets the game over event function for the game
    function setGameOverEvent(gameOverEvent) {
        eventFunctions.GAMEOVER = gameOverEvent;
    }
    // Function that sets the Sprite ID for the Food
    function setSpriteFoodID(spriteFoodID) {
        resourceIDs.FOOD = spriteFoodID;
    }
    // Function that sets the background Image ID for the game
    function setBgImageID(bgImageID) {
        resourceIDs.BACKGROUND = bgImageID;
    }
    // Function that randomly returns an item from an array
    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    // Function that returns a random number between an inclusive range
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // Functions returned by the module
    return {
        init: init,
        reset: reset,
        render: render,
        update: update,
        addBugToDB: addBugToDB,
        setBgImageID: setBgImageID,
        setFoodAmount: setFoodAmount,
        setFoodSpread: setFoodSpread,
        mouseMoveEvent: mouseMoveEvent,
        setAllotedTime: setAllotedTime,
        mouseClickEvent: mouseClickEvent,
        setSpriteFoodID: setSpriteFoodID,
        setBugSpawnTimes: setBugSpawnTimes,
        setGameOverEvent: setGameOverEvent,
        setFoodSpawnRange: setFoodSpawnRange,
        setUpdateTimeEvent: setUpdateTimeEvent,
        setUpdateScoreEvent: setUpdateScoreEvent
    };
}

// Setup handles the config of the game page and behaviour of DOM elements
function Setup() {
    'use strict';
    // Module constants and variables
    var FPS = 60;
    var WIN_LS_HIGHSCORE = 'taptapbug_highscore';
    // DOM element IDs
    var ID_CANVAS = '#game-canvas';
    var ID_SCORE_LINK = '#score-link';
    var ID_HOME_LINK = '#home-link';
    var ID_BUTTON_CLEAR = '#clear-button';
    var ID_BUTTON_RETRY = '#retry-button';
    var ID_BUTTON_PLAY = '#play-button';
    var ID_BUTTON_PAUSE_RESUME = '#pause-resume-button';
    var ID_HEADING_SCORE = '#score-heading';
    var ID_SCORE_SECTION = '#score-section';
    var ID_HOME_SECTION = '#home-section';
    var ID_GAME_SECTION = '#game-section';
    var ID_SCORE_TEXT = '#score-text';
    var ID_TIME_TEXT = '#time-text';
    var ID_LOST_MSG = '#game-lose-message';
    var ID_WON_MSG = '#game-won-message';
    // Resource element IDs
    var IMG_BUTTON_PLAY = 'assets/button_play.png';
    var IMG_BUTTON_PAUSE = 'assets/button_pause.png';
    var IMG_BG = 'assets/background_table.png';
    var SPR_FOOD = 'assets/food_sprite.png';
    var SPR_R_BUG = 'assets/red_bug_sprite.png';
    var SPR_O_BUG = 'assets/orange_bug_sprite.png';
    var SPR_G_BUG = 'assets/grey_bug_sprite.png';
    // Instance variables
    var sys = null;
    var game = null;
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
        sys.init();
    }
    // Function that binds event functions to specific links and buttons
    function bindEventHandlers() {
        $(ID_SCORE_LINK).click(function () {
            navScoreEvent();
        });
        $(ID_HOME_LINK).click(function () {
            navHomeEvent();
        });
        $(ID_BUTTON_RETRY).click(function () {
            retryButtonEvent();
        });
        $(ID_BUTTON_CLEAR).click(function () {
            clearScoreButtonEvent();
        });
        $(ID_BUTTON_PLAY).click(function () {
            playGameButtonEvent();
        });
        $(ID_BUTTON_PAUSE_RESUME).click(function () {
            pauseResumeButtonEvent();
        });
    }
    // Function that initializes all the main objects for the game
    function initGameObjects() {
        // Create new ResourceManager, GameSystem and TapTapBugGame objects
        game = new TapTapBugGame();
        sys = new GameSystem(FPS, ID_CANVAS);
    }
    // Function that adds all of the game resources using the ResourceManager
    function initResources() {
        sys.getResourceManager().addImage('IMG_BG', IMG_BG, 387, 600);
        sys.getResourceManager().addSprite('SPR_FOOD', SPR_FOOD, 896, 56, 16);
        sys.getResourceManager().addSprite('SPR_R_BUG', SPR_R_BUG, 90, 50, 2);
        sys.getResourceManager().addSprite('SPR_O_BUG', SPR_O_BUG, 90, 50, 2);
        sys.getResourceManager().addSprite('SPR_G_BUG', SPR_G_BUG, 90, 50, 2);
    }
    // Function that configures the games attributes
    function configGame() {
        game.setAllotedTime(60);
        game.setFoodAmount(6);
        game.setFoodSpread(30, 30);
        game.setBugSpawnTimes([0.5, 0.9, 1.2]);
        game.setFoodSpawnRange(10, 320, 125, 380);
        game.setSpriteFoodID('SPR_FOOD');
        game.setBgImageID('IMG_BG');
        game.setUpdateScoreEvent(updateScore);
        game.setUpdateTimeEvent(updateTime);
        game.setGameOverEvent(gameOverEvent);
        game.addBugToDB('SPR_R_BUG', 3, 2.5, 0.3);
        game.addBugToDB('SPR_O_BUG', 1, 1.5, 0.5);
        game.addBugToDB('SPR_G_BUG', 5, 4, 0.2);
        sys.bindGame(game);
    }
    // Function that updates the score text
    function updateScore(score) {
        $(ID_SCORE_TEXT).text('Score: ' + score);
    }
    // Function that updates the time text
    function updateTime(time) {
        $(ID_TIME_TEXT).text('Time: ' + time);
    }
    // Function that handles events for when TapTapBugGame is finished
    function gameOverEvent(score, isWin) {
        // Stop the GameSystem
        sys.stop();
        // Navigate to score page
        navScoreEvent();
        // Hide the game page section and show the retry button
        $(ID_GAME_SECTION).hide();
        $(ID_BUTTON_RETRY).show();
        // If user has won display win message, otherwise display lose message
        if (isWin) {
            $(ID_WON_MSG).show();
            // saves score to local storage if it's larger than previous score
            if (score > getScore()) {
                window.localStorage.setItem(WIN_LS_HIGHSCORE, score);
                // Update high score heading
                $(ID_HEADING_SCORE).text('New High Score: ' + score);
            }
        } else {
            $(ID_LOST_MSG).show();
        }
    }
    // Function that handles the events for the score navigation link
    function navScoreEvent() {
        // Call events if game is not running
        if (!sys.isActive()) {
            // Set score link item to active and home link item to inactive
            $(ID_SCORE_LINK).addClass('active');
            $(ID_HOME_LINK).removeClass('active');
            // Hide the home page section and show the score page section
            $(ID_HOME_SECTION).hide();
            $(ID_SCORE_SECTION).show();
            // Refresh displayed score
            refreshScore();
        }
    }
    // Function that handles the events for the home navigation link
    function navHomeEvent() {
        // Call events if game is not running
        if (!sys.isActive()) {
            // Set home link item to active and score link item to inactive
            $(ID_HOME_LINK).addClass('active');
            $(ID_SCORE_LINK).removeClass('active');
            // Hide the score page section and show the home page section
            $(ID_SCORE_SECTION).hide();
            $(ID_HOME_SECTION).show();
            // Hide the win and lose messages and the retry button
            $(ID_WON_MSG).hide();
            $(ID_LOST_MSG).hide();
            $(ID_BUTTON_RETRY).hide();
        }
    }
    // Function that handles the events for the retry button
    function retryButtonEvent() {
        navHomeEvent();
        playGameButtonEvent();
    }
    // Function that handles the events for the play game button
    function playGameButtonEvent() {
        // Hide the home page section and show the game page section
        $(ID_HOME_SECTION).hide();
        $(ID_GAME_SECTION).show();
        // Start the GameSystem
        sys.start();
    }
    // Function that handles the events for the pause / resume button
    function pauseResumeButtonEvent() {
        // Pause the game if the game is running and resume if game is paused
        sys.togglePause();
        // Change the image of the button depending on the state of the game
        if (sys.isPaused()) {
            $(ID_BUTTON_PAUSE_RESUME + ' img').attr('src', IMG_BUTTON_PLAY);
        } else {
            $(ID_BUTTON_PAUSE_RESUME + ' img').attr('src', IMG_BUTTON_PAUSE);
        }
    }
    // Function that handles the events for the clear score button
    function clearScoreButtonEvent() {
        window.localStorage.removeItem(WIN_LS_HIGHSCORE);
        // Refresh displayed score
        refreshScore();
    }
    // Function that updates the score heading with score from local storage
    function refreshScore() {
        // Obtain the highScore from local storage and use 0 as default value
        $(ID_HEADING_SCORE).text('High Score: ' + getScore());
    }
    // Function that return the highscore entry from local storage
    function getScore() {
        // Obtain the score, use 0 if score does not exist
        var rawScore = window.localStorage.getItem(WIN_LS_HIGHSCORE);
        return rawScore || 0;
    }
    // Functions returned by the module
    return {
        init: init
    };
}

// Setup the game page and DOM element events
window.onload = new Setup().init;
