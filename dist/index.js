"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useDisclosure = function useDisclosure(props) {
  var _React$useState = _react["default"].useState(typeof props.isExpanded !== 'undefined' ? props.isExpanded : true),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      isExpanded = _React$useState2[0],
      setIsExpanded = _React$useState2[1];

  _react["default"].useEffect(function () {
    typeof props.isExpanded !== 'undefined' && setIsExpanded(props.isExpanded);
  }, [props.isExpanded]);

  var toggle = _react["default"].useCallback(function () {
    return setIsExpanded(function (v) {
      return !v;
    });
  }, []);

  var toggleProps = {
    id: props.id + '-toggle',
    onClick: toggle,
    type: 'button',
    'aria-expanded': isExpanded,
    'aria-controls': props.id + '-content'
  };
  var contentProps = {
    id: props.id + '-content',
    'aria-hidden': !isExpanded,
    'aria-labelledby': props.id + '-toggle'
  };
  return {
    toggleProps: toggleProps,
    contentProps: contentProps,
    isExpanded: isExpanded,
    toggle: toggle
  };
};

var _default = useDisclosure;
exports["default"] = _default;
