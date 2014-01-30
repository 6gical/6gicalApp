var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y) {
        enchant.Sprite.call(this, 16, 16);
        this.image = logiOsciGame.game.assets['images/graphic.png'];
        this.x = x;
        this.y = y;

        this.moveSpeed = Player.DEFAULT_MOVE_SPEED;

        this.shots = [];
        this.lifePoint = 10;
        this.speedLevel = 1;

        this.frame = 0;
        this.weaponType = WeaponType.SIMPLE;
        this.touchStatus = Player.TouchStatus.NOT_TOUCHED;

        this.dstX = x;
        this.dstY = y;
        var self = this;
        logiOsciGame.game.rootScene.addEventListener('touchstart', function (e) {
            self.setPos(e);
            self.touchStatus = Player.TouchStatus.TOUCH_START;
        });
        logiOsciGame.game.rootScene.addEventListener('touchmove', function (e) {
            self.setPos(e);
        });
        logiOsciGame.game.rootScene.addEventListener('touchend', function (e) {
            self.setPos(e);
            self.touchStatus = Player.TouchStatus.TOUCH_END;
        });

        this.addEventListener('enterframe', function () {
            self._moveToDst();
            self.attack();
            var l = logiOsciGame.items.length;
            for (var i = 0; i < l; i++) {
                var index = l - 1 - i;
                if (logiOsciGame.items[index].intersect(this) &&
                    logiOsciGame.items[index].isAlive) {
                    logiOsciGame.items[index].remove();
                    self.itemObtained(logiOsciGame.items[index]);
                    logiOsciGame.items[index].obtained();
                    logiOsciGame.game.score += 100;
                }
            }
            if (self.touchStatus == Player.TouchStatus.TOUCH_START) {
                self.touchStatus = Player.TouchStatus.TOUCHING;
            } else if (self.touchStatus == Player.TouchStatus.TOUCH_END) {
                self.touchStatus = Player.TouchStatus.NOT_TOUCHED;
            }
        });

        logiOsciGame.game.rootScene.addChild(this);
    },
    setPos: function(touchEvent) {
        this.dstX = Math.round(touchEvent.x);
        if (enchant.ENV.TOUCH_ENABLED) {
            this.dstY = Math.round(touchEvent.y) + Player.Y_OFFSET;
        } else {
            this.dstY = Math.round(touchEvent.y);
        }
    },
    _moveToDst: function() {
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
        switch (this.weaponType) {
        case WeaponType.SIMPLE:
            if (this.touchStatus == Player.TouchStatus.TOUCHING) {
                if (logiOsciGame.game.frame % 3 == 0 &&
                    this.shots.length < logiOsciGame.PLAYER_SHOT_MAX) {
                    this._addShot(new SimpleShot(this.x, this.y, this));
                }
            }
            break;
        case WeaponType.LASER:
            if (this.touchStatus == Player.TouchStatus.TOUCH_START) {
                var laser = new Laser(logiOsciGame.player);
                this._addShot(laser);
            }
            break;
        }
    },
    damaged: function() {
        this.lifePoint--;
        this.dispatchEvent(new Event(Player.EVENT.DAMAGED));
        if (this.lifePoint <= 0) {
            logiOsciGame.game.end(logiOsciGame.game.score,
                                  'SCORE: ' + logiOsciGame.game.score);
            logiOsciGame.game.assets[logiOsciGame.bgm].stop();
        }

    },
    itemObtained: function(item) {
        switch (item.type) {
            case Item.Type.P:
            if (this.lifePoint < Player.LIFE_MAX) this.lifePoint++;
            break;
            case Item.Type.S:
            this.speedLevel++;
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
    _addShot: function(shot) {
        this.shots.push(shot);
    }
});
Player.DEFAULT_MOVE_SPEED = 4;
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
