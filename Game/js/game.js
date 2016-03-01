/*jshint browser:true, jquery:true, quotmark:single, maxlen:80, eqeqeq:true,
strict:true, unused:true, undef:true*/
/*jslint browser:true, this:true, maxlen:80*/
/*global $, window, GW*/

// PointUpText draws text which scrolls upwards and fades out
function PointUpText(text, font, colour, moveSpeed, fadeSpeed, x, y) {
    'use strict';
    // Module constnts and variables
    var superModule = new GW.GameObject();
    superModule.setDrawPriority(2);
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
function Bug(sprite, points, speed, x, y, foodObjects) {
    'use strict';
    // Module constants and variables
    var superModule = new GW.GameObject();
    superModule.setDrawPriority(1);
    var _this = this;
    _this.x = x;
    _this.y = y;
    _this.angle = 0;
    _this.moveToX = 0;
    _this.moveToY = 0;
    _this.speed = speed;
    _this.isDead = false;
    _this.points = points;
    _this.foodObjects = foodObjects;
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
    superModule.update = function (FPS) {
        // Update the Bug if it is alive
        if (!_this.isDead) {
            // Move the Bug to a specific target position
            moveBugToFood(_this.foodObjects);
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

var TapTapBugGame = (function () {
    'use strict';
    // Module constants and variables
    var score;
    var mouseX;
    var mouseY;
    var timeTicks;
    var bgPattern;
    var isGameOver;
    var bugDB = {};
    var bugSpawnTime;
    var remainingTime;
    var rewardedPoints;
    var bugSpawnTimes = [];
    var bugSpwanProbs = [];
    var defaultAllotedTime;
    var superModule = new GW.Game();
    var resourceIDs = {'FOOD': null, 'BACKGROUND': null};
    var eventFuncts = {'UPDATESCORE': null, 'UPDATETIME': null,
            'GAMEOVER': null};
    var foodSettings = {'AMOUNT': 0, 'STARTX': 0, 'ENDX': 0, 'STARTY': 0,
            'ENDY': 0, 'SPREADX': 0, 'SPREADY': 0, 'POINTS': 0};
    // Function that initializes TapTapBugGame
    superModule.connectCustomInit(function (ctx) {
        var bgImage = GW.ResourceManager.getImage(resourceIDs.BACKGROUND);
        // Setup the background pattern
        bgImage.onload = function () {
            // Create a pattern using the background Image
            bgPattern = ctx.createPattern(bgImage, 'repeat');
        };
        // Set the Bug spawn probability distribution
        Object.keys(bugDB).forEach(function (bugID) {
            var spawnProbs = [];
            spawnProbs.length = bugDB[bugID].WEIGHT * 10;
            // Append Bug ID equal to the weight of the Bug's spawn probability
            bugSpwanProbs = bugSpwanProbs.concat(spawnProbs.fill(bugID));
        });
    });
    // Function that shows points gained using PointUpText on a specific object
    function showPointsGained(points, object) {
        superModule.addGameObject(
            new PointUpText('+' + points, 'bold 30px Sans-serif', '#B8E600', 1,
                    1.3,
                    object.getBox().getX() + 5,
                    object.getBox().getY() + object.getBox().getHeight()),
            'POINTS'
        );
        GW.ResourceManager.playSound('SND_POINTS_WON', {volume: 0.45});
    }
    // Function that shows points lost using PointUpText on a specific object
    function showPointsLost(points, object) {
        superModule.addGameObject(
            new PointUpText('-' + points, 'bold 30px Sans-serif', '#FF5050', 1,
                    1.3,
                    object.getBox().getX() + 5,
                    object.getBox().getY() + object.getBox().getHeight()),
            'POINTS'
        );
        GW.ResourceManager.playSound('SND_POINTS_LOST', {volume: 0.45});
    }
    // Function that updates remaining time and calls the time update function
    function updateTime(FPS) {
        remainingTime -= 1 / FPS;
        eventFuncts.UPDATETIME(Math.floor(remainingTime));
    }
    // Function that handles the game over event for TapTapBugGame
    function updateGameOver() {
        // Game is over when the timer expires or all of the Food is eaten
        if (remainingTime < 1 ||
                superModule.getGameObjects('FOOD').length < 1) {
            isGameOver = true;
            // Reward points for any remaining Food but only once
            if (!rewardedPoints) {
                superModule.getGameObjects('FOOD').forEach(function (food) {
                    score += foodSettings.POINTS;
                    eventFuncts.UPDATESCORE(score);
                    showPointsGained(foodSettings.POINTS, food);
                });
                rewardedPoints = true;
            }
        }
        // If game is over and all Bugs are dead then call game over event
        if (isGameOver &&
                superModule.getGameObjects('BUGS').length < 1 &&
                superModule.getGameObjects('POINTS').length < 1) {
            // If the timer expired then player has won
            if (remainingTime < 1) {
                eventFuncts.GAMEOVER(score, true);
            } else {
                eventFuncts.GAMEOVER(score, false);
            }
        }
    }
    // Function that updates the canvas cursor when hovering over a Bug
    function updateCanvasCursor() {
        superModule.getGameObjects('BUGS').some(function (bug) {
            // If hovering over Bug then change cursor to 'pointer' and break
            if (bug.getBox().isMouseOverlap(mouseX, mouseY)) {
                $('body').addClass('pointer-cursor');
                return true;
            }
            // Change the cursor back to 'hovering' when hot hovering over Bug
            $('body').removeClass('pointer-cursor');
        });
    }
    // Function that spawns a specific amount of Food positioned randomly
    function spawnFood() {
        var x;
        var y;
        var randFrame;
        var isOverlap;
        var usedPos = [];
        var foodCount = 0;
        var usedFrames = [];
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
                superModule.addGameObject(
                    new Food(foodSprite, randFrame, x, y),
                    'FOOD'
                );
                usedPos.push({'x': x, 'y': y});
                // Add the new frame index to used list if it doesn't exist
                if (usedFrames.indexOf(randFrame) < 0) {
                    usedFrames.push(randFrame);
                }
                foodCount += 1;
            }
        }
    }
    // Function that spawns a random Bug from the Bug Database
    function spawnBugs(FPS, canvas) {
        timeTicks += 1;
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
            superModule.addGameObject(
                new Bug(sprite, points, speed, x, y,
                        superModule.getGameObjects('FOOD')),
                'BUGS'
            );
        }
    }
    // Function that resets the Game variables to their default values
    superModule.connectCustomReset(function () {
        // Set default initialized values
        score = 0;
        timeTicks = 0;
        isGameOver = false;
        rewardedPoints = false;
        remainingTime = defaultAllotedTime;
        // Set default score of 0 and spawn need Food
        spawnFood();
        eventFuncts.UPDATESCORE(score);
    });
    // Function that handle all update tasks for TapTapBugGame
    superModule.connectCustomUpdate(function (FPS, canvas) {
        // If game is not over update remaining time and spawn Bugs
        if (!isGameOver) {
            updateTime(FPS);
            spawnBugs(FPS, canvas);
        }
        // Update the canvas cursor when hovering over a Bug
        updateCanvasCursor();
        // Handle game over event for TapTapBugGame
        updateGameOver();
        // Update all Bug movement and collisions
        superModule.getGameObjects('BUGS').forEach(function (bug) {
            // Handle all collisions between Bugs and Food GameObjects
            superModule.getGameObjects('FOOD').forEach(function (food) {
                // Ensure that the current Food has not been eaten
                if (!food.isEaten()) {
                    // Check if the Bug is colliding with a Food object
                    if (food.getBox().isOverlap(bug.getBox())) {
                        // Set Food to eaten and display points lost
                        food.setEaten();
                        score -= foodSettings.POINTS;
                        // Ensure that that score is non-negative
                        score = Math.max(score, 0);
                        eventFuncts.UPDATESCORE(score);
                        showPointsLost(foodSettings.POINTS, food);
                    }
                }
            });
            // If the game is over then kill this current Bug
            if (isGameOver) {
                bug.setDead();
            }
        });
    });
    // Function that handles all rendering tasks for TapTapBugGame
    superModule.connectCustomRender(function (ctx, canvas) {
        // Render the Game's background
        ctx.fillStyle = bgPattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
    // Function that handles all mouse move tasks for TapTapBugGame
    superModule.mouseMoveEvent = function (mX, mY) {
        // Store the mouse coordinates when the mouse has moved
        mouseX = mX;
        mouseY = mY;
    };
    // Function that handles all mouse click tasks for TapTapBugGame
    superModule.mouseClickEvent = function (mX, mY) {
        // Handle mouse clicks on Bug objects
        superModule.getGameObjects('BUGS').forEach(function (bug) {
            // If mouse cursor is hovering over the Bug
            if (bug.getBox().isMouseOverlap(mX, mY)) {
                // If Bug is not dead update the score and display points won
                if (!bug.isDead()) {
                    score += bug.getPoints();
                    eventFuncts.UPDATESCORE(score);
                    showPointsGained(bug.getPoints(), bug);
                }
                // Kill the Bug
                bug.setDead();
            }
        });
    };
    // Function that adds new info about a Bug to the Bug database
    superModule.addBugToDB = function (bugSpriteID, points, speed, weight) {
        bugDB[bugSpriteID] = {'POINTS': points, 'SPEED': speed,
                'WEIGHT': weight};
    };
    // Function that sets the amount of time alloted for the game
    superModule.setAllotedTime = function (allotedTime) {
        defaultAllotedTime = allotedTime + 1;
    };
    // Function that sets the spawn times for the Bug
    superModule.setBugSpawnTimes = function (spawnTimes) {
        bugSpawnTimes = spawnTimes;
        // Set a default spawn time
        bugSpawnTime = GW.Utils.randomItem(bugSpawnTimes);
    };
    // Function that sets the range to spawn and position the Food
    superModule.setFoodSpawnRange = function (startX, endX, startY, endY) {
        foodSettings.STARTX = startX;
        foodSettings.ENDX = endX;
        foodSettings.STARTY = startY;
        foodSettings.ENDY = endY;
    };
    // Function that sets the spread values for positioning Food apart
    superModule.setFoodSpread = function (spreadX, spreadY) {
        foodSettings.SPREADX = spreadX;
        foodSettings.SPREADY = spreadY;
    };
    // Function that sets the amount of Food to make for the game
    superModule.setFoodAmount = function (amountFood) {
        foodSettings.AMOUNT = amountFood;
    };
    // Function that sets the Food's points
    superModule.setFoodPoints = function (points) {
        foodSettings.POINTS = points;
    };
    // Function that sets the update score text function for the game
    superModule.setUpdateScoreEvent = function (updateScoreEvent) {
        eventFuncts.UPDATESCORE = updateScoreEvent;
    };
    // Function that sets the update time text function for the game
    superModule.setUpdateTimeEvent = function (updateTimeEvent) {
        eventFuncts.UPDATETIME = updateTimeEvent;
    };
    // Function that sets the game over event function for the game
    superModule.setGameOverEvent = function (gameOverEvent) {
        eventFuncts.GAMEOVER = gameOverEvent;
    };
    // Function that sets the Sprite ID for the Food
    superModule.setSpriteFoodID = function (spriteFoodID) {
        resourceIDs.FOOD = spriteFoodID;
    };
    // Function that sets the background Image ID for the game
    superModule.setBgImageID = function (bgImageID) {
        resourceIDs.BACKGROUND = bgImageID;
    };
    // Function returned by the module
    return superModule;
}());

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
    var SND_POINTS_WON = 'assets/points_won.ogg';
    var SND_POINTS_LOST = 'assets/points_lost.ogg';
    var SPR_BUG_O = 'assets/orange_bug_sprite.png';
    var IMG_BUTTON_PLAY = 'assets/button_play.png';
    var IMG_BUTTON_PAUSE = 'assets/button_pause.png';
    // Instance variables
    var LOCAL_STORAGE_HIGHSCORE = 'highscore';
    // Function that adds all of the game resources using the ResourceManager
    function initResources() {
        // Add and config all Image and Sprite resources
        GW.ResourceManager.addImage('IMG_BACKGROUND', IMG_BG, 387, 600);
        GW.ResourceManager.addSprite('SPR_FOOD', SPR_FOOD, 896, 56, 16);
        GW.ResourceManager.addSprite('SPR_BUG_RED', SPR_BUG_R, 90, 50, 2);
        GW.ResourceManager.addSprite('SPR_BUG_ORANGE', SPR_BUG_O, 90, 50, 2);
        GW.ResourceManager.addSprite('SPR_BUG_GREY', SPR_BUG_G, 90, 50, 2);
        // Add and config all Sound resources
        GW.ResourceManager.addSound('SND_POINTS_WON', SND_POINTS_WON);
        GW.ResourceManager.addSound('SND_POINTS_LOST', SND_POINTS_LOST);
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
        TapTapBugGame.setFoodAmount(6);
        TapTapBugGame.setAllotedTime(60);
        TapTapBugGame.setFoodPoints(5);
        TapTapBugGame.setFoodSpread(30, 30);
        TapTapBugGame.setBugSpawnTimes([0.5, 0.9, 1.2]);
        TapTapBugGame.setFoodSpawnRange(10, 320, 120, 380);
        TapTapBugGame.setBgImageID('IMG_BACKGROUND');
        TapTapBugGame.setSpriteFoodID('SPR_FOOD');
        TapTapBugGame.setUpdateTimeEvent(updateTime);
        TapTapBugGame.setGameOverEvent(gameOverEvent);
        TapTapBugGame.setUpdateScoreEvent(updateScore);
        TapTapBugGame.addBugToDB('SPR_BUG_RED', 3, 2.5, 0.3);
        TapTapBugGame.addBugToDB('SPR_BUG_ORANGE', 1, 1.5, 0.5);
        TapTapBugGame.addBugToDB('SPR_BUG_GREY', 5, 4, 0.2);
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
        GW.System.init(60, ID_CANVAS, TapTapBugGame);
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
