/*jshint browser:true, jquery:true, quotmark:single, maxlen:80, eqeqeq:true,
strict:true, unused:true, undef:true*/
/*jslint browser:true, this:true, maxlen:80*/
/*global $, window, GW*/

// PointUpText draws text which scrolls upwards and fades out
function PointUpText(text, font, colour, moveSpeed, fadeSpeed, x, y) {
    'use strict';
    // Module constnts and variables
    var superModule = new GW.GameObject();
    var _this = this;
    _this.x = x;
    _this.y = y;
    _this.moveSpeed = moveSpeed;
    _this.fadingText = new GW.FadingText(text, font, colour, fadeSpeed);
    _this.fadingText.setOutline('black', 6);
    // Function that updates the PointUpText
    superModule.update = function (FPS) {
        // Move the PointUpText upwards (towards the top of the screen)
        _this.y -= _this.moveSpeed;
        _this.fadingText.update(FPS);
        // If the text has faded then set delete flag to true
        if (_this.fadingText.getOpacity() === 0) {
            superModule.flagToDelete();
        }
    };
    // Function that renders the PointUpText
    superModule.render = function (ctx) {
        _this.fadingText.render(ctx, _this.x, _this.y, 0);
    };
    // Function returned by the module
    return superModule;
}

// Food handles event management and rendering tasks for Food
function Food(sprite, selectedFrame, x, y) {
    'use strict';
    // Module constants and variables
    var superModule = new GW.GameObject();
    var _this = this;
    _this.x = x;
    _this.y = y;
    _this.isEaten = false;
    _this.animation = new GW.SpriteAnimation(sprite, 0, selectedFrame);
    _this.bBox = new GW.BoundingBox(x, y, sprite.frameWidth,
            sprite.image.height);
    // Function that handles updating the Food's state
    superModule.update = function (FPS) {
        // If Food has been eaten then fade it out within half a second
        if (_this.isEaten) {
            _this.animation.reduceOpacity(FPS, 0.5);
            // Set the Food delete flag once the Food has faded
            if (_this.animation.getOpacity() === 0) {
                superModule.flagToDelete();
            }
        }
    };
    // Function that handles drawing the Object
    superModule.render = function (ctx) {
        _this.animation.render(ctx, _this.x, _this.y, 0);
    };
    // Function that returns if the Food has been eaten
    superModule.isEaten = function () {
        return _this.isEaten;
    };
    // Function that sets the state of the Food to eaten
    superModule.setEaten = function () {
        _this.isEaten = true;
    };
    // Function that returns the Food's bounding box
    superModule.getBox = function () {
        return _this.bBox;
    };
    // Function returned by the module
    return superModule;
}

