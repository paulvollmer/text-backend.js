var assert = require('assert');
var TextBackend = require('../text-backend');

describe('text-backend', function() {

  describe('# initialize', function() {
    it('should return an object.', function() {
      var text = new TextBackend();
      assert.equal(typeof(text), 'object');
      assert.equal(text.version, '0.1.0');
    });

    it('initialize without options', function() {
      var text = new TextBackend();
      assert.equal(text.linebreak, '\n');
      assert.equal(text.level, 0);
      assert.equal(text.levelChar, '\t');
    });

    it('initialize with options', function() {
      var opt = {
        linebreak: '<br>',
        level: 1,
        levelChar: ' '
      };
      var text = new TextBackend(opt);
      assert.equal(text.linebreak, '<br>');
      assert.equal(text.level, 1);
      assert.equal(text.levelChar, ' ');
    });
  });

  describe('# setLinebreak()', function() {
    it('set the linebreak we want to use.', function() {
      var text = new TextBackend();
      text.setLinebreak('<br>');
      assert.equal(text.linebreak, '<br>');
    });

    it('set the linebreak (missing param).', function() {
      var text = new TextBackend();
      text.setLinebreak();
      assert.equal(text.linebreak, '\n');
    });

    it('set the linebreak (parameter is not a string).', function() {
      var text = new TextBackend();
      text.setLinebreak({lb: '<br>'});
      assert.equal(text.linebreak, '\n');
    });
  });

  describe('# write()', function() {
    it('write some text to the content variable.', function() {
      var text = new TextBackend();
      text.write('hello world');
      assert.deepEqual(text.content.length, 1);
      var expected = [
        { level: 0, text: 'hello world' }
      ];
      assert.deepEqual(text.content, expected);
    });

    it('write some text to the content variable. (multiple calls, cascade...)', function() {
      var text = new TextBackend();
      text.write('hello').write('world');
      text.write('text to test the function');
      assert.deepEqual(text.content.length, 3);
      var expected = [
        { level: 0, text: 'hello' },
        { level: 0, text: 'world' },
        { level: 0, text: 'text to test the function'}
      ];
      assert.deepEqual(text.content, expected);
    });

    it('write some text and set the level.', function() {
      var text = new TextBackend();
      text.write('hello world', 2);
      assert.deepEqual(text.content.length, 1);
      assert.deepEqual(text.content, [{level: 2, text: 'hello world'}]);
    });
  });

  describe('# writeTo()', function() {
    it('write some text to a specific line.', function() {
      var text = new TextBackend();
      text.write('hello');
      text.write('world');
      text.writeTo(2, ' you are beautiful.');
      var expected = [
        { level: 0, text: 'hello' },
      { level: 0, text: 'world you are beautiful.' }
      ];
      assert.deepEqual(text.content, expected);
    });

    it('want to write text to line that does not exist.', function() {
      var text = new TextBackend();
      text.writeTo(-1, 'not correct line number');
      assert.deepEqual(text.content, []);

      text.writeTo(3, 'not correct line number');
      assert.deepEqual(text.content, []);
    });
  });

  describe('# getRaw()', function() {
    it('should return the content as raw array.', function() {
      var text = new TextBackend();
      text.write('hello world');
      var expected = [
        {level: 0, text: 'hello world'}
      ];
      assert.deepEqual(text.getRaw(), expected);
    });
  });

  describe('# getStringArray()', function() {
    it('should return the content as string array.', function() {
      var text = new TextBackend();
      text.write('hello world');
      assert.deepEqual(text.getStringArray(), ['hello world']);
    });
  });

  describe('# getString()', function() {
    it('should return the content as string.', function() {
      var text = new TextBackend();
      text.write('hello world');
      text.write('stdin is not a tty');
      assert.equal(text.getString(), 'hello world\nstdin is not a tty');
    });

    it('should return the content as string (with level).', function() {
      var text = new TextBackend();
      text.write('hello world');
      text.pushLevel();
      text.write('stdin is not a tty');
      assert.equal(text.getString(), 'hello world\n\tstdin is not a tty');
    });
  });

  describe('# getTotalLines()', function() {
    it('should return the number of lines', function() {
      var text = new TextBackend();
      text.write('hello world');
      var loc = text.getTotalLines();
      assert.equal(loc, 1);
    });
  });

  describe('# setLevel()', function() {
    it('set the level.', function() {
      var text = new TextBackend();
      text.setLevel(1337);
      assert.equal(text.level, 1337);
    });

    it('set the level (missing param).', function() {
      var text = new TextBackend();
      text.setLevel();
      assert.equal(text.level, 0);
    });

    it('set the level (parameter is not a number).', function() {
      var text = new TextBackend();
      text.setLevel({obj: 'foo'});
      assert.equal(text.level, 0);
    });
  });

  describe('# setLevelChar()', function() {
    it('set the level character.', function() {
      var text = new TextBackend();
      text.setLevelChar(' ');
      assert.equal(text.level, ' ');
    });

    it('set the level character (missing param).', function() {
      var text = new TextBackend();
      text.setLevelChar();
      assert.equal(text.levelChar, '\t');
    });

    it('set the level character (parameter is not a number).', function() {
      var text = new TextBackend();
      text.setLevelChar({obj: 'foo'});
      assert.equal(text.levelChar, '\t');
    });
  });

  describe('# getLevel()', function() {
    it('should return the current level depth', function() {
      var text = new TextBackend();
      assert.equal(text.getLevel(), 0);
    });
  });

  describe('# pushLevel()', function() {
    it('test the level push', function() {
      var text = new TextBackend();
      text.pushLevel();
      assert.deepEqual(text.level, 1);
    });

    it('test the level push and check the content array', function() {
      var text = new TextBackend();
      text.pushLevel();
      text.write('hello');
      assert.deepEqual(text.level, 1);
      assert.deepEqual(text.content[0].level, 1);
    });
  });

  describe('# popLevel()', function() {
    it('test the level pop', function() {
      var text = new TextBackend();
      text.popLevel();
      assert.deepEqual(text.level, 0);

      text.level = 10;
      text.popLevel();
      assert.deepEqual(text.level, 9);
    });

    it('test the level pop and check the content array', function() {
      var text = new TextBackend({level: 10});
      text.popLevel();
      assert.equal(text.level, 9);

      text.write('hello');
      assert.deepEqual(text.content[0].level, 9);
    });
  });

  describe('# getLevelWhitespace()', function() {
    it('should return the level whitespace', function() {
      var text = new TextBackend();
      assert.equal(text.getLevelWhitespace(0, '\t'), '');
      assert.equal(text.getLevelWhitespace(2, '\t'), '\t\t');
      assert.equal(text.getLevelWhitespace(-1, '\t'), '');
    });
  });

});
