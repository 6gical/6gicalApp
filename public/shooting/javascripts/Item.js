var Item = enchant.Class.create(enchant.Sprite, {
    initialize: function(game, x, y, moveSpeed, type) {
        enchant.Sprite.call(this, 16, 16);
        this.game = game;
        this.isAlive = true;
        this.image = game.getAsset('images/graphic.png');
        this.x = x;
        this.y = y;

        this.type = type;
        this.frame = this.getFrame(this.type);
        this.moveSpeed = moveSpeed;
        this.addEventListener('enterframe', function () {
            this.move();
            if (this.y > game.screenHeight ||
                this.x > game.screenWidth ||
                this.x < -this.width || this.y < -this.height) {
                this.remove();
            }
        });
    },
    move: function() {
        this.x += ~~(this.moveSpeed) * -1;
    },
    remove: function() {
        this.isAlive = false;
        this.game.rootScene.removeChild(this);
        delete this;
    },
    obtained: function(player) {
        console.log('item obtained');
    },
    getFrame: function(type) {
        if (type == Item.Type.P) {
            return 8;
        } else if (type == Item.Type.S) {
            return 9;
        } else if (type == Item.Type.R) {
            return 10;
        } else {//L
            return 11;
        }
    }
});
Item.Type = {
    NONE: 0,
    P: 1, // life up
    S: 2, // speed up
    R: 3,
    L: 4 // laser weapon
};
