'use strict';
var TodModule = (function () { 
    var todModule = {};

    var ranges = [
        {
            start: 0,
            end: 12,
            text: 'morning',
            cssClass: 'morning' 
        },
        {
            start: 12,
            end: 18,
            text: 'afternoon',
            cssClass: 'afternoon' 
        },
        {
            start: 18,
            end: 24,
            text: 'evening',
            cssClass: 'evening' 
        }
    ]

    var getHr = function(){
        return new Date().getHours();
    };

    todModule.getRange = function(){
        var hour = getHr();
        return ranges.filter(function(range){
            if ((hour >= range.start) && (hour < range.end)) {
                return range;
            }
        })[0];
    }

    return todModule;
}());