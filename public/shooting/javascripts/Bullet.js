var Bullet = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y) {
        enchant.Sprite.call(this, 16, 16);
        this.image = logiOsciGame.game.assets['images/graphic.png'];
        this.x = x;
        this.y = y;
        this.vx = 1;
        this.vy = 0;
        this.frame = 1;
        this.addEventListener('enterframe', this.move);
        this.addEventListener('enterframe', this.detectCollision);
        this.addEventListener('enterframe', this.removeIfOffScreen);
        logiOsciGame.game.rootScene.addChild(this);
    },
    move: function() {
        this.x += this.vx;
        this.y += this.vy;
    },
    detectCollision: function() {
        if (logiOsciGame.player.within(this, 8)) {
            logiOsciGame.game.end(logiOsciGame.game.score,
                                  'SCORE: ' + logiOsciGame.game.score);
            logiOsciGame.game.assets['sounds/esot_bgm.mp3'].stop();
        }
    },
    removeIfOffScreen: function() {
        if (this.y > logiOsciGame.screenHeight || this.x > logiOsciGame.screenWidth ||
           this.x < -this.width || this.y < -this.height) {
            this.remove();
        }
    },
    remove: function () {
        logiOsciGame.game.rootScene.removeChild(this);
        delete this;
    }
});

var DirectedBullet = enchant.Class.create(Bullet, {
    initialize: function (x, y, direction, speed) {
        Bullet.call(this, x, y);
        this.image = logiOsciGame.game.assets['images/graphic.png'];
        this.frame = 1;
        this.vx = Math.cos(direction) * speed;
        this.vy = Math.sin(direction) * speed;
        this.direction = direction;
        this.speed = speed;
    },
    move: function() {
        this.x += ~~this.vx;
        this.y += ~~this.vy;
    }
});


var AimingBullet = enchant.Class.create(Bullet, {
    initialize: function (x, y, tx, ty, speed) {
        Bullet.call(this, x, y);
        this.image = logiOsciGame.game.assets['images/graphic.png'];
        this.frame = 1;
        var d = Math.sqrt((tx - x) * (tx - x) + (ty - y) * (ty - y));
        this.vx = (tx - x) / d * speed;
        this.vy = (ty - y) / d * speed;
        this.speed = speed;
    },
    move: function() {
        this.x += ~~this.vx;
        this.y += ~~this.vy;
    }
});

