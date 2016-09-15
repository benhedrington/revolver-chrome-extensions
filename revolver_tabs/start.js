var _remainingTimeDisplayer;

function RemainingTimeDisplayer() {

    this.currentTick = 0;
    this.tickMax = 15;
    this.timerElement;
    this.timer;

    var formatSeconds = function(seconds) {
        if(seconds < 10) {
            return '0' + seconds;
        }
        return '' + seconds; 
    }
    
    function displayTimer(timerElement, tick, tickMax) {
        var seconds = tickMax - tick - 1;
        var minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        timerElement.innerHTML = '' + minutes + ':' + formatSeconds(seconds);
    }
    
    function next(value, valueMax) {
        return (value + 1) % valueMax; 
    }
    
    function doTick(timerElement, currentTick, tickMax) {
        //console.log('tick %d', currentTick);
        displayTimer(timerElement, currentTick, tickMax);
    
        var nextTick = next(currentTick, tickMax);
        currentTick = nextTick;
    
        return {
            currentTick: currentTick,
        }
    }
    
    
    this._tick = function(timerElement) {
        var that = this;
        return function() {
            nextState = doTick(timerElement, that.currentTick, that.tickMax)
            that.currentTick = nextState.currentTick;
            that.timer = setTimeout(that._tick(timerElement), 1000);
        }
    }
    
    function setTimerStyle(timerElement) {
        timerElement.style.position =  'fixed';
        timerElement.style.fontSize =  '2em';
        timerElement.style.backgroundColor =  'white';
        timerElement.style.borderLeftStyle = 'solid';
        timerElement.style.borderLeftColor = 'black';
        timerElement.style.borderTopStyle = 'solid';
        timerElement.style.borderTopColor = 'black';
        timerElement.style.padding =  '10px';
        timerElement.style.bottom =  '0px';
        timerElement.style.right =  '0px';
        timerElement.style.opacity =  '0.5';
        timerElement.style.zIndex =  '5000';
        timerElement.style.fontFamily = 'serif';
    }
    
    function setTimerVisible(timerElement, visible) {
        if(visible) {
            timerElement.style.visibility = "visible";
        }
        else {
            timerElement.style.visibility = "hidden";
        }
    }
    
    this.start = function(timelapse) {
        //console.log('Start');
        this.timerElement = document.createElement("div");
        this.timerElement.id = "revolver-timer";
        document.body.insertBefore(this.timerElement, document.body.firstChild);

        setTimerStyle(this.timerElement);
        this.currentTick = 0;
        this.tickMax = timelapse;
        this._tick(this.timerElement)(); 
    }
    
    this.stop = function() {
        //console.log('Stop');
        this.timerElement.remove();
        clearTimeout(this.timer);
    }
    
    return this;
}


chrome.runtime.sendMessage({method: "getSettings"}, function(response) {
    var settings = response.data;
    if('seconds' in settings) {
        _remainingTimeDisplayer = new RemainingTimeDisplayer();
        _remainingTimeDisplayer.start(settings.seconds);
    }
});
