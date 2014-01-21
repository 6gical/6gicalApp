var LifePointGauge = enchant.Class.create(enchant.Sprite, {
    initialize: function(w, h, player) {
        enchant.Sprite.call(this, w, h);
        this.player = player;
        this.surface = new Surface(w, h);
        var context = this.surface.context;
        context.fillStyle = 'white';
        context.textBaseline = 'top';
        context.fillText('Life', 0, 0, 30);
        this.image = this.surface;
        this.update();
        this.player.addEventListener(Player.EVENT.DAMAGED,
                                     this.update.bind(this));
    },
    update: function() {
        var context = this.surface.context;
        context.clearRect(30, 1, 180, 10);
        context.fillRect(30, 1, this.player.lifePoint * 15, 10);
    }
});
