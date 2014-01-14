enchant();

var logiOsciGame = {
    screenWidth: 528,
    screenHeight: 396,
    PLAYER_SHOT_MAX: 3,
    bgm: navigator.userAgent.indexOf('Gecko') != -1 && navigator.userAgent.indexOf('Mac') != -1 ?
        'sounds/esot_bgm.wav' : 'sounds/esot_bgm.mp3'
};


window.onload = function () {
    var fps = 24;
    logiOsciGame.game = new Game(logiOsciGame.screenWidth, logiOsciGame.screenHeight);
    var game = logiOsciGame.game;
    game.fps = fps;
    game.score = 0;

    game.preload('images/graphic.png');
    game.preload(logiOsciGame.bgm);

    game.onload = function () {
        var stage = FirstStage;
        var spaceBg = new SpaceBg(logiOsciGame.screenWidth, logiOsciGame.screenHeight);
        game.rootScene.addChild(spaceBg);

        logiOsciGame.player = new Player(0, 152);
        var player = logiOsciGame.player;
        logiOsciGame.items = new Array();
        logiOsciGame.enemies = new Array();

        var enemies = logiOsciGame.enemies;
        game.rootScene.backgroundColor = 'black';
        game.rootScene.addEventListener('enterframe', function () {
            var e = stage.enemies;
            for (var i = 0; i < e.length; i++) {
                if (game.frame == e[i].frame) {
                    var omega = e[i].y < logiOsciGame.screenHeight / 2 ? 0.01 : -0.01;
                    var enemy = new EnemyType[e[i].type](logiOsciGame.screenWidth,
                                                         e[i].y,
                                                         omega,
                                                         e[i].hasItem);
                    enemy.key = game.frame;
                    enemies[game.frame] = enemy;
                }
            }

            scoreLabel.score = game.score;
            spaceBg.scroll(game.frame);
        });
        var scoreLabel = new ScoreLabel(8, 8);
        game.rootScene.addChild(scoreLabel);
    };
    game.onerror = function(e) {
        alert('sorry. something wrong:' + e.message);
    };
    game.start();
    game.onstart = function() {
        game.assets[logiOsciGame.bgm].play();
        game.assets[logiOsciGame.bgm].src.loop = true;
    };
};