// Bug handles all event management and rendering tasks for Bug
function Bug(sprite, points, speed, x, y) {
    'use strict';
    // Module constants and variables
    var superModule = new GW.GameObject();
    var _this = this;
    _this.x = x;
    _this.y = y;
    _this.angle = 0;
    _this.moveToX = 0;
    _this.moveToY = 0;
    _this.speed = speed;
    _this.isDead = false;
    _this.points = points;
    _this.width = sprite.frameWidth;
    _this.height = sprite.image.height;
    _this.animation = new GW.SpriteAnimation(sprite, 10 / speed);
    _this.bBox = new GW.BoundingBox(x, y, sprite.frameWidth,
            sprite.image.height);
    // Function that moves the Bug's position to a specific target point
    function moveToPoint(targetX, targetY) {
        // Calculate the distance to the target point
        var distX = targetX - _this.x - (_this.width / 2);
        var distY = targetY - _this.y - (_this.height / 2);
        // Calculate the hypotenuse
        var hypotenuse = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
        distX /= hypotenuse;
        distY /= hypotenuse;
        // Move towards point
        _this.x += distX * speed;
        _this.y += distY * speed;
        // Update the Bug's angle depending on the movement direction
        _this.angle = Math.atan2(distY, distX);
    }
    // Function that moves the Bug to the position of the nearest Food
    function moveBugToFood(foodObjects) {
        var shortestDistance = Number.MAX_VALUE;
        // If there is no avaliable Food to eat then move outside the table
        if (foodObjects.length === 1 && foodObjects[0].isEaten()) {
            // Set the Bug move coordinates to the initial instance coordinates
            _this.moveToX = x;
            _this.moveToY = y;
        } else {
            // Find the nearest piece of Food from the Bug's current position
            foodObjects.forEach(function (food) {
                // Ensure that the Food has not been eaten
                if (!food.isEaten()) {
                    // Calculate the distance between the Bug and Food
                    var foodBox = food.getBox();
                    var foodX = foodBox.getX() + (foodBox.getWidth() / 2);
                    var foodY = foodBox.getY() + (foodBox.getHeight() / 2);
                    var distX = foodX - x;
                    var distY = foodY - y;
                    // Calculate the hypotenuse to find the shortest distance
                    var hypotenuse = Math.sqrt(
                        Math.pow(distX, 2) + Math.pow(distY, 2)
                    );
                    // If hypotenuse is shorter than current shortest distance
                    if (hypotenuse < shortestDistance) {
                        // Set mouse move coordinates to Food's position
                        _this.moveToX = foodX;
                        _this.moveToY = foodY;
                        shortestDistance = hypotenuse;
                    }
                }
            });
        }
        // Move the Bug to a specific position
        moveToPoint(_this.moveToX, _this.moveToY);
    }
    // Function that handles updating the Bug's state
    superModule.update = function (FPS, foodObjects) {
        // Update the Bug if it is alive
        if (!_this.isDead) {
            // Move the Bug to a specific target position
            moveBugToFood(foodObjects);
            // Update the Bug's animation
            _this.animation.update(FPS);
            // Update the bounding box position
            _this.bBox.update(_this.x, _this.y);
        } else {
            // Fade the Bug within 2 seconds
            _this.animation.reduceOpacity(FPS, 2);
            // Set the Bug delete flag once the Bug has faded
            if (_this.animation.getOpacity() === 0) {
                superModule.flagToDelete();
            }
        }
    };
    // Function that handles drawing the Bug
    superModule.render = function (ctx) {
        _this.animation.render(ctx, _this.x, _this.y, _this.angle);
    };
    // Function that returns the Food's bounding box
    superModule.getBox = function () {
        return _this.bBox;
    };
    // Function that sets the state of the Bug to dead
    superModule.setDead = function () {
        _this.isDead = true;
    };
    // Function that returns if the Bug has been killed
    superModule.isDead = function () {
        return _this.isDead;
    };
    // Return the number of points the Bug is worth
    superModule.getPoints = function () {
        return _this.points;
    };
    // Function returned by the module
    return superModule;
}

