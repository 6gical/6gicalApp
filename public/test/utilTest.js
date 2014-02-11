describe('_util', function(){
  describe('#remove', function(){
    it('should remove the item from the list', function() {
        var list = [1, 'item', {}, [], null, 5];
        var length= list.length;

        _util.remove(list, 1);
        assert.notInclude(list, 1, 'remove the int value');
        assert.equal(list.length, length - 1, 'length is decremented');

    });
  });
});
