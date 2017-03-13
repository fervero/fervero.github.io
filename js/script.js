(function() {
    var $scoreHtml,
        $styleSlot,
        $well,
        maxWidth,
        minWidth,
        currentWidth = 6,
        well,
        currentBrick, 
        nextBrick,
        lineCount = 0, 
        defaultStep = 1600,
        step = 200, 
        gameLoopId = 0, 
        animationId = 0;
    
    function unpauseGame() {
    // Just clear all and every window possibly imposed on the well, restart the loops and reattach the keyboard listener.
        gameLoopId = setTimeout(gameLoop, step);
        animationId = window.requestAnimationFrame(animationLoop);
    }

    function gameOver() {
        initGame();
    }

    function animationLoop() {
        if(currentBrick)
            currentBrick.updateHtml();
        $scoreHtml.html(lineCount.toString());
        animationId = window.requestAnimationFrame(animationLoop);
    }

    protoBrick.playMe = function() {
        if (this.collision()) 
            return;
        var bestPlace = this.findBestPlace();
        for (var a = 0; a < bestPlace.angle; a++) {
            this.rotate();
//            this.updateHtml();
        }
        while ( (this.getPos()[0] > bestPlace.position[0] ) && (this.moveLeft()  ) );
        while ( (this.getPos()[0] < bestPlace.position[0] ) && (this.moveRight() ) );
//            this.updateHtml();
    }

    function getNewBrick(well) {
        currentBrick = Object.create(protoHtmlBrick);
        currentBrick.init(well);
        currentBrick.rebase(well);
        currentBrick.initHtml();
        currentBrick.playMe();
    }

    function gameLoop() {
        if(currentBrick.stepDown()) {
    // if it can fall, let it
            gameLoopId = setTimeout (gameLoop, step);
        } else {
    // and if it cannot: update the well with new bricks,
            currentBrick.updateHtml();
                /* that additional updateHtml, out of the animation loop, is necessary, as, every now and then, 
                weird timing would make a brick "killed" before the last update of the graphical representation 
                was made. Result: a brick looking as if hovering one row too high. */
            lineCount += currentBrick.done();  // The done() method, among doing other things, returns the number of lines that got completed and removed from the well.
                // get another block: can it move at all?
            getNewBrick(well);
            if ( currentBrick.collision() ) {
                gameOver();
                return;
            }
            gameLoopId = setTimeout(gameLoop, step);    
        }
    }

    function initGame() {
        lineCount = 0;
        window.clearTimeout(gameLoopId);
        well.resetDeadBlocks();
        getNewBrick(well);
        unpauseGame();
    }
/*
    function resizeGame(x) {
        var width = (100 / x).toFixed(3) + "%",
            height = (50 / x).toFixed(3) + "%";
        var newcss = "#well > .brick { width: " +
            width +
            "; height: " +
            height + 
            "; }";
        well = Object.create(protoHtmlWell);
        well.htmlInit(x, $well);
        step = Math.max(defaultStep / x, 20);
        $styleSlot.empty().html(newcss);
        well.fillWithRubble();
        paused = false;
    }
    
    */
    
    function initTetrx() {
        // First, cache the DOM elements.
        $well = $("#well");
        $scoreHtml = $("#score");
        $styleSlot = $("#dynamic");
    // Second, init the logic of the well and the preview window.    
        well = Object.create(protoHtmlWell);
        well.htmlInit(currentWidth, $well);
        //resizeGame(currentWidth);
        initGame();        
    }

    function initAccordion() {
        $(".accordion dd").hide();
        $(".accordion dt").click(function() {
            $(this).next().slideToggle(150);
        })
    }

    window.onload =  function() {
        initAccordion();
        initTetrx();
    }    
})();
