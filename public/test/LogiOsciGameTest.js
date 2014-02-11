describe('LogiOsciGame', function(){
  describe('#createFirstStage', function(){
    it('shold create the parts of FirstStage', function(done) {

        var game = new LogiOsciGame(640, 360, '../shooting/');
        game.soundEnabled = false;
        game.start();
        game.onstart = function() {
            expect(game.scoreLabel).to.be.an.instanceof(enchant.ui.ScoreLabel);
            expect(game.lifeLabel).to.be.an.instanceof(enchant.ui.LifeLabel);
            expect(game.timeLabel).to.be.an.instanceof(enchant.ui.TimeLabel);
            expect(game.spaceBg).to.be.an.instanceof(SpaceBg);
            expect(game.player).to.be.an.instanceof(Player);
            done();
        };
    });
  });
});
