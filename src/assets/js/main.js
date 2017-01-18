var applyText = function(text){
    $('.highlight').html(text);
}

var applyStyle = function(className){
    $('body').addClass(className);
}

var setElemAsHeader = function(elem){
    $(elem).addClass('header');
}

var removeElem = function(elem){
    $(elem).addClass('hidden');
}

var setHeaderText = function(visited){
    if (visited) {
        setElemAsHeader('#previous-vistor')
        removeElem('#first-time-vistor')
    } else {
        removeElem('#previous-vistor')
        setElemAsHeader('#first-time-vistor')
    }
}

var run = function(){
    var range = TodModule.getRange();
    applyText(range.text);
    applyStyle(range.cssClass);
    setHeaderText(CookieModule.readVisitedCookie());
    $('.header').typed({
        strings: [$('.header').html()],
        typeSpeed: 50,
        cursorChar: '_',
        preStringTyped: function() {
            $('.typed-cursor').addClass('animate');
            $('.header').removeClass('hidden');
        },
        onStringTyped: function() {
            $('.content').addClass('show');
            CookieModule.setVisitedCookie();
            setTimeout(function(){
                $('.typed-cursor').addClass('hide-op');
                $('.typed-cursor').removeClass('animate');
            }, 6000);
        },
    });
}
run();