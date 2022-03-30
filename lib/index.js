"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Truncatify = /*#__PURE__*/function () {
  // Param default { classes:['.truncate'], limit: 200, truncationChars: '...', }
  function Truncatify(params) {
    _classCallCheck(this, Truncatify);

    this.classes = params.classes || ['.truncate'];
    this.elements = document.querySelectorAll(this.classes.join(', '));
    this.limit = params.limit ? Math.abs(params.limit) : 200;
    this.truncationChars = params.truncationChars || '...';
  }

  _createClass(Truncatify, [{
    key: "truncate",
    value: function truncate() {
      var _this = this;

      if (this.elements.length) {
        this.elements.forEach(function (element) {
          var htmlContent = element.innerHTML.trim(),
              textContent = element.textContent.trim(),
              truncatedTextContent = textContent.slice(0, _this.limit); // Cutting content after a word    

          truncatedTextContent = truncatedTextContent.substr(0, Math.min(truncatedTextContent.length, truncatedTextContent.lastIndexOf(' ')));

          if (textContent.length > _this.limit) {
            var tags = _this._enlistTags(htmlContent);

            var truncatedHtmlString = _this._assembleTruncatedContent(tags, truncatedTextContent);

            element.innerHTML = truncatedHtmlString;
          }
        });
      }
    }
  }, {
    key: "_enlistTags",
    value: function _enlistTags(htmlContent) {
      var voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
      var tags = [];
      var isOpenTag = false;
      var currentTagLevel = 0;
      var tempTag = {
        startPos: 0,
        length: 0,
        tag: '',
        level: 0,
        'base-tag': '',
        'tag-name': '',
        'tag-type': ''
      };

      for (var pos = 0; pos < htmlContent.length; pos++) {
        var _char = htmlContent.charAt(pos);

        switch (_char) {
          case '<':
            isOpenTag = true;
            tempTag.startPos = pos;
            break;

          case '>':
            tempTag.tag += _char;
            tempTag.length++;
            tempTag['base-tag'] = tempTag.tag.indexOf(' ') > -1 ? tempTag.tag.substr(0, tempTag.tag.indexOf(' ')) + '>' : tempTag.tag;
            tempTag['tag-name'] = tempTag['base-tag'].replace(/[^a-zA-Z ]/g, ''); // Checks if Self Closing Tag or Void Elements

            if (new RegExp(voidElements.join("|")).test(tempTag['base-tag'])) {
              currentTagLevel++;
              tempTag.level = currentTagLevel;
              tempTag['tag-type'] = 'void-element';
              currentTagLevel--;
            } else {
              if (tempTag['base-tag'].indexOf('/') > -1) {
                tempTag.level = currentTagLevel;
                tempTag['tag-type'] = 'closing';
                currentTagLevel--;
              } else {
                currentTagLevel++;
                tempTag.level = currentTagLevel;
                tempTag['tag-type'] = 'opening';
              }
            }

            tags.push(tempTag); // Reset properties

            isOpenTag = false;
            tempTag = {
              startPos: 0,
              length: 0,
              tag: '',
              level: 0,
              'base-tag': '',
              'tag-name': '',
              'tag-type': ''
            };
            break;
        }

        if (isOpenTag) {
          tempTag.length++;
          tempTag.tag += _char;
        }
      }

      return tags;
    }
  }, {
    key: "_assembleTruncatedContent",
    value: function _assembleTruncatedContent(tags, truncatedTextContent) {
      var _this2 = this;

      var truncatedHtmlString = truncatedTextContent + this.truncationChars;

      if (tags.length) {
        tags.forEach(function (tagItem, index) {
          if (tagItem.startPos < truncatedTextContent.length) {
            truncatedHtmlString = truncatedHtmlString.slice(0, tagItem.startPos) + tagItem.tag + truncatedHtmlString.slice(tagItem.startPos);
          } else {
            var openingTagItem = tags[_this2._getOpeningTagIndex(tags, tagItem, index)];

            if (tagItem['tag-type'] == 'void-element' || tagItem['tag-type'] == 'opening' || tagItem['tag-type'] == 'closing' && openingTagItem.startPos > truncatedHtmlString.length) {
              return false;
            } else {
              truncatedHtmlString = truncatedHtmlString.slice(0, tagItem.startPos) + tagItem.tag + truncatedHtmlString.slice(tagItem.startPos);
            }
          }
        });
      }

      return truncatedHtmlString;
    }
  }, {
    key: "_getOpeningTagIndex",
    value: function _getOpeningTagIndex(tags, currentElement, currentElementIndex) {
      for (var pos = currentElementIndex - 1; pos >= 0; pos--) {
        var tagItem = tags[pos];

        if (currentElement['tag-name'] == tagItem['tag-name'] && currentElement.level == tagItem.level) {
          return pos;
          break;
        }
      }
    }
  }]);

  return Truncatify;
}();

exports["default"] = Truncatify;