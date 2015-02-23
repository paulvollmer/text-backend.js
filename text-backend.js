/**
 * The TextBackend constructor.
 */
function TextBackend(options) {
  // The TextBackend version
  this.version = '0.1.0';

  // The variable to store the text content
  this.content = [];

  // Settings
  this.linebreak = '\n';

  // Level
  this.level = 0;
  this.levelChar = '\t';

  // Set options at initialisation
  if(options !== undefined) {
    if(options.linebreak) this.setLinebreak(options.linebreak);
    if(options.level)     this.setLevel(options.level);
    if(options.levelChar) this.setLevelChar(options.levelChar);
  }
}

/**
 * Node.js export
 */
if(typeof module !== 'undefined' && typeof module.exports !== 'undefined')
  module.exports = TextBackend;

/**
 * Set the linebreak we want to use.
 * @return {Object} The TextBackend Object.
 */
TextBackend.prototype.setLinebreak = function(lb) {
  if(lb !== undefined && typeof(lb) === 'string') {
    this.linebreak = lb;
  }
  return this;
};

/**
 * Write text to the content.
 * @return {Object} The TextBackend Object.
 */
TextBackend.prototype.write = function(text, level) {
  var obj = {
    level: level || this.level,
    text: text || ''
  };
  this.content.push(obj);
  return this;
};

/**
 * Write text to a specific line.
 * @return {Object} The TextBackend Object.
 */
TextBackend.prototype.writeTo = function(line, text) {
  if(line !== undefined && line >= 0 && line < this.content.length+1 && text !== undefined) {
    this.content[line-1].text += text;
  }
  return this;
};

/**
 * Return the content as raw array with level value.
 * @return {Array} The content.
 */
TextBackend.prototype.getRaw = function() {
  return this.content;
};

/**
 * Return the content as array.
 * TODO: add masterLevel
 * @return {Array} The content.
 */
TextBackend.prototype.getStringArray = function() {
  var arr = [];
  var self = this;
  self.content.forEach(function(i) {
    var levelWhitespace = self.getLevelWhitespace(i.level, self.levelChar);
    var textLine = levelWhitespace + i.text;
    arr.push(textLine);
  });
  return arr;
};

/**
 * Return the content as string.
 * @return {String} The content.
 */
TextBackend.prototype.getString = function() {
  var stringArray = this.getStringArray();
  var text = stringArray.join(this.linebreak);
  return text;
};

/**
 * Return the number of lines.
 * @return {Number} The number of lines.
 */
TextBackend.prototype.getTotalLines = function() {
  return this.content.length;
};

/**
 * Set the level depth.
 * @return {Object} The TextBackend Object.
 */
TextBackend.prototype.setLevel = function(level) {
  if(level !== undefined && typeof(level) === 'number') {
    this.level = level;
  }
  return this;
};

/**
 * Set the level character.
 * @return {Object} The TextBackend Object.
 */
TextBackend.prototype.setLevelChar = function(char) {
  if(char !== undefined && typeof(char) === 'string') {
    this.levelChar = char;
  }
  return this;
};

/**
 * Return the current level depth.
 * @return {Number} The level.
 */
TextBackend.prototype.getLevel = function() {
  return this.level;
};

/**
 * Push into the next level.
 * @return {Object} The TextBackend Object.
 */
TextBackend.prototype.pushLevel = function() {
  this.level++;
  return this;
};

/**
 * Pop out from the level.
 * @return {Object} The TextBackend Object.
 */
TextBackend.prototype.popLevel = function() {
  if (this.level > 0) this.level--;
  return this;
};

/**
 * Create the whitespace for a level.
 * @return {String} The whitespace.
 */
TextBackend.prototype.getLevelWhitespace = function(depth, char) {
  var whitespace = '';
  if(depth > 0) {
    for(var i=0; i<depth; i++) {
      whitespace += char;
    }
  }
  return whitespace;
};
