'use strict';
var CookieModule = (function () { 
    var cookieModule = {};

    cookieModule.setVisitedCookie = function(){
        document.cookie="visited=true";
    }

    cookieModule.readVisitedCookie = function(){
        var cookies = document.cookie.split(';');
        return cookies.filter(function(cookie){
            var parts = cookie.split('=');
            if (parts[0] === 'visited' || parts[0] === ' visited') {
                return cookie;
            }
        })[0];
    }

    return cookieModule;
}());