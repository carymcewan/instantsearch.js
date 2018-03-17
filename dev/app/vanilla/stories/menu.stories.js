'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _devNovel = require('dev-novel');

var _wrapWithHits = require('../../utils/wrap-with-hits.js');

var _index = require('../widgets/index.js');

var widgets = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var stories = (0, _devNovel.storiesOf)('Menu');

exports.default = function () {
  stories.add('select', (0, _wrapWithHits.wrapWithHits)(function (containerNode) {
    window.search.addWidget(widgets.selectMenu({
      containerNode: containerNode,
      attributeName: 'brand',
      limit: 10,
      title: 'Brands'
    }));
  }));
};