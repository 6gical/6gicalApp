enchant();

window.onload = function () {
    enchant.ENV.USE_FLASH_SOUND = false;

    var queryObj = _util.queryObj();
    var screenWidth = queryObj['width'] != null ? queryObj['width'] : 640;
    var screenHeight = queryObj['height'] != null ? queryObj['height'] : 360;
    var isDebug = queryObj['debug'] == 'true';

    var game = new LogiOsciGame(screenWidth,
                                screenHeight);
    if (isDebug) {
        game.debug();
    } else {
        game.start();
    }
};
