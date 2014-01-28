enchant();

var logiOsciGame = {
    screenWidth: 528,
    screenHeight: 396,
    PLAYER_SHOT_MAX: 3,
    bgm: 'sounds/esot_bgm.mp3'
};


window.onload = function () {
    var fps = 24;
    logiOsciGame.game = new Game(logiOsciGame.screenWidth, logiOsciGame.screenHeight);
    var game = logiOsciGame.game;
    game.fps = fps;
    game.score = 0;

    game.preload('images/graphic.png');
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
                                                         Item.Type[e[i].item]);
                    enemy.key = game.frame;
                    enemies[game.frame] = enemy;
                }
            }

            scoreLabel.score = game.score;
            spaceBg.scroll(game.frame);
        });
        var scoreLabel = new ScoreLabel(8, 8);
        game.rootScene.addChild(scoreLabel);

        var lifePointGauge = new LifePointGauge(300, 20, player);
        game.rootScene.addChild(lifePointGauge);
        lifePointGauge.moveTo(300, 8);
    };
    game.onerror = function(e) {
        alert('sorry. something wrong:' + e.message);
    };
    game.start();
    game.onstart = function() {
        var sound = new enchant.DOMSound.load(logiOsciGame.bgm, 'audio/mpeg', function() {
            sound.play();
            sound._element.loop = true;
        });
    };
};