// TapTapBugGame handles event management and rendering tasks for TapTapBugGame
function TapTapBugGame() {
    'use strict';
    // Module constants and variables
    var FPS = null;
    var ctx = null;
    var canvas = null;
    var isGamePaused = null;
    var isGameOver = null;
    var mouseX = null;
    var mouseY = null;
    var score = null;
    var timeTicks = null;
    var remainingTime = null;
    var defaultAllotedTime = null;
    var bgPattern = null;
    var bugSpawnTime = null;
    var bugSpawnTimes = [];
    var bugSpwanProbs = [];
    var bugDB = {};
    var resourceIDs = {'FOOD': null, 'BACKGROUND': null};
    var gameObjects = {'BUGS': [], 'FOOD': [], 'POINTS': []};
    var eventFunctions = {'UPDATESCORE': null, 'UPDATETIME': null,
            'GAMEOVER': null};
    var foodSettings = {'AMOUNT': 0, 'STARTX': 0, 'ENDX': 0, 'STARTY': 0,
            'ENDY': 0, 'SPREADX': 0, 'SPREADY': 0, 'POINTS': 0};
    // Function that initializes TapTapBugGame
    function init(framesPerSecond, canvasContext, gameCanvas, gamePaused) {
        // Set game variables
        FPS = framesPerSecond;
        ctx = canvasContext;
        canvas = gameCanvas;
        isGamePaused = gamePaused;
        // Set the game's background
        var bgImg = GW.ResourceManager.getImage(resourceIDs.BACKGROUND);
        bgImg.onload = function () {
            // Create a pattern using the background Image
            bgPattern = ctx.createPattern(bgImg, 'repeat');
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
    var awardPoints = GW.Utils.once(function () {
        gameObjects.FOOD.forEach(function (food) {
            score += foodSettings.POINTS;
            setScore(score);
            showPointsGained(foodSettings.POINTS, food);
        });
    });
    // Function that handle all update tasks for TapTapBugGame
    function update() {
        // If game is not over update remaining time and spawn Bugs
        if (!isGameOver) {
            updateTime();
            spawnBugs();
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
        // Update all of the Bug objects
        gameObjects.BUGS.forEach(function (bug) {
            bug.update(FPS, gameObjects.FOOD);
            // Handle all collisions between Bugs and Food
            gameObjects.FOOD.forEach(function (food) {
                // Ensure that current Food has not been eaten
                if (!food.isEaten()) {
                    // Check if the Bug is colliding with a Food object
                    if (food.getBox().isOverlap(bug.getBox())) {
                        // Set Food to eaten and display points lost
                        food.setEaten();
                        score -= foodSettings.POINTS;
                        setScore(score);
                        showPointsLost(foodSettings.POINTS, food);
                    }
                }
            });
            updateDeleteObject('BUGS', bug);
            // If the game is over then kill this Bug
            if (isGameOver) {
                bug.setDead();
            }
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
        gameObjects.FOOD.concat(gameObjects.BUGS).concat(gameObjects.POINTS)
            .forEach(function (obj) {
                obj.render(ctx);
            });
    }
    // Function that spawns a random Bug from the Bug Database
    function spawnBugs() {
        timeTicks = timeTicks + 1;
        // If Bug spawn timer has expired
        if (timeTicks > bugSpawnTime * FPS) {
            // Reset the Bug spawn timer
            timeTicks = 0;
            bugSpawnTime = GW.Utils.randomItem(bugSpawnTimes);
            // Configure the Bug using randomly chosen attributes
            var spriteID = GW.Utils.randomItem(bugSpwanProbs);
            var points = bugDB[spriteID].POINTS;
            var speed = bugDB[spriteID].SPEED;
            var sprite = GW.ResourceManager.getSprite(spriteID);
            var width = sprite.frameWidth;
            var height = sprite.image.height;
            var x = GW.Utils.randomNumber(width, canvas.width - width);
            var y = GW.Utils.randomItem([0 - height, canvas.height + height]);
            // Create a new Bug using the above attributes
            gameObjects.BUGS.push(new Bug(sprite, points, speed, x, y));
        }
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
        var foodSprite = GW.ResourceManager.getSprite(resourceIDs.FOOD);
        var foodWidth = foodSprite.frameWidth;
        var foodHeight = foodSprite.image.height;
        var foodFrames = foodSprite.numFrames;
        // Nested function that checks if Food overlaps with previous Food
        function checkFoodOverlap(pos) {
            return (
                Math.abs(x - pos.x) <= (foodWidth + foodSettings.SPREADX) &&
                Math.abs(y - pos.y) <= (foodHeight + foodSettings.SPREADY)
            );
        }
        // Generate Food with specific frame index within a specific range
        while (foodCount < foodSettings.AMOUNT) {
            // Generate random positions specified by the bound variables
            x = GW.Utils.randomNumber(foodSettings.STARTX, foodSettings.ENDX);
            y = GW.Utils.randomNumber(foodSettings.STARTY, foodSettings.ENDY);
            // Generate a random frame index for the Food's Sprite image
            randFrame = GW.Utils.randomNumber(0, foodFrames - 1);
            // Ensure new position doesn't overlap with previous positions
            isOverlap = usedPos.some(checkFoodOverlap);
            // Create Food if there is no overlap
            if (!isOverlap) {
                // Ensure that a new frame index is generated for each Food
                while (usedFrames.indexOf(randFrame) >= 0) {
                    // Use existing index if all frame indicies are used
                    if (usedFrames.length === foodSprite.numFrames) {
                        randFrame = GW.Utils.randomItem(usedFrames);
                    } else {
                        randFrame = GW.Utils.randomNumber(0, foodFrames - 1);
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
            if (bug.getBox().isMouseOverlap(mouseX, mouseY)) {
                // If Bug is not dead update the score and display points won
                if (!bug.isDead()) {
                    score += bug.getPoints();
                    setScore(score);
                    showPointsGained(bug.getPoints(), bug);
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
    // Function that shows points gained using PointUpText on a specific object
    function showPointsGained(points, object) {
        gameObjects.POINTS.push(
            new PointUpText('+' + points, 'bold 30px Sans-serif', '#B8E600', 1,
                    1.3,
                    object.getBox().getX() + 5,
                    object.getBox().getY() + object.getBox().getHeight())
        );
    }
    // Function that shows points lost using PointUpText on a specific object
    function showPointsLost(points, object) {
        gameObjects.POINTS.push(
            new PointUpText('-' + points, 'bold 30px Sans-serif', '#FF5050', 1,
                    1.3,
                    object.getBox().getX() + 5,
                    object.getBox().getY() + object.getBox().getHeight())
        );
    }
    // Function that updates the canvas cursor when hovering over a Bug
    function updateCanvasCursor() {
        gameObjects.BUGS.some(function (bug) {
            // If hovering over Bug then change cursor to 'pointer' and break
            if (bug.getBox().isMouseOverlap(mouseX, mouseY)) {
                $('body').addClass('pointer-cursor');
                return true;
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
            awardPoints();
        }
        // If game is over and all Bugs are dead then call game over event
        if (isGameOver &&
                gameObjects.BUGS.length < 1 &&
                gameObjects.POINTS.length < 1) {
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
        foodSettings.STARTX = startX;
        foodSettings.ENDX = endX;
        foodSettings.STARTY = startY;
        foodSettings.ENDY = endY;
    }
    // Function that sets the spread values for positioning Food apart
    function setFoodSpread(spreadX, spreadY) {
        foodSettings.SPREADX = spreadX;
        foodSettings.SPREADY = spreadY;
    }
    // Function that sets the amount of Food to make for the game
    function setFoodAmount(amountFood) {
        foodSettings.AMOUNT = amountFood;
    }
    // Function that sets the Food's points
    function setFoodPoints(points) {
        foodSettings.POINTS = points;
    }
    // Function that sets the score and calls the score update function
    function setScore(_score) {
        score = _score;
        // Condition the score so it is non negative
        if (score < 0) {
            score = 0;
        }
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
    // Functions returned by the module
    return {
        init: init,
        reset: reset,
        render: render,
        update: update,
        addBugToDB: addBugToDB,
        setBgImageID: setBgImageID,
        setFoodAmount: setFoodAmount,
        setFoodPoints: setFoodPoints,
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

// Setup configures the game page and the behaviour of DOM elements
var Setup = (function () {
    'use strict';
    // DOM element IDs
    var ID_CANVAS = '#game-canvas';
    var ID_TAB_HOME = '#home-link';
    var ID_TEXT_TIME = '#time-text';
    var ID_TAB_SCORE = '#score-link';
    var ID_TEXT_SCORE = '#score-text';
    var ID_BUTTON_PLAY = '#play-button';
    var ID_BUTTON_CLEAR = '#clear-button';
    var ID_BUTTON_RETRY = '#retry-button';
    var ID_BUTTON_PAUSE = '#pause-button';
    var ID_SECTION_HOME = '#home-section';
    var ID_SECTION_GAME = '#game-section';
    var ID_HEADING_SCORE = '#score-heading';
    var ID_SECTION_SCORE = '#score-section';
    var ID_MESSAGE_WON = '#game-won-message';
    var ID_MESSAGE_LOST = '#game-lose-message';
    // Resource path IDs
    var SPR_FOOD = 'assets/food_sprite.png';
    var IMG_BG = 'assets/background_table.png';
    var SPR_BUG_R = 'assets/red_bug_sprite.png';
    var SPR_BUG_G = 'assets/grey_bug_sprite.png';
    var SPR_BUG_O = 'assets/orange_bug_sprite.png';
    var IMG_BUTTON_PLAY = 'assets/button_play.png';
    var IMG_BUTTON_PAUSE = 'assets/button_pause.png';
    // Instance variables
    var LOCAL_STORAGE_HIGHSCORE = 'highscore';
    var definedGame;
    // Function that adds all of the game resources using the ResourceManager
    function initResources() {
        GW.ResourceManager.addImage('IMG_BACKGROUND', IMG_BG, 387, 600);
        GW.ResourceManager.addSprite('SPR_FOOD', SPR_FOOD, 896, 56, 16);
        GW.ResourceManager.addSprite('SPR_BUG_RED', SPR_BUG_R, 90, 50, 2);
        GW.ResourceManager.addSprite('SPR_BUG_ORANGE', SPR_BUG_O, 90, 50, 2);
        GW.ResourceManager.addSprite('SPR_BUG_GREY', SPR_BUG_G, 90, 50, 2);
    }
    // Function that updates the score text
    function updateScore(score) {
        $(ID_TEXT_SCORE).text('Score: ' + score);
    }
    // Function that updates the time text
    function updateTime(time) {
        $(ID_TEXT_TIME).text('Time: ' + time);
    }
    // Function that handles the events for the home navigation link
    function navHomeEvent() {
        // Call events if game is not running
        if (!GW.System.isActive()) {
            // Set home link item to active and score link item to inactive
            $(ID_TAB_HOME).addClass('active');
            $(ID_TAB_SCORE).removeClass('active');
            // Hide the score page section and show the home page section
            $(ID_SECTION_SCORE).hide();
            $(ID_SECTION_HOME).show();
            // Hide the win and lose messages and the retry button
            $(ID_MESSAGE_WON).hide();
            $(ID_MESSAGE_LOST).hide();
            $(ID_BUTTON_RETRY).hide();
        }
    }
    // Function that handles the events for the play game button
    function playGameButtonEvent() {
        // Hide the home page section and show the game page section
        $(ID_SECTION_HOME).hide();
        $(ID_SECTION_GAME).show();
        // Start the GameSystem
        GW.System.start();
    }
    // Function that handles the events for the retry button
    function retryButtonEvent() {
        navHomeEvent();
        playGameButtonEvent();
    }
    // Function that handles the events for the pause / resume button
    function pauseResumeButtonEvent() {
        // Pause the game if the game is running and resume if game is paused
        GW.System.togglePause();
        // Change the image of the button depending on the state of the game
        if (GW.System.isPaused()) {
            $(ID_BUTTON_PAUSE + ' img').attr('src', IMG_BUTTON_PLAY);
        } else {
            $(ID_BUTTON_PAUSE + ' img').attr('src', IMG_BUTTON_PAUSE);
        }
    }
    // Function that return the highscore entry from local storage
    function getScore() {
        // Obtain the score, use 0 if score does not exist
        var rawScore = window.localStorage.getItem(LOCAL_STORAGE_HIGHSCORE);
        return rawScore || 0;
    }
    // Function that updates the score heading with score from local storage
    function refreshScore() {
        // Obtain the highScore from local storage and use 0 as default value
        $(ID_HEADING_SCORE).text('High Score: ' + getScore());
    }
    // Function that handles the events for the clear score button
    function clearScoreButtonEvent() {
        window.localStorage.removeItem(LOCAL_STORAGE_HIGHSCORE);
        // Refresh displayed score
        refreshScore();
    }
    // Function that handles the events for the score navigation link
    function navScoreEvent() {
        // Call events if game is not running
        if (!GW.System.isActive()) {
            // Set score link item to active and home link item to inactive
            $(ID_TAB_SCORE).addClass('active');
            $(ID_TAB_HOME).removeClass('active');
            // Hide the home page section and show the score page section
            $(ID_SECTION_HOME).hide();
            $(ID_SECTION_SCORE).show();
            // Refresh displayed score
            refreshScore();
        }
    }
    // Function that handles events for when TapTapBugGame is finished
    function gameOverEvent(score, isWin) {
        // Stop the GameSystem
        GW.System.stop();
        // Navigate to score page
        navScoreEvent();
        // Hide the game page section and show the retry button
        $(ID_SECTION_GAME).hide();
        $(ID_BUTTON_RETRY).show();
        // If user has won display win message, otherwise display lose message
        if (isWin) {
            $(ID_MESSAGE_WON).show();
            // saves score to local storage if it's larger than previous score
            if (score > getScore()) {
                window.localStorage.setItem(LOCAL_STORAGE_HIGHSCORE, score);
                // Update high score heading
                $(ID_HEADING_SCORE).text('New High Score: ' + score);
            }
        } else {
            $(ID_MESSAGE_LOST).show();
        }
    }
    // Function that creates and configures TapTapBugGame's attributes
    function createConfigureGame() {
        definedGame = new TapTapBugGame();
        definedGame.setFoodAmount(6);
        definedGame.setAllotedTime(60);
        definedGame.setFoodPoints(5);
        definedGame.setFoodSpread(30, 30);
        definedGame.setBugSpawnTimes([0.5, 0.9, 1.2]);
        definedGame.setFoodSpawnRange(10, 320, 120, 380);
        definedGame.setBgImageID('IMG_BACKGROUND');
        definedGame.setSpriteFoodID('SPR_FOOD');
        definedGame.setUpdateTimeEvent(updateTime);
        definedGame.setGameOverEvent(gameOverEvent);
        definedGame.setUpdateScoreEvent(updateScore);
        definedGame.addBugToDB('SPR_BUG_RED', 3, 2.5, 0.3);
        definedGame.addBugToDB('SPR_BUG_ORANGE', 1, 1.5, 0.5);
        definedGame.addBugToDB('SPR_BUG_GREY', 5, 4, 0.2);
    }
    // Funtion that binds event functions to specific links and buttons
    function bindEventHandlers() {
        $(ID_TAB_SCORE).click(function () {
            navScoreEvent();
        });
        $(ID_TAB_HOME).click(function () {
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
        $(ID_BUTTON_PAUSE).click(function () {
            pauseResumeButtonEvent();
        });
    }
    // Function that initializes setup of the game page and DOM elements
    function init() {
        // Initialize game resources
        initResources();
        // Bind unobtrusive event handlers
        bindEventHandlers();
        // Create and configure TapTapBugGame instance
        createConfigureGame();
        // Initalize and configure the Gamework system with TapTapBugGame
        GW.System.init(60, ID_CANVAS, definedGame);
        GW.System.enableMouseMove();
        GW.System.enableMouseClick();
    }
    // Functions returned by the module
    return {
        init: init
    };
}());

// Trigger the game setup when the browser window loads
window.onload = Setup.init;
