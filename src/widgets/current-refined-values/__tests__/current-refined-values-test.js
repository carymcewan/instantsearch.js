'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _filter = require('lodash/filter');

var _filter2 = _interopRequireDefault(_filter);

var _algoliasearch = require('algoliasearch');

var _algoliasearch2 = _interopRequireDefault(_algoliasearch);

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _utils = require('../../../lib/utils');

var _currentRefinedValues = require('../current-refined-values');

var _currentRefinedValues2 = _interopRequireDefault(_currentRefinedValues);

var _defaultTemplates = require('../defaultTemplates');

var _defaultTemplates2 = _interopRequireDefault(_defaultTemplates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('currentRefinedValues()', function () {
  describe('types checking', function () {
    var boundWidget = void 0;
    var parameters = void 0;

    beforeEach(function () {
      parameters = {
        container: document.createElement('div'),
        attributes: [],
        onlyListedAttributes: false,
        clearAll: 'after',
        templates: {},
        transformData: {
          item: function item(data) {
            return data;
          }
        },
        autoHideContainer: false,
        cssClasses: {}
      };
      boundWidget = _currentRefinedValues2.default.bind(null, parameters);
    });

    describe('options.container', function () {
      it("doesn't throw usage with a string", function () {
        var element = document.createElement('div');
        element.id = 'testid2';
        document.body.appendChild(element);
        parameters.container = '#testid2';
        expect(boundWidget).not.toThrow();
      });

      it("doesn't throw usage with a HTMLElement", function () {
        parameters.container = document.createElement('div');
        expect(boundWidget).not.toThrow();
      });

      it('throws usage if not defined', function () {
        delete parameters.container;
        expect(boundWidget).toThrow(/Usage/);
      });

      it('throws usage with another type than string or HTMLElement', function () {
        parameters.container = true;
        expect(boundWidget).toThrow(/Usage/);
      });
    });

    describe('options.attributes', function () {
      it("doesn't throw usage if not defined", function () {
        delete parameters.attributes;
        expect(boundWidget).not.toThrow();
      });

      it("doesn't throw usage if attributes is an empty array", function () {
        parameters.attributes = [];
        expect(boundWidget).not.toThrow();
      });

      it("doesn't throw usage with name, label, template and transformData", function () {
        parameters.attributes = [{
          name: 'attr1'
        }, {
          name: 'attr2',
          label: 'Attr 2'
        }, {
          name: 'attr3',
          template: 'SPECIFIC TEMPLATE'
        }, {
          name: 'attr4',
          transformData: function transformData(data) {
            data.name = 'newname';
            return data;
          }
        }];
        expect(boundWidget).not.toThrow();
      });

      it("doesn't throw usage with a function template", function () {
        parameters.attributes = [{ name: 'attr1' }, { name: 'attr2', template: function template() {
            return 'CUSTOM TEMPLATE';
          } }];
        expect(boundWidget).not.toThrow();
      });

      it("throws usage if attributes isn't an array", function () {
        parameters.attributes = 'a string';
        expect(boundWidget).toThrow(/Usage/);
      });

      it("throws usage if attributes doesn't contain only objects", function () {
        parameters.attributes = [{ name: 'test' }, 'string'];
        expect(boundWidget).toThrow(/Usage/);
      });

      it('throws usage if attributes contains an object without name', function () {
        parameters.attributes = [{ name: 'test' }, { label: '' }];
        expect(boundWidget).toThrow(/Usage/);
      });

      it('throws usage if attributes contains an object with a not string name', function () {
        parameters.attributes = [{ name: 'test' }, { name: true }];
        expect(boundWidget).toThrow(/Usage/);
      });

      it('throws usage if attributes contains an object with a not string label', function () {
        parameters.attributes = [{ name: 'test' }, { label: true }];
        expect(boundWidget).toThrow(/Usage/);
      });

      it('throws usage if attributes contains an object with a not string or function template', function () {
        parameters.attributes = [{ name: 'test' }, { template: true }];
        expect(boundWidget).toThrow(/Usage/);
      });

      it('throws usage if attributes contains an object with a not function transformData', function () {
        parameters.attributes = [{ name: 'test' }, { transformData: true }];
        expect(boundWidget).toThrow(/Usage/);
      });
    });

    describe('options.onlyListedAttributes', function () {
      it("doesn't throw usage if not defined", function () {
        delete parameters.onlyListedAttributes;
        expect(boundWidget).not.toThrow();
      });

      it("doesn't throw usage if true", function () {
        parameters.onlyListedAttributes = true;
        expect(boundWidget).not.toThrow();
      });

      it("doesn't throw usage if false", function () {
        parameters.onlyListedAttributes = false;
        expect(boundWidget).not.toThrow();
      });

      it('throws usage if not boolean', function () {
        parameters.onlyListedAttributes = 'truthy value';
        expect(boundWidget).toThrow(/Usage/);
      });
    });

    describe('options.clearAll', function () {
      it("doesn't throw usage if not defined", function () {
        delete parameters.clearAll;
        expect(boundWidget).not.toThrow();
      });

      it("doesn't throw usage if false", function () {
        parameters.clearAll = false;
        expect(boundWidget).not.toThrow();
      });

      it("doesn't throw usage if 'before'", function () {
        parameters.clearAll = 'before';
        expect(boundWidget).not.toThrow();
      });

      it("doesn't throw usage if 'after'", function () {
        parameters.clearAll = 'after';
        expect(boundWidget).not.toThrow();
      });

      it("throws usage if not one of [false, 'before', 'after']", function () {
        parameters.clearAll = 'truthy value';
        expect(boundWidget).toThrow(/Usage/);
      });
    });

    describe('options.templates', function () {
      it("doesn't throw usage if not defined", function () {
        delete parameters.templates;
        expect(boundWidget).not.toThrow();
      });

      it("doesn't throw usage with an empty object", function () {
        parameters.templates = {};
        expect(boundWidget).not.toThrow();
      });

      it("doesn't throw usage with a string template", function () {
        parameters.templates = {
          item: 'STRING TEMPLATE'
        };
        expect(boundWidget).not.toThrow();
      });

      it("doesn't throw usage with a function template", function () {
        parameters.templates = {
          item: function item() {
            return 'ITEM TEMPLATE';
          }
        };
        expect(boundWidget).not.toThrow();
      });

      it("doesn't throw usage with all keys", function () {
        parameters.templates = {
          header: 'HEADER TEMPLATE',
          item: 'ITEM TEMPLATE',
          clearAll: 'CLEAR ALL TEMPLATE',
          footer: 'FOOTER TEMPLATE'
        };
        expect(boundWidget).not.toThrow();
      });

      it('throws usage with template being something else than an object', function () {
        parameters.templates = true;
        expect(boundWidget).toThrow(/Usage/);
      });

      it("throws usage if one of the template keys doesn't exist", function () {
        parameters.templates = {
          header: 'HEADER TEMPLATE',
          notExistingKey: 'NOT EXISTING KEY TEMPLATE'
        };
        expect(boundWidget).toThrow(/Usage/);
      });

      it('throws usage if a template is not a string or a function', function () {
        parameters.templates = {
          item: true
        };
        expect(boundWidget).toThrow(/Usage/);
      });
    });

    describe('options.transformData', function () {
      it("doesn't throw usage if not defined", function () {
        delete parameters.transformData;
        expect(boundWidget).not.toThrow();
      });

      it("doesn't throw usage with a function", function () {
        parameters.transformData = function (data) {
          return data;
        };
        expect(boundWidget).not.toThrow();
      });

      it("doesn't throw usage with an object of functions", function () {
        parameters.transformData = {
          item: function item(data) {
            return data;
          }
        };
        expect(boundWidget).not.toThrow();
      });

      it('throws usage if not a function', function () {
        parameters.transformData = true;
        expect(boundWidget).toThrow();
      });
    });

    describe('options.autoHideContainer', function () {
      it("doesn't throw usage if not defined", function () {
        delete parameters.autoHideContainer;
        expect(boundWidget).not.toThrow();
      });

      it("doesn't throw usage with true", function () {
        parameters.autoHideContainer = true;
        expect(boundWidget).not.toThrow();
      });

      it("doesn't throw usage with false", function () {
        parameters.autoHideContainer = false;
        expect(boundWidget).not.toThrow();
      });

      it('throws usage if not boolean', function () {
        parameters.autoHideContainer = 'truthy value';
        expect(boundWidget).toThrow(/Usage/);
      });
    });

    describe('options.cssClasses', function () {
      it("doesn't throw usage if not defined", function () {
        delete parameters.cssClasses;
        expect(boundWidget).not.toThrow();
      });

      it("doesn't throw usage with an empty object", function () {
        parameters.cssClasses = {};
        expect(boundWidget).not.toThrow();
      });

      it("doesn't throw usage with string class", function () {
        parameters.cssClasses = {
          item: 'item-class'
        };
        expect(boundWidget).not.toThrow();
      });

      it("doesn't throw usage with all keys", function () {
        parameters.cssClasses = {
          root: 'root-class',
          header: 'header-class',
          body: 'body-class',
          clearAll: 'clear-all-class',
          list: 'list-class',
          item: 'item-class',
          link: 'link-class',
          count: 'count-class',
          footer: 'footer-class'
        };
        expect(boundWidget).not.toThrow();
      });

      it('throws usage with cssClasses being something else than an object', function () {
        parameters.cssClasses = 'truthy value';
        expect(boundWidget).toThrow(/Usage/);
      });

      it("throws usage if one of the cssClasses keys doesn't exist", function () {
        parameters.cssClasses = {
          notExistingKey: 'not-existing-class'
        };
        expect(boundWidget).toThrow(/Usage/);
      });

      it('throws usage if one of the cssClasses values is not a string', function () {
        parameters.cssClasses = {
          item: true
        };
        expect(boundWidget).toThrow(/Usage/);
      });
    });
  });

  describe('getConfiguration()', function () {
    it('configures nothing', function () {
      var widget = (0, _currentRefinedValues2.default)({
        container: document.createElement('div')
      });
      expect(widget.getConfiguration).toEqual(undefined);
    });
  });

  describe('render()', function () {
    var ReactDOM = void 0;

    var parameters = void 0;
    var client = void 0;
    var helper = void 0;
    var initParameters = void 0;
    var renderParameters = void 0;
    var refinements = void 0;
    var expectedProps = void 0;

    function setRefinementsInExpectedProps() {
      expectedProps.refinements = refinements;
      expectedProps.clearRefinementClicks = (0, _map2.default)(refinements, function () {
        return function () {};
      });
      expectedProps.clearRefinementURLs = (0, _map2.default)(refinements, function () {
        return '#cleared';
      });
    }

    beforeEach(function () {
      ReactDOM = { render: _sinon2.default.spy() };
      _currentRefinedValues2.default.__Rewire__('render', ReactDOM.render);

      parameters = {
        container: document.createElement('div'),
        attributes: [{ name: 'facet' }, { name: 'facetExclude' }, { name: 'disjunctiveFacet' }, { name: 'hierarchicalFacet' }, { name: 'numericFacet' }, { name: 'numericDisjunctiveFacet' }, { name: '_tags' }],
        onlyListedAttributes: true,
        clearAll: 'after',
        templates: {
          header: 'HEADER',
          item: 'ITEM',
          clearAll: 'CLEAR ALL',
          footer: 'FOOTER'
        },
        autoHideContainer: false,
        cssClasses: {
          root: 'root-css-class',
          header: 'header-css-class',
          body: 'body-css-class',
          clearAll: 'clear-all-css-class',
          list: 'list-css-class',
          item: 'item-css-class',
          link: 'link-css-class',
          count: 'count-css-class',
          footer: 'footer-css-class'
        }
      };

      client = (0, _algoliasearch2.default)('APP_ID', 'API_KEY');
      helper = (0, _algoliasearchHelper2.default)(client, 'index_name', {
        facets: ['facet', 'facetExclude', 'numericFacet', 'extraFacet'],
        disjunctiveFacets: ['disjunctiveFacet', 'numericDisjunctiveFacet'],
        hierarchicalFacets: [{
          name: 'hierarchicalFacet',
          attributes: ['hierarchicalFacet.lvl0', 'hierarchicalFacet.lvl1'],
          separator: ' > '
        }]
      });
      helper.toggleRefinement('facet', 'facet-val1').toggleRefinement('facet', 'facet-val2').toggleRefinement('extraFacet', 'extraFacet-val1').toggleFacetExclusion('facetExclude', 'facetExclude-val1').toggleFacetExclusion('facetExclude', 'facetExclude-val2').toggleRefinement('disjunctiveFacet', 'disjunctiveFacet-val1').toggleRefinement('disjunctiveFacet', 'disjunctiveFacet-val2').toggleRefinement('hierarchicalFacet', 'hierarchicalFacet-val1 > hierarchicalFacet-val2').addNumericRefinement('numericFacet', '>=', 1).addNumericRefinement('numericFacet', '<=', 2).addNumericRefinement('numericDisjunctiveFacet', '>=', 3).addNumericRefinement('numericDisjunctiveFacet', '<=', 4).toggleTag('tag1').toggleTag('tag2');

      initParameters = {
        helper: helper,
        createURL: function createURL() {
          return '';
        },
        instantSearchInstance: {
          templatesConfig: { randomAttributeNeverUsed: 'value' }
        }
      };

      renderParameters = {
        results: {
          facets: [{
            name: 'facet',
            exhaustive: true,
            data: {
              'facet-val1': 1,
              'facet-val2': 2,
              'facet-val3': 42
            }
          }, {
            name: 'extraFacet',
            exhaustive: true,
            data: {
              'extraFacet-val1': 42,
              'extraFacet-val2': 42
            }
          }],
          disjunctiveFacets: [{
            name: 'disjunctiveFacet',
            exhaustive: true,
            data: {
              'disjunctiveFacet-val1': 3,
              'disjunctiveFacet-val2': 4,
              'disjunctiveFacet-val3': 42
            }
          }],
          hierarchicalFacets: [{
            name: 'hierarchicalFacet',
            data: [{
              name: 'hierarchicalFacet-val1',
              count: 5,
              exhaustive: true,
              data: [{
                name: 'hierarchicalFacet-val2',
                count: 6,
                exhaustive: true
              }]
            }, {
              // Here to confirm we're taking the right nested one
              name: 'hierarchicalFacet-val2',
              count: 42,
              exhaustive: true
            }]
          }]
        },
        helper: helper,
        state: helper.state,
        templatesConfig: { randomAttributeNeverUsed: 'value' },
        createURL: function createURL() {
          return '#cleared';
        }
      };

      refinements = [{
        type: 'facet',
        attributeName: 'facet',
        name: 'facet-val1',
        count: 1,
        exhaustive: true
      }, {
        type: 'facet',
        attributeName: 'facet',
        name: 'facet-val2',
        count: 2,
        exhaustive: true
      }, {
        type: 'exclude',
        attributeName: 'facetExclude',
        name: 'facetExclude-val1',
        exclude: true
      }, {
        type: 'exclude',
        attributeName: 'facetExclude',
        name: 'facetExclude-val2',
        exclude: true
      },
      // eslint-disable-next-line max-len
      {
        type: 'disjunctive',
        attributeName: 'disjunctiveFacet',
        name: 'disjunctiveFacet-val1',
        count: 3,
        exhaustive: true
      },
      // eslint-disable-next-line max-len
      {
        type: 'disjunctive',
        attributeName: 'disjunctiveFacet',
        name: 'disjunctiveFacet-val2',
        count: 4,
        exhaustive: true
      },
      // eslint-disable-next-line max-len
      {
        type: 'hierarchical',
        attributeName: 'hierarchicalFacet',
        name: 'hierarchicalFacet-val2',
        count: 6,
        exhaustive: true
      }, {
        type: 'numeric',
        attributeName: 'numericFacet',
        name: '1',
        numericValue: 1,
        operator: '>='
      }, {
        type: 'numeric',
        attributeName: 'numericFacet',
        name: '2',
        numericValue: 2,
        operator: '<='
      }, {
        type: 'numeric',
        attributeName: 'numericDisjunctiveFacet',
        name: '3',
        numericValue: 3,
        operator: '>='
      }, {
        type: 'numeric',
        attributeName: 'numericDisjunctiveFacet',
        name: '4',
        numericValue: 4,
        operator: '<='
      }, { type: 'tag', attributeName: '_tags', name: 'tag1' }, { type: 'tag', attributeName: '_tags', name: 'tag2' }];

      expectedProps = {
        attributes: {
          facet: { name: 'facet' },
          facetExclude: { name: 'facetExclude' },
          disjunctiveFacet: { name: 'disjunctiveFacet' },
          hierarchicalFacet: { name: 'hierarchicalFacet' },
          numericFacet: { name: 'numericFacet' },
          numericDisjunctiveFacet: { name: 'numericDisjunctiveFacet' },
          _tags: { name: '_tags' }
        },
        clearAllClick: function clearAllClick() {},
        collapsible: false,
        clearAllPosition: 'after',
        clearAllURL: '#cleared',
        cssClasses: {
          root: 'ais-current-refined-values root-css-class',
          header: 'ais-current-refined-values--header header-css-class',
          body: 'ais-current-refined-values--body body-css-class',
          clearAll: 'ais-current-refined-values--clear-all clear-all-css-class',
          list: 'ais-current-refined-values--list list-css-class',
          item: 'ais-current-refined-values--item item-css-class',
          link: 'ais-current-refined-values--link link-css-class',
          count: 'ais-current-refined-values--count count-css-class',
          footer: 'ais-current-refined-values--footer footer-css-class'
        },
        shouldAutoHideContainer: false,
        templateProps: (0, _utils.prepareTemplateProps)({
          defaultTemplates: _defaultTemplates2.default,
          templatesConfig: { randomAttributeNeverUsed: 'value' },
          templates: {
            header: 'HEADER',
            item: 'ITEM',
            clearAll: 'CLEAR ALL',
            footer: 'FOOTER'
          }
        })
      };
      setRefinementsInExpectedProps();
    });

    it('should render twice <CurrentRefinedValues ... />', function () {
      var widget = (0, _currentRefinedValues2.default)(parameters);
      widget.init(initParameters);
      widget.render(renderParameters);
      widget.render(renderParameters);

      expect(ReactDOM.render.callCount).toBe(2);
      expect(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
      expect(ReactDOM.render.firstCall.args[1]).toBe(parameters.container);
      expect(ReactDOM.render.secondCall.args[0]).toMatchSnapshot();
      expect(ReactDOM.render.secondCall.args[1]).toBe(parameters.container);
    });

    describe('options.container', function () {
      it('should render with a string container', function () {
        var element = document.createElement('div');
        element.id = 'testid';
        document.body.appendChild(element);

        parameters.container = '#testid';

        var widget = (0, _currentRefinedValues2.default)(parameters);
        widget.init(initParameters);
        widget.render(renderParameters);
        expect(ReactDOM.render.calledOnce).toBe(true);
        expect(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
        expect(ReactDOM.render.firstCall.args[1]).toBe(element);
      });

      it('should render with a HTMLElement container', function () {
        var element = document.createElement('div');

        parameters.container = element;

        var widget = (0, _currentRefinedValues2.default)(parameters);
        widget.init(initParameters);
        widget.render(renderParameters);
        expect(ReactDOM.render.calledOnce).toBe(true);
        expect(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
        expect(ReactDOM.render.firstCall.args[1]).toBe(element);
      });
    });

    describe('options.attributes', function () {
      describe('with options.onlyListedAttributes === true', function () {
        beforeEach(function () {
          parameters.onlyListedAttributes = true;
        });

        it('should render all attributes with not defined attributes', function () {
          delete parameters.attributes;

          refinements.splice(0, 0, {
            type: 'facet',
            attributeName: 'extraFacet',
            name: 'extraFacet-val1',
            count: 42,
            exhaustive: true
          });

          var widget = (0, _currentRefinedValues2.default)(parameters);
          widget.init(initParameters);
          widget.render(renderParameters);

          setRefinementsInExpectedProps();
          expectedProps.attributes = {};

          expect(ReactDOM.render.calledOnce).toBe(true);
          expect(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
        });

        it('should render all attributes with an empty array', function () {
          parameters.attributes = [];

          refinements.splice(0, 0, {
            type: 'facet',
            attributeName: 'extraFacet',
            name: 'extraFacet-val1',
            count: 42,
            exhaustive: true
          });

          var widget = (0, _currentRefinedValues2.default)(parameters);
          widget.init(initParameters);
          widget.render(renderParameters);

          setRefinementsInExpectedProps();
          expectedProps.attributes = {};

          expect(ReactDOM.render.calledOnce).toBe(true);
          expect(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
        });

        it('should render and pass all attributes defined in each objects', function () {
          parameters.attributes = [{
            name: 'facet'
          }, {
            name: 'facetExclude',
            label: 'Facet exclude'
          }, {
            name: 'disjunctiveFacet',
            transformData: function transformData(data) {
              data.name = 'newname';
              return data;
            }
          }];

          refinements = (0, _filter2.default)(refinements, function (refinement) {
            return ['facet', 'facetExclude', 'disjunctiveFacet'].indexOf(refinement.attributeName) !== -1;
          });

          var widget = (0, _currentRefinedValues2.default)(parameters);
          widget.init(initParameters);
          widget.render(renderParameters);

          setRefinementsInExpectedProps();
          expectedProps.attributes = {
            facet: {
              name: 'facet'
            },
            facetExclude: {
              name: 'facetExclude',
              label: 'Facet exclude'
            },
            disjunctiveFacet: {
              name: 'disjunctiveFacet',
              transformData: function transformData(data) {
                data.name = 'newname';
                return data;
              }
            }
          };

          expect(ReactDOM.render.calledOnce).toBe(true);
          expect(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
        });
      });

      describe('with options.onlyListedAttributes === false', function () {
        beforeEach(function () {
          parameters.onlyListedAttributes = false;
        });

        it('should render all attributes with not defined attributes', function () {
          delete parameters.attributes;

          refinements.splice(0, 0, {
            type: 'facet',
            attributeName: 'extraFacet',
            name: 'extraFacet-val1',
            count: 42,
            exhaustive: true
          });

          var widget = (0, _currentRefinedValues2.default)(parameters);
          widget.init(initParameters);
          widget.render(renderParameters);

          setRefinementsInExpectedProps();
          expectedProps.attributes = {};

          expect(ReactDOM.render.calledOnce).toBe(true);
          expect(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
        });

        it('should render all attributes with an empty array', function () {
          parameters.attributes = [];

          refinements.splice(0, 0, {
            type: 'facet',
            attributeName: 'extraFacet',
            name: 'extraFacet-val1',
            count: 42,
            exhaustive: true
          });

          var widget = (0, _currentRefinedValues2.default)(parameters);
          widget.init(initParameters);
          widget.render(renderParameters);

          setRefinementsInExpectedProps();
          expectedProps.attributes = {};

          expect(ReactDOM.render.calledOnce).toBe(true);
          expect(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
        });

        it('should render and pass all attributes defined in each objects', function () {
          parameters.attributes = [{
            name: 'facet'
          }, {
            name: 'facetExclude',
            label: 'Facet exclude'
          }, {
            name: 'disjunctiveFacet',
            transformData: function transformData(data) {
              data.name = 'newname';
              return data;
            }
          }];

          refinements.splice(0, 0, {
            type: 'facet',
            attributeName: 'extraFacet',
            name: 'extraFacet-val1',
            count: 42,
            exhaustive: true
          });
          var firstRefinements = (0, _filter2.default)(refinements, function (refinement) {
            return ['facet', 'facetExclude', 'disjunctiveFacet'].indexOf(refinement.attributeName) !== -1;
          });
          var otherRefinements = (0, _filter2.default)(refinements, function (refinement) {
            return ['facet', 'facetExclude', 'disjunctiveFacet'].indexOf(refinement.attributeName) === -1;
          });
          refinements = [].concat(firstRefinements).concat(otherRefinements);

          var widget = (0, _currentRefinedValues2.default)(parameters);
          widget.init(initParameters);
          widget.render(renderParameters);

          setRefinementsInExpectedProps();
          expectedProps.attributes = {
            facet: {
              name: 'facet'
            },
            facetExclude: {
              name: 'facetExclude',
              label: 'Facet exclude'
            },
            disjunctiveFacet: {
              name: 'disjunctiveFacet',
              transformData: function transformData(data) {
                data.name = 'newname';
                return data;
              }
            }
          };

          expect(ReactDOM.render.calledOnce).toBe(true);
          expect(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
        });
      });

      describe('with options.onlyListedAttributes not defined', function () {
        beforeEach(function () {
          delete parameters.onlyListedAttributes;
        });

        it('should default to false', function () {
          parameters.attributes = [{
            name: 'facet'
          }, {
            name: 'facetExclude',
            label: 'Facet exclude'
          }, {
            name: 'disjunctiveFacet',
            transformData: function transformData(data) {
              data.name = 'newname';
              return data;
            }
          }];

          refinements.splice(0, 0, {
            type: 'facet',
            attributeName: 'extraFacet',
            name: 'extraFacet-val1',
            count: 42,
            exhaustive: true
          });
          var firstRefinements = (0, _filter2.default)(refinements, function (refinement) {
            return ['facet', 'facetExclude', 'disjunctiveFacet'].indexOf(refinement.attributeName) !== -1;
          });
          var otherRefinements = (0, _filter2.default)(refinements, function (refinement) {
            return ['facet', 'facetExclude', 'disjunctiveFacet'].indexOf(refinement.attributeName) === -1;
          });
          refinements = [].concat(firstRefinements).concat(otherRefinements);

          var widget = (0, _currentRefinedValues2.default)(parameters);
          widget.init(initParameters);
          widget.render(renderParameters);

          setRefinementsInExpectedProps();
          expectedProps.attributes = {
            facet: {
              name: 'facet'
            },
            facetExclude: {
              name: 'facetExclude',
              label: 'Facet exclude'
            },
            disjunctiveFacet: {
              name: 'disjunctiveFacet',
              transformData: function transformData(data) {
                data.name = 'newname';
                return data;
              }
            }
          };

          expect(ReactDOM.render.calledOnce).toBe(true);
          expect(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
        });
      });
    });

    describe('options.clearAll', function () {
      it('should pass it as clearAllPosition', function () {
        parameters.clearAll = 'before';

        var widget = (0, _currentRefinedValues2.default)(parameters);
        widget.init(initParameters);
        widget.render(renderParameters);

        expectedProps.clearAllPosition = 'before';

        expect(ReactDOM.render.calledOnce).toBe(true);
        expect(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
      });
    });

    describe('options.templates', function () {
      it('should pass it in templateProps', function () {
        parameters.templates.item = 'MY CUSTOM TEMPLATE';

        var widget = (0, _currentRefinedValues2.default)(parameters);
        widget.init(initParameters);
        widget.render(renderParameters);

        expectedProps.templateProps.templates.item = 'MY CUSTOM TEMPLATE';

        expect(ReactDOM.render.calledOnce).toBe(true);
        expect(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
      });
    });

    describe('options.autoHideContainer', function () {
      describe('without refinements', function () {
        beforeEach(function () {
          helper.clearRefinements().clearTags();
          renderParameters.state = helper.state;

          expectedProps.refinements = [];
          expectedProps.clearRefinementClicks = [];
          expectedProps.clearRefinementURLs = [];
          expectedProps.shouldAutoHideContainer = true;
        });

        it('shouldAutoHideContainer should be true with autoHideContainer = true', function () {
          parameters.autoHideContainer = true;

          var widget = (0, _currentRefinedValues2.default)(parameters);
          widget.init(initParameters);
          widget.render(renderParameters);

          expect(ReactDOM.render.calledOnce).toBe(true);
          expect(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
        });

        it('shouldAutoHideContainer should be false with autoHideContainer = false', function () {
          parameters.autoHideContainer = false;

          var widget = (0, _currentRefinedValues2.default)(parameters);
          widget.init(initParameters); // eslint-disable-next-line max-len

          widget.render(renderParameters);

          expectedProps.shouldAutoHideContainer = false;

          expect(ReactDOM.render.calledOnce).toBe(true);
          expect(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
        });
      });

      describe('with refinements', function () {
        it('shouldAutoHideContainer should be false with autoHideContainer = true', function () {
          parameters.autoHideContainer = true;

          var widget = (0, _currentRefinedValues2.default)(parameters);
          widget.init(initParameters);
          widget.render(renderParameters);

          expectedProps.shouldAutoHideContainer = false;

          expect(ReactDOM.render.calledOnce).toBe(true);
          expect(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
        });

        it('shouldAutoHideContainer should be false with autoHideContainer = false', function () {
          parameters.autoHideContainer = false;

          var widget = (0, _currentRefinedValues2.default)(parameters);
          widget.init(initParameters);
          widget.render(renderParameters);

          expectedProps.shouldAutoHideContainer = false;

          expect(ReactDOM.render.calledOnce).toBe(true);
          expect(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
        });
      });
    });

    describe('options.cssClasses', function () {
      it('should be passed in the cssClasses', function () {
        parameters.cssClasses.body = 'custom-passed-body';

        var widget = (0, _currentRefinedValues2.default)(parameters);
        widget.init(initParameters);
        widget.render(renderParameters);

        expectedProps.cssClasses.body = 'ais-current-refined-values--body custom-passed-body';

        expect(ReactDOM.render.calledOnce).toBe(true);
        expect(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
      });

      it('should work with an array', function () {
        parameters.cssClasses.body = ['custom-body', 'custom-body-2'];

        var widget = (0, _currentRefinedValues2.default)(parameters);
        widget.init(initParameters);
        widget.render(renderParameters);

        expectedProps.cssClasses.body = 'ais-current-refined-values--body custom-body custom-body-2';

        expect(ReactDOM.render.calledOnce).toBe(true);
        expect(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
      });
    });

    describe('with attributes', function () {
      it('should sort the refinements according to their order', function () {
        parameters.attributes = [{ name: 'disjunctiveFacet' }, { name: 'facetExclude' }];
        parameters.onlyListedAttributes = false;

        refinements.splice(0, 0, {
          type: 'facet',
          attributeName: 'extraFacet',
          name: 'extraFacet-val1',
          count: 42,
          exhaustive: true
        });
        var firstRefinements = (0, _filter2.default)(refinements, {
          attributeName: 'disjunctiveFacet'
        });
        var secondRefinements = (0, _filter2.default)(refinements, {
          attributeName: 'facetExclude'
        });
        var otherRefinements = (0, _filter2.default)(refinements, function (refinement) {
          return ['disjunctiveFacet', 'facetExclude'].indexOf(refinement.attributeName) === -1;
        });
        refinements = [].concat(firstRefinements).concat(secondRefinements).concat(otherRefinements);

        var widget = (0, _currentRefinedValues2.default)(parameters);
        widget.init(initParameters);
        widget.render(renderParameters);

        setRefinementsInExpectedProps();
        expectedProps.attributes = {
          disjunctiveFacet: { name: 'disjunctiveFacet' },
          facetExclude: { name: 'facetExclude' }
        };

        expect(ReactDOM.render.calledOnce).toBe(true);
        expect(ReactDOM.render.firstCall.args[0]).toMatchSnapshot();
      });
    });

    afterEach(function () {
      _currentRefinedValues2.default.__ResetDependency__('render');
    });
  });
});