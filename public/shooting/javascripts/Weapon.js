var WeaponType = {
    SIMPLE: 0,
    LASER: 1
};
var SimpleShot = enchant.Class.create(enchant.Sprite, {
    initialize: function (game, x, y, owner) {
        enchant.Sprite.call(this, 16, 16);
        this.game = game;
        this.image = game.getAsset('images/graphic.png');
        this.x = x;
        this.y = y;
        this.frame = 1;
        this.direction = 0;
        this.moveSpeed = 10;
        this.addEventListener('enterframe', function() {
            this.move();
            this.removeIfOffScreen();
        });
        game.rootScene.addChild(this);
        this.owner = owner;
    },
    move: function() {
        this.x += this.moveSpeed * Math.cos(this.direction);
        this.y += this.moveSpeed * Math.sin(this.direction);
    },
    onHit: function() {
        this.remove();
    },
    removeIfOffScreen: function() {
        var game = this.game;
        if (this.y > game.height || this.x > game.width ||
            this.x < -this.width || this.y < -this.height) {
            this.remove();
        }
    },
    remove: function() {
        var game = this.game;
        this.owner.removeShot(this);
        game.rootScene.removeChild(this);
        delete this;
    }
});

var Laser = enchant.Class.create(enchant.Sprite, {
    initialize: function (game, owner) {
        enchant.Sprite.call(this, 1, 10);
        this.game = game;
        this.owner = owner;
        this.moveSpeed = 10;
        this.height = 10;
        this.surface = new Surface(game.width, this.height);
        this.surface.context.fillStyle = this.COLORS[4];
        this.surface.context.fillRect(10,
                                      Math.floor(this.height / 2 + 2),
                                      game.width,
                                      1);
        this.image = this.surface;
        this.moveTo(owner.x + owner.width, owner.y);
        this.frame = 1;
        this.moveSpeed = 20;
        this.laserWidth = 0;
        this.state = Laser.STATE.INIT;
        this.addEventListener('enterframe', function() {
            this.move();
            this.removeIfOffScreen();
        });
        game.rootScene.addChild(this);
    },
    COLORS: ['white', 'red', 'blue', 'green', 'yellow'],
    move: function() {
        switch (this.state) {
        case Laser.STATE.INIT:
            if (this.owner.touchStatus == Player.TouchStatus.TOUCHING) {
                this.state = Laser.STATE.OPEN;
            }
            break;
        case Laser.STATE.OPEN:
            if (this.owner.touchStatus == Player.TouchStatus.TOUCHING &&
               this.age <= Laser.LASER_MAX_WIDTH) {
                this.x = this.owner.x + this.owner.width;
                this.y = this.owner.y;
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
    },
    onHit: function() {
    },
    removeIfOffScreen: function() {
        var game = this.game;
        if (this.y > game.height || this.x > game.width ||
            this.x < -this.width || this.y < -this.height) {
            this.remove();
        }
    },
    remove: function() {
        var self = this;
        this.owner.removeShot(this);
        _util.remove(this.owner.shots, self);
        this.game.rootScene.removeChild(this);
        delete this;
    }
});

Laser.STATE = {
    INIT: 0,
    OPEN: 1,
    CLOSE: 2
};
Laser.LASER_MAX_WIDTH = 15;
Laser.LASER_INTERVAL = 10;
