
enchant();

var logiOsciGame = {
    screenWidth: 320,
    screenHeight: 320,
    PLAYER_SHOOT_MAX: 3,
    bgm: navigator.userAgent.indexOf('Gecko') != -1 && navigator.userAgent.indexOf('Mac') != -1 ?
	'sounds/esot_bgm.wav' : 'sounds/esot_bgm.mp3'
};


window.onload = function () {
    var fps = 24;
    logiOsciGame.game = new Game(logiOsciGame.screenWidth, logiOsciGame.screenHeight);
    var game = logiOsciGame.game;
    game.fps = fps;
    game.score = 0;
    game.touched = false;

    game.preload('images/graphic.png');
    game.preload(logiOsciGame.bgm);

    game.onload = function () {
        logiOsciGame.player = new Player(0, 152);
        var player = logiOsciGame.player;
        logiOsciGame.enemies = new Array();
        var enemies = logiOsciGame.enemies;

        game.rootScene.backgroundColor = 'black';
        game.rootScene.addEventListener('enterframe', function () {
            if(rand(1000) < game.frame / 20 * Math.sin(game.frame / 100) + game.frame / 20 + 50) {
                var y = rand(logiOsciGame.screenHeight);
                var omega = y < logiOsciGame.screenHeight / 2 ? 0.01 : -0.01;
                var enemy = new ZigzagEnemy(logiOsciGame.screenWidth, y, omega);
                enemy.key = game.frame;
                enemies[game.frame] = enemy;
            }
            scoreLabel.score = game.score;
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

var Shoot = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y, direction) {
        enchant.Sprite.call(this, 16, 16);
        this.image = logiOsciGame.game.assets['images/graphic.png'];
        this.x = x;
        this.y = y;
        this.frame = 1;
        this.direction = direction;
        this.moveSpeed = 10;
        this.addEventListener('enterframe', function () {
            this.x += this.moveSpeed * Math.cos(this.direction);
            this.y += this.moveSpeed * Math.sin(this.direction);
            if(this.y > logiOsciGame.screenHeight || this.x > logiOsciGame.screenWidth ||
               this.x < -this.width || this.y < -this.height) {
                this.remove();
            }
        });
        logiOsciGame.game.rootScene.addChild(this);
    },
    remove: function () {
        logiOsciGame.game.rootScene.removeChild(this);
        delete this;
    }
});

