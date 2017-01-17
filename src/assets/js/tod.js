var getHr = function(){
    return new Date().getHours();
};

var ranges = [
    {
        start: 0,
        end: 12,
        text: 'MORNING',
        cssClass: 'morning' 
    },
    {
        start: 12,
        end: 18,
        text: 'AFTERNOON',
        cssClass: 'afternoon' 
    },
    {
        start: 18,
        end: 24,
        text: 'EVENING',
        cssClass: 'evening' 
    }
]

var getRange = function(hour){
    return ranges.filter(function(range){
        if ((hour >= range.start) && (hour < range.end)) {
            return range;
        }
    });
}

var applyText = function(text){
    $('.highlight').html(text);
}

var applyStyle = function(className){
    $('body').addClass(className);
}

var run = function(){
    var range = getRange(getHr())[0];
    applyText(range.text);
    applyStyle(range.cssClass);
    $(function(){
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
                setTimeout(function(){
                    $('.typed-cursor').addClass('hide-op');
                    $('.typed-cursor').removeClass('animate');
                }, 6000);
            },
        });
    });
}
run();