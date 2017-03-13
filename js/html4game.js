var protoHtmlWell = Object.create(protoWell);

protoHtmlWell.clear = function() {
    this.htmlTarget.empty();
}

protoHtmlWell.append = function(elem) {
    this.htmlTarget.append(elem);
} 

protoHtmlWell.htmlInit = function(width, htmlTarget) {
    this.htmlTarget = htmlTarget;
    this.sqWidth = [];
    this.sqHeight = [];
    this.width = width || 10;
    this.depth = 2 * this.width + 2;
    this.resetDeadBlocks();
    this.calculateSquareSize();
}

protoHtmlWell.createHtmlSquare = function(x, y) {
/* Builds a basic square building block of the game; x and y are expressed in abstract coordinates. */
    var newDiv = $("<div></div>").basicSquare(this.sqWidth[1], this.sqHeight[1]);
    if(this.moveHtmlSquare(newDiv, x, y) ) {
        this.append(newDiv);
        return newDiv;
    } else
        return false;
}

protoHtmlWell.moveHtmlSquare = function (div, x, y) {
// If not out of bounds - put the square there.
    if((x >= this.width) || (y >= this.depth) ) return false;
    if (y < 2) return div;
    y -= 2;
    return div
        .css("left", this.sqWidth[x])
        .css("top", this.sqHeight[y])
}

protoHtmlWell.resetDeadBlocks = function() {
// Initializes, or re-initializes for a new game, the well.        
    this.init(this.width, this.depth);
    this.clear();
}

protoHtmlWell.rebuildOldBlocks = function() {
// removes all the fallen bricks and recreates the stack, based on the abstract well
    this.clear();
    this.repaint();
}

protoHtmlWell.repaint = function() {
// "Repaint" mean: put again visual representation of dead bricks on screen.
    var newDiv;
    for (var x = 0; x < this.width; x++) {
        for (var y = 0; y < this.depth; y++) {
            if (!this.freeAt (x,y)) {
                newDiv = this.createHtmlSquare (x, y);
                this.append(newDiv.repaintDead());
            }  // if...
        } // for y...
    } // for x...    
}
        
 protoHtmlWell.fillWithRubble = function() {
/* Haphazardly drops some bricks at the bottom of the well. It's used solely for decoration and as a visual
    hint at relative sizes of the well and the bricks. */
    for (var y = this.depth - 1; y > this.depth - 5; y--)
        for (var x = 0; x < this.depth; x++) {
            if (Math.random() < 0.5) {
                this.wellArray[y][x] = 0;
            }
        }
    this.repaint();
}

 protoHtmlWell.calculateSquareSize = function() {
/* Sets the size of a basic square. For a default, 10-wide, 20-high well, the basic square would be 10% wide and 5% high. Which does make a square.
   Also, caches the coordinates, expressed in %, of every field on the board. Hence, if we want to put a square with the coordinates        
   (x, y) on the board, we express it in CSS terms as: left: sqWidth[x]; top: sqHeight[y].
   */
    var x = 100 / this.width,
        y = 100 / (this.depth - 2);
    for (var i = 0; i < this.width; i++) {
        this.sqWidth[i] = (x * i).toFixed(3) + "%";
    }
    for (var i = 0; i < this.depth - 2; i++) {
        this.sqHeight[i] = (y * i).toFixed(3) + "%";
    }
}

// HTML brick methods go here

var protoHtmlBrick = Object.create(protoBrick);
    
protoHtmlBrick.resetBlocks = function() {
    this.htmlSquares =  [];
}
     
protoHtmlBrick.initHtml = function() {
// Initializes the visual representation of the 4-square block, placing it according to its 'pos' property.
    this.resetBlocks();
    var newDiv,
        pos = this.getPos();
    for (var i = 0; i < this.xy.length; i++ ) {
        newDiv = $("<div></div>").basicSquare (0, 0);
        this.myWorld.moveHtmlSquare(
            newDiv,
            pos[0] + this.xy[i][0],
            pos[1] + this.xy[i][1]);                    
        this.myWorld.append(newDiv);
        this.htmlSquares.push(newDiv);
    }
    return this;
}
    
protoHtmlBrick.updateHtml = function() {
// Moves a block if its visual representation exists, creates if doesn't.
    pos = this.getPos();
    if (this.htmlSquares)
        {
            for (var i = 0; i < this.htmlSquares.length; i++ ) {
                this.myWorld.moveHtmlSquare(
                    this.htmlSquares[i],
                    pos[0] + this.xy[i][0],
                    pos[1] + this.xy[i][1]
                );
            if (pos[1] + this.xy[i][1] < 2)
                this.htmlSquares[i].addClass("hidden");
            else
                this.htmlSquares[i].removeClass("hidden");
                
            }
        } else
            this.initHtml();
}
    
protoHtmlBrick.addClass = function (newClass) {
    for (var i = 0; i < this.htmlSquares.length; i++) {
        this.htmlSquares[i].addClass(newClass);
    }
    return this;
}

protoHtmlBrick.removeClass = function (oldClass) {
    for (var i = 0; i < this.htmlSquares.length; i++) {
        this.htmlSquares[i].removeClass(oldClass);
    }
    return this;
}
        
protoHtmlBrick.done = function() {
/* When we're done with a block (it's fallen to the bottom), we: update the well's abstract model, paint the brick dead, and also tells the well to find and remove any full rows. Returns their number, if there were any.
*/
    var block,
        rows;
    while (this.htmlSquares.length > 0) {
        block = this.htmlSquares.pop();
        this.myWorld.append(block.repaintDead());
    }
    this.myWorld.update(this);
    rows = this.myWorld.findFullRows();
    if ( rows > 0 ) {
        this.myWorld.rebuildOldBlocks();
    }
    return rows;
}

// And here goes our tiny little jQuery plugin.
$.fn.basicSquare = function(x, y) {
    return this
        .addClass("brick")
        .addClass("live-brick")
        .css("left", x)
        .css("top", y);
}

$.fn.repaintDead = function() {
    return this
        .removeClass("live-brick")
        .addClass("dead-brick")
        .shake()
        .css(
        "background-position", 
        "-" + this.css("left") + " -" + this.css("top")        
        );
}

$.fn.shake = function() {
    return this.css(
        "transform", 
        "rotate(" + ( Math.round((Math.random() * 15 - 7.5) ) ) + "deg)");
}

$.fn.shakeEach = function() {
    return this.each(function(index, elem) {
        return $(elem).shake();
    })
}
