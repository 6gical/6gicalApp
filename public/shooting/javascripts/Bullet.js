var Bullet = enchant.Class.create(enchant.Sprite, {
    initialize: function (game, x, y) {
        enchant.Sprite.call(this,16, 16);
        this.game = game;
        this.image = game.getAsset('images/graphic.png');
        this.x = x;
        this.y = y;
        this.vx = 1;
        this.vy = 0;
        this.frame = 1;
        this.addEventListener('enterframe', function() {
            this.move();
            this.removeIfOffScreen();
        });
        game.bullets.push(this);
        game.rootScene.addChild(this);
    },
    move: function() {
        this.x = Math.round(this.x + this.vx);
        this.y = Math.round(this.y + this.vy);
    },
    removeIfOffScreen: function() {
        var game = this.game;
        if (this.y >game.height || this.x > game.width ||
           this.x < -this.width || this.y < -this.height) {
            this.remove();
        }
    },
    remove: function () {
        this.game.rootScene.removeChild(this);
        _util.remove(this.game.bullets, this);
        delete this;
    }
});

var DirectedBullet = enchant.Class.create(Bullet, {
    initialize: function (game, x, y, direction, speed) {
        Bullet.call(this, game, x, y);
        this.image = game.getAsset('images/graphic.png');
        this.frame = 1;
        this.vx = Math.cos(direction) * speed;
        this.vy = Math.sin(direction) * speed;
        this.direction = direction;
        this.speed = speed;
    },
    move: function() {
        this.x = Math.round(this.x + this.vx);
        this.y = Math.round(this.y + this.vy);
    }
});


var AimingBullet = enchant.Class.create(Bullet, {
    initialize: function (game, x, y, tx, ty, speed) {
        Bullet.call(this, game, x, y);
        this.image = game.getAsset('images/graphic.png');
        this.frame = 1;
        var d = Math.sqrt((tx - x) * (tx - x) + (ty - y) * (ty - y));
        this.vx = (tx - x) / d * speed;
        this.vy = (ty - y) / d * speed;
        this.speed = speed;
    },
    move: function() {
        this.x = Math.round(this.x + this.vx);
        this.y = Math.round(this.y + this.vy);
    }
});

var NWayBullets = enchant.Class.create({
    initialize: function(game, x, y, vx, vy, theta, n) {
        this.game = game;
        this.bullets = [];
        var radStep = Math.PI / 180 * theta;
        var rad = n % 2 === 0 ? -n / 2 * radStep : (-n / 2 + 0.5) * radStep;
        for (var i = 0; i < n; i++, rad += radStep) {
            var c = Math.cos(rad);
            var s = Math.sin(rad);
            var bullet = new Bullet(game, x, y);
            bullet.vx = vx * c - vy * s;
            bullet.vy = vx * s + vy * c;
            this.bullets.push(bullet);
            game.bullets.push(bullet);
        }
    }
});
