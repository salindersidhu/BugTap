/* jshint browser:true, jquery:true, quotmark:single, maxlen:80, eqeqeq:true,
strict:true, unused:false, undef:true */

/**
* Sprite represents a sprite sheet image. A single image consisting of multiple
* images that together form an animation.
*
* @function Sprite
* @param {string} Sprite.image The Sprite sheet image.
* @param {number} Sprite.numFrames The number of frames on the sprite sheet
* image.
* @param {number} Sprite.frameWidth The width of each individual frame on the
* sprite sheet image.
*/
function Sprite() {
    'use strict';
    // Sprite object attributes
    this.image = null;
    this.numFrames = null;
    this.frameWidth = null;
}

/**
* The Utils module provides useful utility methods.
*
* @author Salinder Sidhu
* @module Utils
*/
var Utils = (function () {
    'use strict';
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
    * Wrapper that executes a method within a context extractly once.
    *
    * @function once
    * @param {object} method The method to be called.
    * @param {object} context The context of the method.
    */
    function once(method, context) {
        var result;
        return function() {
            if (method) {
                result = method.apply(context || this, arguments);
            }
            return result;
        };
    }
    // Methods returned by the module
    return {
        once: once,
        randomItem: randomItem,
        randomNumber: randomNumber
    };
}());

/**
* The ResourceManager module handles creation, storage and management of game
* resources.
*
* @author Salinder Sidhu
* @module ResourceManager
*/
var ResourceManager = (function () {
    'use strict';
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
    // Methods returned by the module
    return {
        addImage: addImage,
        getImage: getImage,
        addSprite: addSprite,
        getSprite: getSprite
    };
}());

/**
* The BoundingBox module provides methods for calculating bounding box
* collision detection.
*
* @author Salinder Sidhu
* @module BoundingBox
* @param {number} initX The BoundingBox's initial x position coordinate.
* @param {number} initY The BoundingBox's initial y position coordinate.
* @param {number} boxWidth The BoundingBox's width.
* @param {number} boxHeight The BoundingBox's height.
*/
function BoundingBox(initX, initY, boxWidth, boxHeight) {
    'use strict';
    // Module constants and variables
    var x = initX;
    var y = initY;
    var width = boxWidth;
    var height = boxHeight;
    /**
    * Return true if this BoundingBox completly overlaps another BoundingBox,
    * otherwise return false.
    *
    * @function isOverlap
    * @param {object} otherBox A BoundingBox object.
    * @return {boolean} If this BoundingBox and other BoundingBox overlap.
    */
    function isOverlap(otherBox) {
        return (
            x <= otherBox.getX() &&
            y <= otherBox.getY() &&
            (x + width) >= (otherBox.getX() + otherBox.getWidth()) &&
            (y + height) >= (otherBox.getY() + otherBox.getHeight())
        );
    }
    /**
    * Return true if this BoundingBox partially overlaps or intersects another
    * BoundingBox, otherwise return false.
    *
    * @function isIntersect
    * @param {object} otherBox A BoundingBox object.
    * @return {boolean} If this BoundingBox and other BoundingBox intersect.
    */
    function isIntersect(otherBox) {
        return (
            x <= (otherBox.getX() + otherBox.getWidth()) &&
            (x + width) >= otherBox.getX() &&
            y <= (otherBox.getY() + otherBox.getHeight()) &&
            (y + height) >= otherBox.getY()
        );
    }
    /**
    * Return true if this BoundingBox intersects with the mouse cursor,
    * otherwise return false.
    *
    * @function isMouseOverlap
    * @param {number} mouseX The x coordinate of the mouse.
    * @param {number} mouseY The y coordinate of the mouse.
    * @return {boolean} If this BoundingBox and the mouse cursor intersect.
    */
    function isMouseOverlap(mouseX, mouseY) {
        return (
            mouseX > x && mouseX < (x + width) &&
            mouseY > y && mouseY < (y + height)
        );
    }
    /**
    * Update the local origin position of the BoundingBox to a new point. This
    * method is usually called when an object (associated with the BoundingBox)
    * changes its position.
    *
    * @function update
    * @param {number} newX The new x coordinate of the BoundingBox's positon.
    * @param {number} newY The new y coordinate of the BoundingBox's positon.
    */
    function update(newX, newY) {
        x = newX;
        y = newY;
    }
    /**
    * Return the x coordinate of the BoundingBox's position.
    *
    * @function getX
    * @return {number} BoundingBox's x coordinate.
    */
    function getX() {
        return x;
    }
    /**
    * Return the y coordinate of the BoundingBox's position.
    *
    * @function getY
    * @return {number} BoundingBox's y coordinate.
    */
    function getY() {
        return y;
    }
    /**
    * Return the width of the BoundingBox.
    *
    * @function getWidth
    * @return {number} BoundingBox's width.
    */
    function getWidth() {
        return width;
    }
    /**
    * Return the height of the BoundingBox.
    *
    * @function getHeight
    * @return {number} BoundingBox's height.
    */
    function getHeight() {
        return height;
    }
    // Methods returned by the module
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
* The SpriteAnimation module provides methods for creating and rendering an
* animated sprite.
*
* @author Salinder Sidhu
* @module SpriteAnimation
* @param {object} sprite The Sprite object of the sprite animation.
* @param {number} cyclesPerSecond The number of frame update cycles per
* second.
* @param {number} [initFrame] - The initial animation starting frame.
*/
function SpriteAnimation(sprite, cyclesPerSecond, initFrame) {
    'use strict';
    // Module constants and variables
    var CPS = cyclesPerSecond;
    var image = sprite.image;
    var width = sprite.image.width;
    var height = sprite.image.height;
    var numFrames = sprite.numFrames;
    var frameWidth = sprite.frameWidth;
    var frameIndex = initFrame !== undefined ? initFrame : -1;
    var opacity = 1;
    var cycleCounter = 0;
    /**
    * Update the sprite animation frame by frame on each method call.
    *
    * @function update
    */
    function update() {
        cycleCounter += 1;
        // Update the frame index when the cycle counter has triggered
        if (cycleCounter > CPS) {
            cycleCounter = 0;
            // Update and reset the frame index at the end of the animation
            frameIndex = (frameIndex + 1) % numFrames;
        }
    }
    /**
    * Render the animated sprite frame by frame on each method call.
    *
    * @function render
    * @param {object} ctx The 2D canvas context.
    * @param {number} x The y position coordinate of the sprite animation.
    * @param {number} y The y positon coordinate of the sprite animation.
    * @param {number} angle The angle, in radians, of the sprite animation.
    */
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
        return opacity;
    }
    /**
    * Reduce the opacity of the sprite animation. This generates a fade out
    * effect for sprite animation.
    *
    * @function reduceOpacity
    * @param {number} FPS The game's frames per second.
    * @param {number} fadespeed The speed of the fade out effect.
    */
    function reduceOpacity(FPS, fadeSpeed) {
        opacity -= 1 / (FPS * fadeSpeed);
        // Condition the opacity so it is non-negative
        if (opacity < 0) {
            opacity = 0;
        }
    }
    // Methods returned by the module
    return {
        update: update,
        render: render,
        getOpacity: getOpacity,
        reduceOpacity: reduceOpacity
    };
}

