var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function (game, x, y) {
        enchant.Sprite.call(this, 67, 22);
        this.game = game;
        this.image = game.getAsset('images/kazurebo_01.png');
        this.x = x;
        this.y = y;

        this.moveSpeed = Player.DEFAULT_MOVE_SPEED;

        this.shots = [];
        this.currentLaser = null;
        this.lifePoint = 10;
        this.speedLevel = 1;

        this.frame = 0;
        this.weaponType = WeaponType.SIMPLE;
        this.touchStatus = Player.TouchStatus.NOT_TOUCHED;

        this.dstX = x;
        this.dstY = y;
        var self = this;

        game.rootScene.addEventListener('touchstart', function (e) {
            self.setPos(e);
            self.touchStatus = Player.TouchStatus.TOUCH_START;
        });
        game.rootScene.addEventListener('touchmove', function (e) {
            self.setPos(e);
        });
        game.rootScene.addEventListener('touchend', function (e) {
            self.setPos(e);
            self.touchStatus = Player.TouchStatus.TOUCH_END;
        });

        this.addEventListener('enterframe', function () {
            self._moveToDst();
            self.attack();
            self.checkItems();
            self.checkEnemies();
            if (self.touchStatus == Player.TouchStatus.TOUCH_START) {
                self.touchStatus = Player.TouchStatus.TOUCHING;
            } else if (self.touchStatus == Player.TouchStatus.TOUCH_END) {
                self.touchStatus = Player.TouchStatus.NOT_TOUCHED;
            }
        });
    },
    checkItems: function() {
        var items = this.game.items;
        var i, l;
        for (i = 0, l = items.length; i < l; i++) {
            var index = l - 1 - i;
            if (items[index].intersect(this) &&
                items[index].isAlive) {
                items[index].remove();
                this.itemObtained(items[index]);
                items[index].obtained();
                this.game.score += 100;
            }
        }
    },
    checkEnemies: function() {
        var enemies = this.game.enemies;
        var i, l;
        for (i = 0, l = enemies.length; i < l; i++) {
            if (enemies[i].intersect(this)) {
                this.damaged();
            }
        }
    },
    checkBullets: function() {
    },
    setPos: function(touchEvent) {
        this.dstX = Math.round(touchEvent.x) - this.width / 2;
        if (enchant.ENV.TOUCH_ENABLED) {
            this.dstY = Math.round(touchEvent.y) + Player.Y_OFFSET;
        } else {
            this.dstY = Math.round(touchEvent.y) - this.height / 2;
        }
    },
    _moveToDst: function() {
        if (this.touchStatus !== Player.TouchStatus.TOUCHING) {
            return;
        }
        var s = this.moveSpeed * this.speedLevel;
        var dx = this.dstX - this.x;
        var dy = this.dstY - this.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        s = Math.min(d, s);
        if (d == 0)
            return;
        this.x += Math.round(dx / d * s);
        this.y += Math.round(dy / d * s);
    },
    attack: function() {
        var game = this.game;
        switch (this.weaponType) {
        case WeaponType.SIMPLE:
            if (this.touchStatus == Player.TouchStatus.TOUCHING) {
                if (game.frame % Player.SHOT_INTERVAL == 0 &&
                    this.shots.length < Player.SHOT_MAX) {
                    this.addShot(new SimpleShot(game,
                                                this.x + this.width,
                                                this.y,
                                                this));
                }
            }
            break;
        case WeaponType.LASER:
            var laser = this.currentLaser;
            if (this.touchStatus == Player.TouchStatus. TOUCHING &&
                (laser == null ||
                 laser.age > Laser.LASER_INTERVAL + Laser.LASER_MAX_WIDTH)) {
                this.currentLaser = new Laser(game, this);
                this.addShot(this.currentLaser);
            }
            break;
        }
    },
    damaged: function() {
        var game = this.game;
        this.lifePoint--;
        this.dispatchEvent(new Event(Player.EVENT.DAMAGED));
        if (this.lifePoint <= 0) {
            game.end(game.score,
                     'SCORE: ' + game.score);
        }

    },
    itemObtained: function(item) {
        switch (item.type) {
            case Item.Type.P:
            if (this.lifePoint < Player.LIFE_MAX) this.lifePoint++;
            break;
            case Item.Type.S:
            this.speedLevel += 0.5;
            break;
            case Item.Type.R:
            // todo
            break;
            case Item.Type.L:
            this.weaponType = WeaponType.LASER;
            break;
            default:
            break;
        }
    },
    addShot: function(shot) {
        this.shots.push(shot);
    },
    removeShot: function(shot) {
        if (shot == this.currentLaser) {
            this.currentLaser = null;
        }
        _util.remove(this.shots, shot);
    }
});
Player.SHOT_MAX = 5;
Player.DEFAULT_MOVE_SPEED = 4;
Player.SHOT_INTERVAL = 10;
Player.Y_OFFSET = -50;
Player.TouchStatus = {
    TOUCH_START: 0,
    TOUCHING: 1,
    TOUCH_END: 2,
    NOT_TOUCHED: 3
};
Player.EVENT = {
    DAMAGED: 'damaged'
};
