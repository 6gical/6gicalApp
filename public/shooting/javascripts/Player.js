var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y) {
        enchant.Sprite.call(this, 16, 16);
        this.image = logiOsciGame.game.assets['images/graphic.png'];
        this.x = x;
        this.y = y;

        this.shoots = [];

        this.frame = 0;

        logiOsciGame.game.rootScene.addEventListener('touchstart', function (e) {
            logiOsciGame.player.x = ~~e.x;
            logiOsciGame.player.y = ~~e.y;
            logiOsciGame.game.touched = true;

            var s = new Laser(logiOsciGame.player.x,
                              logiOsciGame.player.y,
                              logiOsciGame.player);
            logiOsciGame.player.shoots.push(s);
        });
        logiOsciGame.game.rootScene.addEventListener('touchmove', function (e) {
            logiOsciGame.player.x = ~~e.x;
            logiOsciGame.player.y = ~~e.y;
        });
        logiOsciGame.game.rootScene.addEventListener('touchend', function (e) {
            logiOsciGame.player.x = ~~e.x;
            logiOsciGame.player.y = ~~e.y;
            logiOsciGame.game.touched = false;
        });

        this.addEventListener('enterframe', function () {
            if (logiOsciGame.game.touched && logiOsciGame.game.frame % 3 == 0 &&
                this.shoots.length < logiOsciGame.PLAYER_SHOOT_MAX) {
                //var s = new PlayerShoot(this.x, this.y, this);
//                var s = new Laser(this.x, this.y, this);
//                this.shoots.push(s);
            }
            for (var i in logiOsciGame.items) {
                if (logiOsciGame.items[i].intersect(this) &&
                    logiOsciGame.items[i].isAlive) {
                    logiOsciGame.items[i].remove();
                    logiOsciGame.items[i].obtained();
                    logiOsciGame.game.score += 100;
                }
            }
        });

        logiOsciGame.game.rootScene.addChild(this);
    }
});

var PlayerShoot = enchant.Class.create(Shoot, {
    initialize: function (x, y, owner) {
        Shoot.call(this, x, y, 0);
        this.owner = owner;
        this.addEventListener('enterframe', function () {
            for (var i in logiOsciGame.enemies) {
                if (logiOsciGame.enemies[i].intersect(this) &&
                    logiOsciGame.enemies[i].isAlive) {
                    this.remove();
                    logiOsciGame.enemies[i].killed();
                    logiOsciGame.game.score += 100;
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

var Laser = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y, owner) {
        enchant.Sprite.call(this, 1, 10);
        this.owner = owner;
        this.moveSpeed = 10;
        this.height = 10;
        this.surface = new Surface(logiOsciGame.screenWidth, this.height);
        this.surface.context.fillStyle = this.COLORS[4];
        this.surface.context.fillRect(10,
                                      Math.floor(this.height / 2 + 2),
                                      logiOsciGame.screenWidth,
                                      1);
        this.image = this.surface;
        this.x = x;
        this.y = y;
        this.frame = 1;
        this.moveSpeed = 20;
        this.laserWidth = 0;
        console.log(this);
        this.state = Laser.STATE.INIT;
        this.addEventListener('enterframe', this.move);
        logiOsciGame.game.rootScene.addChild(this);
    },
    COLORS: ['white', 'red', 'blue', 'green', 'yellow'],
    move: function() {
        switch (this.state) {
        case Laser.STATE.INIT:
            if (logiOsciGame.game.touched) {
                this.state = Laser.STATE.OPEN;
            }
            break;
        case Laser.STATE.OPEN:
            if (logiOsciGame.game.touched) {
                this.x = this.owner.x;
            } else {
                this.state = Laser.STATE.CLOSE;
            }
            this.laserWidth += this.moveSpeed;
            break;
        case Laser.STATE.CLOSE:
            this.x += this.moveSpeed;
            break;
        }
        this.width = this.laserWidth;

        this.y = this.owner.y;
        for (var i in logiOsciGame.enemies) {
            if (logiOsciGame.enemies[i].intersect(this) &&
                logiOsciGame.enemies[i].isAlive) {
                //this.remove();
                logiOsciGame.enemies[i].killed();
                logiOsciGame.game.score += 100;
            }
        }
        if (this.y > logiOsciGame.screenHeight || this.x > logiOsciGame.screenWidth ||
           this.x < -this.width || this.y < -this.height) {
            this.remove();
        }
    },
    remove: function() {
        var self = this;
        this.owner.shoots.some(function(v, i){
            if (v == self) {
                self.owner.shoots.splice(i, 1);
            }
        });
        logiOsciGame.game.rootScene.removeChild(this);
        delete this;
    }
});

Laser.STATE = {
    INIT: 0,
    OPEN: 1,
    CLOSE: 2
};
