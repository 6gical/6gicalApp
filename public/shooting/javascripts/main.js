
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
    game = new Game(logiOsciGame.screenWidth, logiOsciGame.screenHeight);
    game.fps = fps;
    game.score = 0;
    game.touched = false;

    game.preload('images/graphic.png');
    game.preload(logiOsciGame.bgm);

    game.onload = function () {

        player = new Player(0, 152);
        enemies = new Array();

        game.rootScene.backgroundColor = 'black';
        game.rootScene.addEventListener('enterframe', function () {
            if(rand(1000) < game.frame / 20 * Math.sin(game.frame / 100) + game.frame / 20 + 50) {
                var y = rand(logiOsciGame.screenHeight);
                var omega = y < logiOsciGame.screenHeight / 2 ? 0.01 : -0.01;
                var enemy = new Enemy(logiOsciGame.screenWidth, y, omega);
                enemy.key = game.frame;
                enemies[game.frame] = enemy;
            }
            scoreLabel.score = game.score;
        });
        scoreLabel = new ScoreLabel(8, 8);
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

var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y) {
        enchant.Sprite.call(this, 16, 16);
        this.image = game.assets['images/graphic.png'];
        this.x = x;
        this.y = y;

	this.shoots = [];

        this.frame = 0;

        game.rootScene.addEventListener('touchstart', function (e) {
            player.x = e.x;
            player.y = e.y;
            game.touched = true;
        });
        game.rootScene.addEventListener('touchmove', function (e) {
            player.x = e.x;
            player.y = e.y;
        });
        game.rootScene.addEventListener('touchend', function (e) {
            player.x = e.x;
            player.y = e.y;
            game.touched = false;
        });

        this.addEventListener('enterframe', function () {
            if (game.touched && game.frame % 3 == 0 &&
		this.shoots.length < logiOsciGame.PLAYER_SHOOT_MAX) {
                var s = new PlayerShoot(this.x, this.y, this);
		this.shoots.push(s);
            }
        });

        game.rootScene.addChild(this);
    }
});

var Enemy = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y, omega) {
        enchant.Sprite.call(this, 16, 16);
        this.image = game.assets['images/graphic.png'];
        this.x = x;
        this.y = y;

        this.frame = 3;
        this.omega = omega;

        this.direction = 0;
        this.moveSpeed = 3;

        this.addEventListener('enterframe', function () {
            this.move();
            if(this.y > logiOsciGame.screenHeight || this.x > logiOsciGame.screenWidth ||
	       this.x < -this.width || this.y < -this.height) {
                this.remove();
            } else if(this.age % 10 == 0) {
                var s = new EnemyShoot(this.x, this.y);
            }
        });
        game.rootScene.addChild(this);
    },
    move: function () {
        this.direction += this.omega;

        this.x -= this.moveSpeed * Math.cos(this.direction / 180 * Math.PI);
        this.y += this.moveSpeed * Math.sin(this.direction / 180 * Math.PI);
    },
    remove: function () {
        game.rootScene.removeChild(this);
        delete enemies[this.key];
    }
});

var Shoot = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y, direction) {
        enchant.Sprite.call(this, 16, 16);
        this.image = game.assets['images/graphic.png'];
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
        game.rootScene.addChild(this);
    },
    remove: function () {
        game.rootScene.removeChild(this);
        delete this;
    }
});

var PlayerShoot = enchant.Class.create(Shoot, {
    initialize: function (x, y, owner) {
        Shoot.call(this, x, y, 0);
	this.owner = owner;
        this.addEventListener('enterframe', function () {
            for (var i in enemies) {
                if(enemies[i].intersect(this)) {
                    this.remove();
                    enemies[i].remove();
                    game.score += 100;
                }
            }
        });
    },
    remove: function() {
	var self = this;
	this.owner.shoots.some(function(v, i){
	    if (v == self) {
		self.owner.shoots.splice(i, 1);
	    }
	});
	Shoot.prototype.remove.call(this);
    }
});

var EnemyShoot = enchant.Class.create(Shoot, {
    initialize: function (x, y) {
        Shoot.call(this, x, y, Math.PI);
        this.addEventListener('enterframe', function () {
            if(player.within(this, 8)) {
                game.end(game.score, "SCORE: " + game.score);
		game.assets[logiOsciGame.bgm].stop();
            }
        });
    }
});