/**
* The FadingText module provides methods for creating and rendering fading
* text with an outline.
*
* @author Salinder Sidhu
* @module FadingText
* @param {string} text
* @param {string} font
* @param {string} colour
* @param {number} speed
*/
function FadingText(text, font, colour, speed) {
    'use strict';
    // Module constants and variables
    var fadeText = text;
    var fontStyle = font;
    var textColour = colour;
    var fadeSpeed = speed;
    var outlineWidth = null;
    var outlineColour = null;
    var canDrawOutline = false;
    var opacity = 1;
    /**
    * Update the text's fade effect frame by frame on each method call.
    *
    * @function update
    * @param {number} FPS The game's frames per second.
    */
    function update(FPS) {
        // Reduce opacity
        opacity -= 1 / (FPS  * fadeSpeed);
        // Condition the opacity so it is non-negative
        if (opacity < 0) {
            opacity = 0;
        }
    }
    /**
    * Render the fading text frame by frame on each method call.
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
        // Configure the canvas opacity
        ctx.globalAlpha = opacity;
        // Rotate canvas to draw the text at an angle
        ctx.rotate(angle);
        // Set canvas font
        ctx.font = fontStyle;
        // Draw the text outline if can draw outline flag is true
        if (canDrawOutline) {
            ctx.strokeStyle = outlineColour;
            ctx.lineWidth = outlineWidth;
            ctx.strokeText(fadeText, x, y);
        }
        // Draw the actual text
        ctx.fillStyle = textColour;
        ctx.fillText(fadeText, x, y);
        // Restore the canvas state prior to rendering
        ctx.restore();
    }
    /**
    * Enable rendering of the text's outline and set the colour and width of
    * the text's outline.
    *
    * @function setOutline
    * @param {string} colour The colour of the text's outline.
    * @param {number} width The width of the text's outline.
    */
    function setOutline(colour, width) {
        outlineColour = colour;
        outlineWidth = width;
        canDrawOutline = true;
    }
    /**
    * Return the opacity of the fading text.
    *
    * @function getOpacity
    * @return {number} The opacity of the fading text.
    */
    function getOpacity() {
        return opacity;
    }
    // Methods returned by the module
    return {
        update: update,
        render: render,
        setOutline: setOutline,
        getOpacity: getOpacity
    };
}
