var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y) {
        enchant.Sprite.call(this, 16, 16);
        this.image = logiOsciGame.game.assets['images/graphic.png'];
        this.x = x;
        this.y = y;

        this.shots = [];
        this.lifePoint = 10;
        this.speedLevel = 1;

        this.frame = 0;
        this.weaponType = WeaponType.SIMPLE;
        this.touchStatus = Player.TouchStatus.NOT_TOUCHED;
        var self = this;
        logiOsciGame.game.rootScene.addEventListener('touchstart', function (e) {
            logiOsciGame.player.x = ~~e.x;
            logiOsciGame.player.y = ~~e.y;
            self.touchStatus = Player.TouchStatus.TOUCH_START;
        });
        logiOsciGame.game.rootScene.addEventListener('touchmove', function (e) {
            logiOsciGame.player.x = ~~e.x;
            logiOsciGame.player.y = ~~e.y;
        });
        logiOsciGame.game.rootScene.addEventListener('touchend', function (e) {
            logiOsciGame.player.x = ~~e.x;
            logiOsciGame.player.y = ~~e.y;
            self.touchStatus = Player.TouchStatus.TOUCH_END;
        });

        this.addEventListener('enterframe', function () {
            self.attack();
            for (var i in logiOsciGame.items) {
                if (logiOsciGame.items[i].intersect(this) &&
                    logiOsciGame.items[i].isAlive) {
                    logiOsciGame.items[i].remove();
                    self.itemObtained(logiOsciGame.items[i]);
                    logiOsciGame.items[i].obtained();
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
Player.TouchStatus = {
    TOUCH_START: 0,
    TOUCHING: 1,
    TOUCH_END: 2,
    NOT_TOUCHED: 3
};
Player.EVENT = {
    DAMAGED: 'damaged'
};
