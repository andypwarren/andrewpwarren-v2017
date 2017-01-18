'use strict';
var AdjModule = (function () { 
    var adjs = [
        "LOVELY",
        "DELIGHTFUL",
        "SPLENDID"
    ];

    var rndItemInArray = function(arr){
        var rnd = Math.floor(Math.random() * (arr.length));
        return arr[rnd];
    };

    var adjModule = {};

    adjModule.applyAdjective = function(){
        $('#adjective').html(rndItemInArray(adjs))
    }

    return adjModule;
}());