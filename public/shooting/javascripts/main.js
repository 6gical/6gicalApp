enchant();

var BgmType = {
    MIDI: 0,
    MP3: 1,
    WAV: 2
};

var logiOsciGame = {
    bgmType: BgmType.MIDI,
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

    game.onstart = function() {
        if (logiOsciGame.bgmType == BgmType.MIDI) {
            MIDI.Player.loadFile("./sounds/ESOT_MIDI.mid", function() {
                MIDI.Player.start();
            });
        } else {
            game.assets[logiOsciGame.bgm].play();
            game.assets[logiOsciGame.bgm].src.loop = true;
        }
    };

    /** load bgm **/
    if (logiOsciGame.bgmType != BgmType.MIDI) {
        game.preload(logiOsciGame.bgm);
        game.start();
        return;
    }
    MIDI.loadPlugin({
        targetFormat: 'mp3',
        soundfontUrl: 'sounds/',
        instruments: ['lead_1_square'],  // 80
/*      instruments: ['lead_1_square',   // 80
                      'lead_2_sawtooth', // 81
                      'lead_3_calliope', // 82
                      'lead_4_chiff',    // 83
                      'lead_5_charang'], // 84
*/
        callback: function() {
            MIDI.channels[0].instrument = 80;
            MIDI.channels[1].instrument = 80;
            MIDI.channels[2].instrument = 80;
            game.start();
        }
    });
};
