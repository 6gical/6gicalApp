var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y) {
        enchant.Sprite.call(this, 16, 16);
        this.image = logiOsciGame.game.assets['images/graphic.png'];
        this.x = x;
        this.y = y;

        this.shots = [];

        this.frame = 0;
        this.weaponType = WeaponType.LASER;
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
                this._addShot(new Laser(logiOsciGame.player.x,
                                        logiOsciGame.player.y,
                                        logiOsciGame.player));
            }
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
