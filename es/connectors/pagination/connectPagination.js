'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = connectPagination;

var _utils = require('../../lib/utils.js');

var _Paginator = require('./Paginator');

var _Paginator2 = _interopRequireDefault(_Paginator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var usage = 'Usage:\nvar customPagination = connectPagination(function render(params, isFirstRendering) {\n  // params = {\n  //   createURL,\n  //   currentRefinement,\n  //   nbHits,\n  //   nbPages,\n  //   pages,\n  //   refine,\n  //   widgetParams,\n  // }\n});\nsearch.addWidget(\n  customPagination({\n    [ maxPages ]\n    [ padding ]\n  })\n);\nFull documentation available at https://community.algolia.com/instantsearch.js/v2/connectors/connectPagination.html\n';

/**
 * @typedef {Object} CustomPaginationWidgetOptions
 * @property {number} [maxPages] The max number of pages to browse.
 * @property {number} [padding=3] The padding of pages to show around the current page
 */

/**
 * @typedef {Object} PaginationRenderingOptions
 * @property {function(page): string} createURL Creates URLs for the next state, the number is the page to generate the URL for.
 * @property {number} currentRefinement The number of the page currently displayed.
 * @property {number} nbHits The number of hits computed for the last query (can be approximated).
 * @property {number} nbPages The number of pages for the result set.
 * @property {number[]} pages The actual pages relevant to the current situation and padding
 * @property {boolean} isFirstPage true if the current page is also the first page
 * @property {boolean} isLastPage true if the current page is also the last page
 * @property {function(page)} refine Sets the current page and trigger a search.
 * @property {Object} widgetParams All original `CustomPaginationWidgetOptions` forwarded to the `renderFn`.
 */

/**
 * **Pagination** connector provides the logic to build a widget that will let the user
 * choose the current page of the results.
 *
 * When using the pagination with Algolia, you should be aware that the engine won't provide you pages
 * beyond the 1000th hits by default. You can find more information on the [Algolia documentation](https://www.algolia.com/doc/guides/searching/pagination/#pagination-limitations).
 *
 * @type {Connector}
 * @param {function(PaginationRenderingOptions, boolean)} renderFn Rendering function for the custom **Pagination** widget.
 * @param {function} unmountFn Unmount function called when the widget is disposed.
 * @return {function(CustomPaginationWidgetOptions)} Re-usable widget factory for a custom **Pagination** widget.
 * @example
 * // custom `renderFn` to render the custom Pagination widget
 * function renderFn(PaginationRenderingOptions, isFirstRendering) {
 *   if (isFirstRendering) {
 *     PaginationRenderingOptions.widgetParams.containerNode.html('<ul></ul>');
 *   }
 *
 *   // remove event listeners before replacing markup
 *   PaginationRenderingOptions.widgetParams.containerNode
 *     .find('a[data-page]')
 *     .each(function() { $(this).off('click'); });
 *
 *   var pages = PaginationRenderingOptions.pages
 *     .map(function(page) {
 *       return '<li style="display: inline-block; margin-right: 10px;">' +
 *         '<a href="' + PaginationRenderingOptions.createURL(page) + '" data-page="' + page + '">' +
 *         (parseInt(page) + 1) + '</a></li>';
 *     });
 *
 *   PaginationRenderingOptions.widgetParams.containerNode
 *     .find('ul')
 *     .html(pages);
 *
 *   PaginationRenderingOptions.widgetParams.containerNode
 *     .find('a[data-page]')
 *     .each(function() {
 *       $(this).on('click', function(event) {
 *         event.preventDefault();
 *         PaginationRenderingOptions.refine($(this).data('page'));
 *       });
 *     });
 * }
 *
 * // connect `renderFn` to Pagination logic
 * var customPagination = instantsearch.connectors.connectPagination(renderFn);
 *
 * // mount widget on the page
 * search.addWidget(
 *   customPagination({
 *     containerNode: $('#custom-pagination-container'),
 *     maxPages: 20,
 *     padding: 4,
 *   })
 * );
 */
function connectPagination(renderFn, unmountFn) {
  (0, _utils.checkRendering)(renderFn, usage);

  return function () {
    var widgetParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var maxPages = widgetParams.maxPages,
        _widgetParams$padding = widgetParams.padding,
        padding = _widgetParams$padding === undefined ? 3 : _widgetParams$padding;

    var pager = new _Paginator2.default({
      currentPage: 0,
      total: 0,
      padding: padding
    });

    return {
      init: function init(_ref) {
        var helper = _ref.helper,
            createURL = _ref.createURL,
            instantSearchInstance = _ref.instantSearchInstance;

        this.refine = function (page) {
          helper.setPage(page);
          helper.search();
        };

        this.createURL = function (state) {
          return function (page) {
            return createURL(state.setPage(page));
          };
        };

        renderFn({
          createURL: this.createURL(helper.state),
          currentRefinement: helper.getPage() || 0,
          nbHits: 0,
          nbPages: 0,
          pages: [],
          isFirstPage: true,
          isLastPage: true,
          refine: this.refine,
          widgetParams: widgetParams,
          instantSearchInstance: instantSearchInstance
        }, true);
      },
      getMaxPage: function getMaxPage(_ref2) {
        var nbPages = _ref2.nbPages;

        return maxPages !== undefined ? Math.min(maxPages, nbPages) : nbPages;
      },
      render: function render(_ref3) {
        var results = _ref3.results,
            state = _ref3.state,
            instantSearchInstance = _ref3.instantSearchInstance;

        var nbPages = this.getMaxPage(results);
        pager.currentPage = state.page;
        pager.total = nbPages;

        renderFn({
          createURL: this.createURL(state),
          currentRefinement: state.page,
          refine: this.refine,
          nbHits: results.nbHits,
          nbPages: nbPages,
          pages: pager.pages(),
          isFirstPage: pager.isFirstPage(),
          isLastPage: pager.isLastPage(),
          widgetParams: widgetParams,
          instantSearchInstance: instantSearchInstance
        }, false);
      },
      dispose: function dispose() {
        unmountFn();
      }
    };
  };
}