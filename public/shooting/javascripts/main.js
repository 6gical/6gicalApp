
enchant();

window.onload = function () {
    var screenWidth = 320;
    var screenHeight = 320;
    var fps = 24;

    game = new Game(screenWidth, screenHeight);
    game.fps = fps;
    game.score = 0;
    game.touched = false;

    game.preload('graphic.png');
    game.preload('esot_bgm.mp3');

    game.onload = function () {

        player = new Player(0, 152);
        enemies = new Array();

        game.rootScene.backgroundColor = 'black';
        game.rootScene.addEventListener('enterframe', function () {
            if(rand(1000) < game.frame / 20 * Math.sin(game.frame / 100) + game.frame / 20 + 50) {
                var y = rand(320);
                var omega = y < 160 ? 0.01 : -0.01;
                var enemy = new Enemy(320, y, omega);
                enemy.key = game.frame;
                enemies[game.frame] = enemy;
            }
            scoreLabel.score = game.score;
        });
        scoreLabel = new ScoreLabel(8, 8);
        game.rootScene.addChild(scoreLabel);
    };
    game.start();
    game.onstart = function() {
	game.assets['esot_bgm.mp3'].play();
	game.assets['esot_bgm.mp3'].src.loop = true;
    }
};

var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y) {
        enchant.Sprite.call(this, 16, 16);
        this.image = game.assets['graphic.png'];
        this.x = x;
        this.y = y;

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
            if(game.touched && game.frame % 3 == 0) {
                var s = new PlayerShoot(this.x, this.y);
            }
        });

        game.rootScene.addChild(this);
    }
});

var Enemy = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y, omega) {
        enchant.Sprite.call(this, 16, 16);
        this.image = game.assets['graphic.png'];
        this.x = x;
        this.y = y;

        this.frame = 3;
        this.omega = omega;

        this.direction = 0;
        this.moveSpeed = 3;

        this.addEventListener('enterframe', function () {
            this.move();
            if(this.y > 320 || this.x > 320 || this.x < -this.width || this.y < -this.height) {
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
        this.image = game.assets['graphic.png'];
        this.x = x;
        this.y = y;
        this.frame = 1;
        this.direction = direction;
        this.moveSpeed = 10;
        this.addEventListener('enterframe', function () {
            this.x += this.moveSpeed * Math.cos(this.direction);
            this.y += this.moveSpeed * Math.sin(this.direction);
            if(this.y > 320 || this.x > 320 || this.x < -this.width || this.y < -this.height) {
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
    initialize: function (x, y) {
        Shoot.call(this, x, y, 0);
        this.addEventListener('enterframe', function () {
            for (var i in enemies) {
                if(enemies[i].intersect(this)) {
                    this.remove();
                    enemies[i].remove();
                    game.score += 100;
                }
            }
        });
    }
});

var EnemyShoot = enchant.Class.create(Shoot, {
    initialize: function (x, y) {
        Shoot.call(this, x, y, Math.PI);
        this.addEventListener('enterframe', function () {
            if(player.within(this, 8)) {
                game.end(game.score, "SCORE: " + game.score)
            }
        });
    }
});