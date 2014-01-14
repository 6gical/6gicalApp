var Item = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y, moveSpeed) {
        enchant.Sprite.call(this, 16, 16);
        this.isAlive = true;
        this.image = logiOsciGame.game.assets['images/graphic.png'];
        this.x = x;
        this.y = y;

        this.frame = 8;
        this.moveSpeed = moveSpeed;
        this.addEventListener('enterframe', function () {
            this.move();
            if (this.y > logiOsciGame.screenHeight ||
                this.x > logiOsciGame.screenWidth ||
                this.x < -this.width || this.y < -this.height) {
                this.remove();
            }
        });
    },
    move: function() {
        this.x += ~~(this.moveSpeed);
    },
    remove: function() {
        this.isAlive = false;
        logiOsciGame.game.rootScene.removeChild(this);
        delete this;
    },
    obtained: function(player) {
        console.log('item obtained');
    }
});
