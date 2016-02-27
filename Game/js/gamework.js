/*jshint browser:true, jquery:true, quotmark:single, maxlen:80, eqeqeq:true,
strict:true, unused:false, undef:true*/
/*jslint browser:true, this:true, maxlen:80*/
/*global $*/

/**
* Gamework is a 2D game development module based framework used to develop 2D
* games in JavaScript on the HTML5 canvas.
*
* @author Salinder Sidhu
* @namespace Gamework
*/
var GW = (function () {
    'use strict';
    /**
    * Sprite represents a sprite sheet image. A single image consisting of
    * multiple images that together form an animation.
    *
    * @memberof Gamework
    * @function Sprite
    * @param {string} Sprite.image The Sprite sheet image.
    * @param {number} Sprite.numFrames The number of frames on the sprite sheet
    * image.
    * @param {number} Sprite.frameWidth The width of each individual frame on
    * the sprite sheet image.
    */
    function Sprite() {
        // Sprite object attributes
        this.image = null;
        this.numFrames = null;
        this.frameWidth = null;
    }
    /**
    * The Utils module provides useful utility functions.
    *
    * @author Salinder Sidhu
    * @module Utils
    */
    var Utils = (function () {
        /**
        * Return a random number between min and max inclusive.
        *
        * @function randomNumber
        * @param {number} min The minimum value for the random number.
        * @param {number} max The maximum value for the random number.
        * @return {number} A random number between min and max inclusive.
        */
        function randomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        /**
        * Return a random object from itemArray.
        *
        * @function randomItem
        * @param {array} itemArray An array of objects.
        * @return {object} A random object from itemArray.
        */
        function randomItem(itemArray) {
            // Normalize itemArray to an empty array if it is undefined
            itemArray = itemArray || [];
            return itemArray[Math.floor(Math.random() * itemArray.length)];
        }
        /**
        * Return an array of objects that is randomly shuffled.
        *
        * @function shuffle
        * @param {array} itemArray An array of objects.
        * @return {array} An array of objects from itemArray shuffled.
        */
        function shuffle(itemArray) {
            // Normalize itemArray to an empty array if it is undefined
            itemArray = itemArray || [];
            return itemArray.sort(function () {
                return Math.random() - 0.5;
            });
        }
        /**
        * Wrapper that executes a function within a context extractly once.
        *
        * @function once
        * @param {object} funct The function to be called.
        * @param {object} context The context of the function.
        */
        function once(funct, context) {
            var result;
            return function () {
                if (funct) {
                    result = funct.apply(context || this, arguments);
                    funct = null;
                }
                return result;
            };
        }
        // Functions returned by the module
        return {
            once: once,
            shuffle: shuffle,
            randomItem: randomItem,
            randomNumber: randomNumber
        };
    }());
    /**
    * The ResourceManager module provides functions for creation, storage and
    * management of game resources.
    *
    * @author Salinder Sidhu
    * @module ResourceManager
    */
    var ResourceManager = (function () {
        // Module constants and variables
        var imageDict = {};
        var spriteDict = {};
        /**
        * Return a new Image object
        *
        * @private
        * @function makeImage
        * @param {string} src The source file path of the image.
        * @param {number} width The image's width.
        * @param {number} height The image's height.
        * @return {object} An Image object.
        */
        function makeImage(src, width, height) {
            var image = new Image();
            image.src = src;
            image.width = width;
            image.height = height;
            return image;
        }
        /**
        * Add a new Image with a unique ID to the ResourceManager.
        *
        * @function addImage
        * @param {string} id The image's unique id.
        * @param {string} src The source file path of the image.
        * @param {number} width The image's width.
        * @param {number} height The image's height.
        * @throws {Error} Image object with the specified id already exists.
        */
        function addImage(id, src, width, height) {
            if (!imageDict.hasOwnProperty(id)) {
                imageDict[id] = makeImage(src, width, height);
            } else {
                throw new Error('Image with ID ' + id + ' already exists!');
            }
        }
        /**
        * Add a new Sprite with a unique ID to the ResourceManager.
        *
        * @function addSprite
        * @param {string} id The sprite image's unique id.
        * @param {string} src The source file path of the sprite image.
        * @param {number} weight The sprite image's width.
        * @param {number} height The sprite image's height.
        * @param {number} numFrames The number of frames in the sprite image.
        * @throws {Error} Sprite object with the specified id already exists.
        */
        function addSprite(id, src, width, height, numFrames) {
            if (!spriteDict.hasOwnProperty(id)) {
                var sprite = new Sprite();
                sprite.image = makeImage(src, width, height);
                sprite.numFrames = numFrames;
                sprite.frameWidth = width / numFrames;
                spriteDict[id] = sprite;
            } else {
                throw new Error('Sprite with ID ' + id + ' already exists!');
            }
        }
        /**
        * Return an Image object corresponding to a unique ID.
        *
        * @function getImage
        * @param {string} id The unique ID corresponding to an Image object.
        * @return {object} An Image object.
        * @throws {Error} Image object with the specified id does not exist!
        */
        function getImage(id) {
            if (imageDict.hasOwnProperty(id)) {
                return imageDict[id];
            }
            throw new Error('Image with ID ' + id + ' does not exist!');
        }
        /**
        * Return a Sprite object corresponding to a unique ID.
        *
        * @function getSprite
        * @param {string} id The unique ID corresponding to a Sprite object.
        * @return {object} A Sprite object.
        * @throws {Error} Sprite object with the specified id does not exist!
        */
        function getSprite(id) {
            if (spriteDict.hasOwnProperty(id)) {
                return spriteDict[id];
            }
            throw new Error('Sprite with ID ' + id + ' does not exist!');
        }
        // Functions returned by the module
        return {
            addImage: addImage,
            getImage: getImage,
            addSprite: addSprite,
            getSprite: getSprite
        };
    }());
    /**
    * The BoundingBox module provides functions for calculating bounding box
    * collision detection.
    *
    * @author Salinder Sidhu
    * @module BoundingBox
    * @param {number} x The BoundingBox's initial x position coordinate.
    * @param {number} y The BoundingBox's initial y position coordinate.
    * @param {number} width The BoundingBox's width.
    * @param {number} height The BoundingBox's height.
    */
    function BoundingBox(x, y, width, height) {
        // Module constants and variables
        var _this = this; // Reference to the module's local scope
        _this.x = x;
        _this.y = y;
        _this.width = width;
        _this.height = height;
        /**
        * Return true if this BoundingBox completly overlaps another
        * BoundingBox, otherwise return false.
        *
        * @function isOverlap
        * @param {object} otherBox A BoundingBox object.
        * @return {boolean}
        */
        function isOverlap(otherBox) {
            return (
                _this.x <= otherBox.getX() &&
                _this.y <= otherBox.getY() &&
                (_this.x + _this.width) >= (
                    otherBox.getX() + otherBox.getWidth()
                ) && (_this.y + _this.height >= (
                    otherBox.getY() + otherBox.getHeight()
                ))
            );
        }
        /**
        * Return true if this BoundingBox partially overlaps or intersects
        * another BoundingBox, otherwise return false.
        *
        * @function isIntersect
        * @param {object} otherBox A BoundingBox object.
        * @return {boolean}
        */
        function isIntersect(otherBox) {
            return (
                _this.x <= (otherBox.getX() + otherBox.getWidth()) &&
                (_this.x + _this.width) >= otherBox.getX() &&
                _this.y <= (otherBox.getY() + otherBox.getHeight()) &&
                (_this.y + _this.height) >= otherBox.getY()
            );
        }
        /**
        * Return true if this BoundingBox intersects with the mouse cursor,
        * otherwise return false.
        *
        * @function isMouseOverlap
        * @param {number} mouseX The x coordinate of the mouse.
        * @param {number} mouseY The y coordinate of the mouse.
        * @return {boolean}
        */
        function isMouseOverlap(mouseX, mouseY) {
            return (
                mouseX > _this.x && mouseX < (_this.x + _this.width) &&
                mouseY > _this.y && mouseY < (_this.y + _this.height)
            );
        }
        /**
        * Update the local origin position of the BoundingBox to a new point.
        * This function is usually called when an object (associated with the
        * BoundingBox) changes its position.
        *
        * @function update
        * @param {number} x The new x coordinate of the BoundingBox's positon.
        * @param {number} y The new y coordinate of the BoundingBox's positon.
        */
        function update(x, y) {
            _this.x = x;
            _this.y = y;
        }
        /**
        * Return the x coordinate of the BoundingBox's position.
        *
        * @function getX
        * @return {number} BoundingBox's x coordinate.
        */
        function getX() {
            return _this.x;
        }
        /**
        * Return the y coordinate of the BoundingBox's position.
        *
        * @function getY
        * @return {number} BoundingBox's y coordinate.
        */
        function getY() {
            return _this.y;
        }
        /**
        * Return the width of the BoundingBox.
        *
        * @function getWidth
        * @return {number} BoundingBox's width.
        */
        function getWidth() {
            return _this.width;
        }
        /**
        * Return the height of the BoundingBox.
        *
        * @function getHeight
        * @return {number} BoundingBox's height.
        */
        function getHeight() {
            return _this.height;
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
            isMouseOverlap: isMouseOverlap
        };
    }
    /**
    * The SpriteAnimation module provides functions for creating and rendering
    * an animated sprite.
    *
    * @author Salinder Sidhu
    * @module SpriteAnimation
    * @param {object} sprite The Sprite object of the sprite animation.
    * @param {number} CPS The number of frame update cycles per second.
    * @param {number} [initFrame] - The initial animation starting frame.
    */
    function SpriteAnimation(sprite, CPS, initFrame) {
        // Module constants and variables
        var _this = this; // Reference to the module's local scope
        _this.CPS = CPS;
        _this.image = sprite.image;
        _this.frameIndex = initFrame;
        _this.width = sprite.image.width;
        _this.height = sprite.image.height;
        _this.numFrames = sprite.numFrames;
        _this.frameWidth = sprite.frameWidth;
        _this.opacity = 1;
        _this.cycleCounter = 0;
        // Condition frameIndex to take a default value of -1 if undefined
        if (initFrame === undefined) {
            _this.frameIndex = -1;
        }
        /**
        * Update the sprite animation frame by frame on each function call.
        *
        * @function update
        */
        function update() {
            _this.cycleCounter += 1;
            // Update the frame index when the cycle counter has triggered
            if (_this.cycleCounter > _this.CPS) {
                _this.cycleCounter = 0;
                // Update and reset the frame index at the end of the animation
                _this.frameIndex = (_this.frameIndex + 1) % _this.numFrames;
            }
        }
        /**
        * Render the animated sprite frame by frame on each function call.
        *
        * @function render
        * @param {object} ctx The 2D canvas context.
        * @param {number} x The y position coordinate of the sprite animation.
        * @param {number} y The y positon coordinate of the sprite animation.
        * @param {number} angle The angle, in radians, of the sprite animation.
        */
        function render(ctx, x, y, angle) {
            // Configure the translation point to sprite's center when rotating
            var translateX = x + (_this.frameWidth / 2);
            var translateY = y + (_this.height / 2);
            // Save current state of the canvas prior to rendering
            ctx.save();
            // Configure the canvas opacity
            ctx.globalAlpha = _this.opacity;
            // Translate and rotate canvas to draw the animated Sprite angled
            ctx.translate(translateX, translateY);
            ctx.rotate(angle);
            ctx.translate(-translateX, -translateY);
            // Draw the animated Sprite
            ctx.drawImage(_this.image, _this.frameIndex * _this.frameWidth, 0,
                    _this.frameWidth, _this.height, x, y, _this.frameWidth,
                    _this.height);
            // Restore the canvas state prior to rendering
            ctx.restore();
        }
        /**
        * Return the opacity of the sprite animation.
        *
        * @function getOpacity
        * @return {number} The opacity of the sprite animation.
        */
        function getOpacity() {
            return _this.opacity;
        }
        /**
        * Reduce the opacity of the sprite animation. This generates a fade out
        * effect for sprite animation.
        *
        * @function reduceOpacity
        * @param {number} FPS The game's frames per second.
        * @param {number} fadespeed The speed, in seconds, of the fade out
        * effect.
        */
        function reduceOpacity(FPS, fadeSpeed) {
            _this.opacity -= 1 / (FPS * fadeSpeed);
            // Condition the opacity so it is non-negative
            if (_this.opacity < 0) {
                _this.opacity = 0;
            }
        }
        // Functions returned by the module
        return {
            update: update,
            render: render,
            getOpacity: getOpacity,
            reduceOpacity: reduceOpacity
        };
    }
    /**
    * The FadingText module provides functions for creating and rendering
    * fading text with an outline.
    *
    * @author Salinder Sidhu
    * @module FadingText
    * @param {string} text The string value of the fading text.
    * @param {string} font The font and font styles of the fading text.
    * @param {string} colour The fill colour of the fading text.
    * @param {number} speed The speed, in seconds, of the fading effect for the
    * fading text.
    */
    function FadingText(text, font, colour, speed) {
        // Module constants and variables
        var _this = this; // Reference to the module's local scope
        _this.text = text;
        _this.font = font;
        _this.speed = speed;
        _this.colour = colour;
        _this.opacity = 1;
        _this.outlineWidth = null;
        _this.outlineColour = null;
        _this.canDrawOutline = false;
        /**
        * Update the text's fade effect frame by frame on each function call.
        *
        * @function update
        * @param {number} FPS The game's frames per second.
        */
        function update(FPS) {
            // Reduce opacity
            _this.opacity -= 1 / (FPS * _this.speed);
            // Condition the opacity so it is non-negative
            if (_this.opacity < 0) {
                _this.opacity = 0;
            }
        }
        /**
        * Render the fading text frame by frame on each function call.
        *
        * @function render
        * @param {object} ctx The 2D canvas context.
        * @param {number} x The y position coordinate of the fading text.
        * @param {number} y The y positon coordinate of the fading text.
        * @param {number} angle The angle, in radians, of the fading text.
        */
        function render(ctx, x, y, angle) {
            // Save current state of the canvas
            ctx.save();
            // Translate and rotate canvas to draw the text at an angle
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.translate(-x, -y);
            // Configure the canvas opacity
            ctx.globalAlpha = _this.opacity;
            // Set canvas font
            ctx.font = _this.font;
            // Draw the text outline if can draw outline flag is true
            if (_this.canDrawOutline) {
                ctx.strokeStyle = _this.outlineColour;
                ctx.lineWidth = _this.outlineWidth;
                ctx.strokeText(_this.text, x, y);
            }
            // Draw the actual text
            ctx.fillStyle = _this.colour;
            ctx.fillText(_this.text, x, y);
            // Restore the canvas state prior to rendering
            ctx.restore();
        }
        /**
        * Enable rendering of the text's outline and set the colour and width
        * of the text's outline.
        *
        * @function setOutline
        * @param {string} colour The colour of the text's outline.
        * @param {number} width The width of the text's outline.
        */
        function setOutline(colour, width) {
            _this.outlineColour = colour;
            _this.outlineWidth = width;
            _this.canDrawOutline = true;
        }
        /**
        * Return the opacity of the fading text.
        *
        * @function getOpacity
        * @return {number} The opacity of the fading text.
        */
        function getOpacity() {
            return _this.opacity;
        }
        // Functions returned by the module
        return {
            update: update,
            render: render,
            setOutline: setOutline,
            getOpacity: getOpacity
        };
    }
    /**
    * The GameObject module acts as an abstract object used to build objects
    * for a game with abstract methods for updating and rendering the objects.
    *
    * @abstract
    * @author Salinder Sidhu
    * @module GameObject
    */
    function GameObject() {
        // Module constants and variables
        var _this = this;
        _this.drawPriority = 0;
        _this.canDelete = false;
        /**
        * Abstract function that updates the GameObject. This function needs to
        * be overriden.
        *
        * @abstract
        * @function update
        */
        function update() {
            throw new Error('Cannot call abstract function!');
        }
        /**
        * Abstract function that renders the GameObject. This function needs to
        * be overriden.
        *
        * @abstract
        * @function render
        */
        function render() {
            throw new Error('Cannot call abstract function!');
        }
        /**
        * Return true if the GameObject can be deleted, false otherwise.
        *
        * @function canDelete
        * @return {boolean}
        */
        function canDelete() {
            return _this.canDelete;
        }
        /**
        * Flag the GameObject to be deleted.
        *
        * @function flagToDelete
        */
        function flagToDelete() {
            _this.canDelete = true;
        }
        /**
        * Return the GameObject's collision BoundingBox.
        *
        * @function getBox
        * @return {object} The GameObject's BoundingBox.
        */
        function getBox() {
            return _this.boundingBox;
        }
        /**
        * Return the GameObject's draw priority value.
        *
        * @function getDrawPriority
        * @return {number} The GameObject's draw priority value.
        */
        function getDrawPriority() {
            return _this.drawPriority;
        }
        /**
        * Set the value of the GameObject's draw priority.
        *
        * @function setDrawPriority
        * @param {number} drawPriority The new value of the GameObject's draw
        * priority.
        */
        function setDrawPriority(drawPriority) {
            _this.drawPriority = drawPriority;
        }
        // Functions returned by the module
        return {
            update: update,
            render: render,
            getBox: getBox,
            canDelete: canDelete,
            flagToDelete: flagToDelete,
            getDrawPriority: getDrawPriority,
            setDrawPriority: setDrawPriority
        };
    }
    /**
    * The GameSystem module provides functions for handling the core game
    * events, general game management and rendering tasks.
    *
    * @author Salinder Sidhu
    * @module GameSystem
    * @param {number} FPS The game's frames per second.
    * @param {string} canvasID The ID of the canvas DOM element.
    */
    function GameSystem(FPS, canvasID) {
        // Module constants and variables
        var _this = this; // Reference to the module's local scope
        _this.FPS = FPS;
        _this.canvasID = canvasID;
        _this.isGamePaused = false;
        _this.isGameActive = false;
        _this.connectedGame = null;
        /**
        * Trigger a mouse event function on the game canvas.
        *
        * @private
        * @function triggerMouseEvent
        * @param {object} evt The mouse event object.
        * @param {object} canvas The canvas object.
        */
        function triggerMouseEvent(evt, canvas, mouseEvtFunct) {
            // Trigger mouse event if GameSystem is active and not paused
            if (_this.isGameActive && !_this.isGamePaused) {
                // Obtain the mouse coordinates relative to the canvas
                var mouseX = evt.pageX - canvas.offsetLeft;
                var mouseY = evt.pageY - canvas.offsetTop;
                // Trigger the mouse event function on the mouse event
                mouseEvtFunct(mouseX, mouseY);
            }
        }
        /**
        * Main game system loop, continously updates and renders the connected
        * game.
        *
        * @private
        * @function mainLoop
        */
        function mainLoop() {
            if (_this.isGameActive && !_this.isGamePaused) {
                // Update the connected game
                _this.connectedGame.update();
                // Render the connected game
                _this.connectedGame.render();
            }
        }
        /**
        * Initialize the GameSystem
        *
        * @function init
        * @throws {Error} Cannot find a connected game.
        */
        function init() {
            if (_this.connectedGame) {
                // Obtain the canvas and canvas 2D context from the DOM
                var canvas = $(canvasID).get(0);
                var ctx = canvas.getContext('2d');
                // Add event listener for mouse click events to the canvas
                canvas.addEventListener('mousedown', function (evt) {
                    triggerMouseEvent(evt, canvas,
                            _this.connectedGame.mouseClickEvent);
                }, false);
                // Add event listener for mouse move events to the canvas
                canvas.addEventListener('mousemove', function (evt) {
                    triggerMouseEvent(evt, canvas,
                            _this.connectedGame.mouseMoveEvent);
                }, false);
                // Initialize the connected game module
                _this.connectedGame.init(_this.FPS, ctx, canvas,
                        _this.isGamePaused);
                // Execute the GameSystem main loop indefinitely
                setInterval(mainLoop, 1000 / FPS);
            } else {
                throw new Error(
                    'Cannot initialize, no connected game was found!'
                );
            }
        }
        /**
        * Function that toggles the GameSystem's state between paused or
        * running.
        *
        * @function togglePause
        */
        function togglePause() {
            _this.isGamePaused = !_this.isGamePaused;
        }
        /**
        * Return if the GameSystem is paused.
        *
        * @function isPaused
        * @return {boolean}
        */
        function isPaused() {
            return _this.isGamePaused;
        }
        /**
        * Return if the GameSystem is active.
        *
        * @function isActive
        * @return {boolean}
        */
        function isActive() {
            return _this.isGameActive;
        }
        /**
        * Start the GameSystem and the connected game.
        *
        * @function start
        * @throws {Error} Cannot find a connected game.
        */
        function start() {
            if (_this.connectedGame) {
                // Reset the connected game module
                _this.connectedGame.reset();
                _this.isGameActive = true;
            } else {
                throw new Error('Cannot start, no connected game was found!');
            }
        }
        /**
        * Stop the GameSystem and the connected game.
        *
        * @function stop
        */
        function stop() {
            _this.isGameActive = false;
        }
        /**
        * Connect a game module to the GameSystem.
        *
        * @function connectGame
        * @param {object} game A game module.
        */
        function connectGame(game) {
            _this.connectedGame = game;
        }
        // Functions returned by the module
        return {
            init: init,
            stop: stop,
            start: start,
            isPaused: isPaused,
            isActive: isActive,
            connectGame: connectGame,
            togglePause: togglePause
        };
    }
    /**
    * The Game module acts as an abstract module used to build a Game object
    * that manages the control, update and rendering of the game.
    *
    * @abstract
    * @author Salinder Sidhu
    * @module Game
    */
    function Game(ctx, canvas, FPS) {
        // Module constants and variables
        var _this = this;
        _this.ctx = ctx;
        _this.FPS = FPS;
        _this.canvas = canvas;
        _this.gameObjects = {};
        _this.customUpdate = null;
        _this.customRender = null;
        /**
        * Abstract function that initializes the Game. This function needs to
        * be overriden.
        *
        * @abstract
        * @function init
        */
        function init() {
            throw new Error('Cannot call abstract function!');
        }
        /**
        * Abstract function that resets the Game. This function needs to be
        * overriden.
        *
        * @abstract
        * @function reset
        */
        function reset() {
            throw new Error('Cannot call abstract function!');
        }
        /**
        * Delete a conrete GameObject from the Game if it is flaged for
        * removal.
        *
        * @private
        * @function handleDelete
        * @param {object} gameObject The concrete GameObject.
        * @param {string} type The concrete GameObject's type.
        */
        function handleDelete(gameObject, type) {
            if (gameObject.canDelete()) {
                _this.gameObjects[type].splice(
                    _this.gameObjects[type].indexof(gameObject),
                    1
                );
            }
        }
        /**
        * Update the game and call the custom update function if a custom
        * update function is connected to the game.
        *
        * @function update
        */
        function update() {
            // Call the custom update function if it is defined
            if (_this.customUpdate) {
                _this.customUpdate();
            }
            // Update all of the GameObjects and handle GameObject deletion
            Object.keys(_this.gameObjects).forEach(function (type) {
                _this.gameObjects[type].forEach(function (obj) {
                    obj.update(FPS);
                    handleDelete(obj, type);
                });
            });
        }
        /**
        * Render the game and call the custom render function if a custom
        * render function is connected to the Game.
        *
        * @function render
        */
        function render() {
            // Clear the canvas prior to rendering
            _this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
            // Call the custom render function if it is defined
            if (_this.customRender) {
                _this.customRender();
            }
            // Render all of the GameObjects in order of their render priority
            $.map(_this.gameObjects, function (value) {
                return value;
            }).sort(function (gameObjA, gameObjB) {
                return gameObjA.getDrawPriority() - gameObjB.getDrawPriority();
            }).forEach(function (obj) {
                obj.render(_this.ctx);
            });
        }
        /**
        * Add a concrete GameObject with a specific type to the Game.
        *
        * @function addGameObject
        * @param {object} gameObject The concrete GameObject.
        * @param {string} type The concrete GameObject's type.
        */
        function addGameObject(gameObject, type) {
            _this.gameObjects[type].push(gameObject);
        }
        /**
        * Connect a custom update function to the Game.
        *
        * @function connectCustomUpdate
        * @param {function} customUpdate The custom update function.
        */
        function connectCustomUpdate(customUpdate) {
            _this.customUpdate = customUpdate;
        }
        /**
        * Connect a custom render function to the Game.
        *
        * @function connectCustomRender
        * @param {function} customRender The custom render function.
        */
        function connectCustomRender(customRender) {
            _this.customRender = customRender;
        }
        // Functions returned by the module
        return {
            init: init,
            reset: reset,
            update: update,
            render: render,
            addGameObject: addGameObject,
            connectCustomRender: connectCustomRender,
            connectCustomUpdate: connectCustomUpdate
        };
    }
    // Modules returned by GameWork
    return {
        Game: Game,
        Utils: Utils,
        Sprite: Sprite,
        GameObject: GameObject,
        GameSystem: GameSystem,
        FadingText: FadingText,
        BoundingBox: BoundingBox,
        ResourceManager: ResourceManager,
        SpriteAnimation: SpriteAnimation
    };
}());
