'use strict';
var AdjModule = (function () { 
    var adjs = [
        "lovely",
        "delightful",
        "splendid"
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