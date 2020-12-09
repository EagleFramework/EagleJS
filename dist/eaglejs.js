/**
 * EagleJS.
 *
 * @version   0.5.2
 * @copyright 2020 Cem Demirkartal
 * @license   MIT
 * @see       {@link https://github.com/eagleirons/eaglejs GitHub}
 * @augments  Array<DOMItem>
 */
class EagleJS extends Array {
  /**
   * Return a collection of matched items or created nodes by HTML string.
   *
   * @example
   * // string
   * $('selector');
   * $('htmlString'); // Create HTML tag
   *
   * // DOMItem
   * $(DOMItem);
   *
   * // DOMItem[]
   * $(EagleJS);
   *
   * // string + string
   * $('selector', 'selector');
   *
   * // string + DOMItem
   * $('selector', DOMItem);
   *
   * // string + DOMItem[]
   * $('selector', EagleJS);
   *
   * @param {?(string|DOMItem|DOMItem[])} [selector=null] A selector to match.
   * @param {string|DOMItem|DOMItem[]} [context=document] A selector to use as
   * context.
   */
  constructor (selector = null, context = document) {
    super();
    if (selector !== null) {
      if (typeof selector === 'string') {
        if (/^\s*<.+>\s*$/.test(selector)) {
          if (EagleJS.isDocument(context)) {
            const doc = context.implementation.createHTMLDocument('');
            return new EagleJS('body', doc).html(selector).children();
          }
        } else {
          return new EagleJS(context).find(selector);
        }
      } else if (Array.isArray(selector)) {
        this.push(...selector);
      } else {
        this.push(selector);
      }
    }
  }

  /**
   * Add the class name to each element in the collection.
   *
   * @example
   * $(element).addClass('className');
   * $(element).addClass('className', 'className');
   *
   * @see DOMTokenList.add() on {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/add MDN}.
   * @param {...string} names One or more class names.
   * @returns {this} The current collection.
   */
  addClass (...names) {
    this.forEach((item) => {
      if (EagleJS.isElement(item)) {
        item.classList.add(...names);
      }
    });
    return this;
  }

  /**
   * Insert content after each node in the collection.
   *
   * @example
   * $(element).after('text');
   * $(element).after(Node);
   * $(element).after('text', Node);
   * $(element).after(Node, Node);
   *
   * @see ChildNode.after() on {@link https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/after MDN}.
   * @param {...(string|Node)} content The content to insert.
   * @returns {this} The current collection.
   */
  after (...content) {
    /** @type {Node[]} */
    const nodeArray = [];
    content.forEach((value) => {
      if (typeof value === 'string') {
        nodeArray.push(document.createTextNode(value));
      } else {
        nodeArray.push(value);
      }
    });
    let first = true;
    this.slice().reverse().forEach((item) => {
      if (EagleJS.isChildNode(item) && item.parentNode !== null) {
        const parent = item.parentNode;
        const next = item.nextSibling;
        nodeArray.forEach((node) => {
          parent.insertBefore(first ? node : node.cloneNode(true), next);
        });
        first = false;
      }
    });
    return this;
  }

  /**
   * Insert content to the end of each node in the collection.
   *
   * @example
   * $(element).append('text');
   * $(element).append(Node);
   * $(element).append('text', Node);
   * $(element).append(Node, Node);
   *
   * @see ParentNode.append() on {@link https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/append MDN}.
   * @param {...(string|Node)} content The content to insert.
   * @returns {this} The current collection.
   */
  append (...content) {
    /** @type {Node[]} */
    const nodeArray = [];
    content.forEach((value) => {
      if (typeof value === 'string') {
        nodeArray.push(document.createTextNode(value));
      } else {
        nodeArray.push(value);
      }
    });
    let first = true;
    this.slice().reverse().forEach((item) => {
      if (EagleJS.isParentNode(item)) {
        nodeArray.forEach((node) => {
          item.appendChild(first ? node : node.cloneNode(true));
        });
        first = false;
      }
    });
    return this;
  }

  /**
   * Get or set the attribute value of each element in the collection.
   *
   * @example <caption>attr (name: string): string | null</caption>
   * $(element).attr('attributeName');
   *
   * @example <caption>attr (name: string, value: string): this</caption>
   * $(element).attr('attributeName', 'value');
   *
   * @see Element.getAttribute() on {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute MDN}
   * for the get functionality.
   * @see Element.setAttribute() on {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute MDN}
   * for the set functionality.
   * @param {string} name The name of the attribute.
   * @param {string} [value] The value for the attribute.
   * @returns {string|null|this} The attribute value of the first element; Or if
   * the value parameter provided, returns the current collection.
   */
  attr (name, value) {
    if (typeof value !== 'undefined') {
      this.forEach((item) => {
        if (EagleJS.isElement(item)) {
          item.setAttribute(name, value);
        }
      });
      return this;
    }
    /** @type {?string} */
    let returnValue = null;
    this.some((item) => {
      if (EagleJS.isElement(item)) {
        returnValue = item.getAttribute(name);
        return true;
      }
      return false;
    });
    return returnValue;
  }

  /**
   * Insert content before each node in the collection.
   *
   * @example
   * $(element).before('text');
   * $(element).before(Node);
   * $(element).before('text', Node);
   * $(element).before(Node, Node);
   *
   * @see ChildNode.before() on {@link https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/before MDN}.
   * @param {...(string|Node)} content The content to insert.
   * @returns {this} The current collection.
   */
  before (...content) {
    /** @type {Node[]} */
    const nodeArray = [];
    content.forEach((value) => {
      if (typeof value === 'string') {
        nodeArray.push(document.createTextNode(value));
      } else {
        nodeArray.push(value);
      }
    });
    let first = true;
    this.slice().reverse().forEach((item) => {
      if (EagleJS.isChildNode(item) && item.parentNode !== null) {
        const parent = item.parentNode;
        nodeArray.forEach((node) => {
          parent.insertBefore(first ? node : node.cloneNode(true), item);
        });
        first = false;
      }
    });
    return this;
  }

  /**
   * Get the children of each node in the collection, optionally filtered by a
   * selector.
   *
   * @example
   * $(element).children();
   * $(element).children('selector');
   *
   * @see ParentNode.children on {@link https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/children MDN}.
   * @param {?(string|DOMItem|DOMItem[]|MatchCallback)} [filter=null] A selector
   * to filter by {@link module:eaglejs~EagleJS#filter filter()} method.
   * @returns {EagleJS} A new collection.
   */
  children (filter = null) {
    const $elements = new EagleJS();
    this.forEach((item) => {
      if (EagleJS.isParentNode(item)) {
        $elements.push(...item.children);
      }
    });
    if (filter !== null) {
      return $elements.filter(filter);
    }
    return $elements;
  }

  /**
   * Return duplicates of each node in the collection.
   *
   * @example
   * $(element).clone();
   * $(element).clone(true);
   * $(element).clone(false);
   *
   * @see Node.cloneNode() on {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode MDN}.
   * @param {boolean} [deep=false] If true, then node and its whole
   * subtree—including text that may be in child Text nodes—is also copied.
   * @returns {EagleJS} A new collection.
   */
  clone (deep = false) {
    const $elements = new EagleJS();
    this.forEach((item) => {
      if (EagleJS.isNode(item)) {
        $elements.push(item.cloneNode(deep));
      }
    });
    return $elements;
  }

  /**
   * Get the closest ancestor of each element in the collection matching with
   * the selector.
   *
   * @example
   * $(element).closest('selector');
   *
   * @see Element.closest() on {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/closest MDN}.
   * @param {string} selector A selector to match.
   * @returns {EagleJS} A new collection.
   */
  closest (selector) {
    const $elements = new EagleJS();
    this.forEach((item) => {
      if (EagleJS.isElement(item)) {
        const closest = item.closest(selector);
        if (closest !== null) {
          $elements.push(closest);
        }
      }
    });
    return $elements;
  }

  /**
   * Merge two or more collections.
   *
   * @example
   * $(element).concat(EagleJS, EagleJS, EagleJS);
   *
   * @see Array.prototype.concat() on {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat MDN}.
   * @param {...(DOMItem|Array<DOMItem>)} items Values to concatenate into a new
   * array.
   * @returns {EagleJS} A new collection.
   */
  concat (...items) {
    return new EagleJS(super.concat(...items));
  }

  /**
   * Get the children of each node in the collection, including comment and text
   * nodes.
   *
   * @example
   * $(element).contents();
   *
   * @see Node.childNodes on {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/childNodes MDN}.
   * @returns {EagleJS} A new collection.
   */
  contents () {
    const $elements = new EagleJS();
    this.forEach((item) => {
      if (EagleJS.isNode(item)) {
        $elements.push(...item.childNodes);
      }
    });
    return $elements;
  }

  /**
   * Get or set the data attribute value of each element in the collection.
   *
   * @example <caption>data (): object</caption>
   * $(element).data();
   *
   * @example <caption>data (key: string): string | undefined</caption>
   * $(element).data('key');
   *
   * @example <caption>data (key: string, value: string): this</caption>
   * $(element).data('key', 'value');
   *
   * @see HTMLOrForeignElement.dataset on {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLOrForeignElement/dataset MDN}.
   * @param {string} [key] The name of the data.
   * @param {string} [value] The new data value.
   * @returns {object|string|undefined|this} The dataset of the first element;
   * Or if the key parameter provided, returns the value of the first element,
   * and if the value parameter provided, returns the current collection.
   */
  data (key, value) {
    if (typeof key !== 'undefined') {
      /** @type {string} */
      const camelCaseKey = key.replace(/-([a-z])/g, (_match, letter) => {
        return letter.toUpperCase();
      });
      if (typeof value !== 'undefined') {
        this.forEach((item) => {
          if ('dataset' in item) {
            item.dataset[camelCaseKey] = value;
          }
        });
        return this;
      }
      /** @type {string|undefined} */
      let returnValue;
      this.some((item) => {
        if ('dataset' in item) {
          returnValue = item.dataset[camelCaseKey];
          return true;
        }
        return false;
      });
      return returnValue;
    }
    /** @type {object} */
    let returnValue = {};
    this.some((item) => {
      if ('dataset' in item) {
        returnValue = item.dataset;
        return true;
      }
      return false;
    });
    return returnValue;
  }

  /**
   * Remove the children of each node in the collection from the DOM.
   *
   * @example
   * $(element).empty();
   *
   * @returns {this} The current collection.
   */
  empty () {
    this.contents().remove();
    return this;
  }

  /**
   * Reduce the collection with the given selector.
   *
   * @example
   * // string
   * $(element).filter('selector');
   *
   * // DOMItem
   * $(element).filter(DOMItem);
   *
   * // DOMItem[]
   * $(element).filter(EagleJS);
   *
   * // Function
   * $(element).filter(function (item, index) {
   *   return item.value > 0;
   * });
   *
   * @see Element.matches() on {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/matches MDN}
   * for string parameter.
   * @see Array.prototype.includes() on {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes MDN}
   * for DOMItem and DOMItem[] parameter.
   * @see Array.prototype.filter() on {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter MDN}
   * for function parameter.
   * @param {string|DOMItem|DOMItem[]|MatchCallback} selector A selector to
   * match.
   * @param {*} [thisArg] Value to use as this when executing callback.
   * @returns {this} A new collection.
   */
  filter (selector, thisArg) {
    if (typeof selector === 'string') {
      return this.filter((item) => {
        return EagleJS.isElement(item) && item.matches(selector);
      });
    }
    if (typeof selector === 'function') {
      return super.filter(selector, thisArg);
    }
    if (Array.isArray(selector)) {
      return this.filter((item) => selector.includes(item));
    }
    return this.filter((item) => item === selector);
  }

  /**
   * Get the descendants of each node in the collection, filtered by a
   * selector.
   *
   * @example <caption>find (selector: string): EagleJS</caption>
   * $(element).find('selector');
   *
   * @example <caption>find (selector: MatchCallback, thisArg?: any): DOMItem |
   * undefined</caption>
   * $(element).find(function (item, index) {
   *   return item.value > 0;
   * });
   *
   * @see ParentNode.querySelectorAll() on {@link https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/querySelectorAll MDN}
   * for string parameter.
   * @see Array.prototype.find() on {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find MDN}
   * for function parameter.
   * @param {string|MatchCallback} selector A selector to match.
   * @param {*} [thisArg] Value to use as this when executing callback.
   * @returns {EagleJS|DOMItem|undefined} A new collection; or a DOMItem if the
   * parameter is a function.
   */
  find (selector, thisArg) {
    const $elements = new EagleJS();
    if (typeof selector === 'string') {
      this.forEach((item) => {
        if (EagleJS.isParentNode(item)) {
          $elements.push(...item.querySelectorAll(selector));
        }
      });
    } else if (typeof selector === 'function') {
      return super.find(selector, thisArg);
    }
    return $elements;
  }

  /**
   * Check if any collection element has the specified class name.
   *
   * @example
   * $(element).hasClass('className');
   *
   * @see DOMTokenList.contains() on {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/contains MDN}.
   * @param {string} name The class name to search.
   * @returns {boolean} True if any element has the given class name, otherwise
   * false.
   */
  hasClass (name) {
    return this.some((item) => {
      return EagleJS.isElement(item) && item.classList.contains(name);
    });
  }

  /**
   * Get or set the HTML content of each element in the collection.
   *
   * @example <caption>html (): string</caption>
   * $(element).html();
   *
   * @example <caption>html (value: string): this</caption>
   * $(element).html('htmlString'); // Create HTML tag
   *
   * @see Element.innerHTML on {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML MDN}.
   * @param {string} [value] The html string to set.
   * @returns {string|this} The HTML string of the first element; Or if the
   * value parameter provided, returns the current collection.
   */
  html (value) {
    if (typeof value !== 'undefined') {
      this.forEach((item) => {
        if (EagleJS.isElement(item)) {
          item.innerHTML = value;
        }
      });
      return this;
    }
    /** @type {string} */
    let returnValue = '';
    this.some((item) => {
      if (EagleJS.isElement(item)) {
        returnValue = item.innerHTML;
        return true;
      }
      return false;
    });
    return returnValue;
  }

  /**
   * Check any element in the collection that matches the selector.
   *
   * @example
   * // selector
   * $(element).is('selector');
   *
   * // DOMItem
   * $(element).is(DOMItem);
   *
   * // DOMItem[]
   * $(element).is(EagleJS);
   *
   * // Function
   * $(element).is(function (item, index) {
   *   return item.value === 0;
   * });
   *
   * @see Element.matches() on {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/matches MDN}
   * for string parameter.
   * @see Array.prototype.includes() on {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes MDN}
   * for DOMItem and DOMItem[] parameter.
   * @see Array.prototype.some() on {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some MDN}
   * for function parameter.
   * @param {string|DOMItem|DOMItem[]|MatchCallback} selector A selector to
   * match.
   * @returns {boolean} True if any element matches the given filter, otherwise
   * false.
   */
  is (selector) {
    if (typeof selector === 'string') {
      return this.some((item) => {
        return EagleJS.isElement(item) && item.matches(selector);
      });
    }
    if (typeof selector === 'function') {
      return this.some(selector);
    }
    if (Array.isArray(selector)) {
      return this.some((item) => selector.includes(item));
    }
    return this.some((item) => item === selector);
  }

  /**
   * Check if the value implements the ChildNode interface.
   *
   * @example
   * EagleJS.isChildNode(element); // true
   * EagleJS.isChildNode(document); // false
   * EagleJS.isChildNode(window); // false
   *
   * @see ChildNode interface on {@link https://developer.mozilla.org/en-US/docs/Web/API/ChildNode MDN}.
   * @param {*} value The value to be checked.
   * @returns {boolean} True if the value implements the ChildNode interface;
   * otherwise, false.
   */
  static isChildNode (value) {
    return this.isNode(value) && [1, 3, 4, 7, 8, 10].includes(value.nodeType);
  }

  /**
   * Check if the value is a Document node.
   *
   * @example
   * EagleJS.isDocument(element); // false
   * EagleJS.isDocument(document); // true
   * EagleJS.isDocument(window); // false
   *
   * @see Document interface on {@link https://developer.mozilla.org/en-US/docs/Web/API/Document MDN}.
   * @param {*} value The value to be checked.
   * @returns {boolean} True if the value is a Document node; otherwise, false.
   */
  static isDocument (value) {
    return this.isNode(value) && value.nodeType === 9;
  }

  /**
   * Check if the variable is a DOMItem.
   *
   * @example
   * EagleJS.isDOMItem(element); // true
   * EagleJS.isDOMItem(document); // true
   * EagleJS.isDOMItem(window); // true
   *
   * @see {@link module:eaglejs~DOMItem DOMItem} type.
   * @param {*} value The value to be checked.
   * @returns {boolean} True if the value is a DOMItem; otherwise, false.
   */
  static isDOMItem (value) {
    return Boolean(value) && Boolean(value.addEventListener);
  }

  /**
   * Check if the value is an Element node.
   *
   * @example
   * EagleJS.isElement(element); // true
   * EagleJS.isElement(document); // false
   * EagleJS.isElement(window); // false
   *
   * @see Element interface on {@link https://developer.mozilla.org/en-US/docs/Web/API/Element MDN}.
   * @param {*} value The value to be checked.
   * @returns {boolean} True if the value is an Element node; otherwise, false.
   */
  static isElement (value) {
    return this.isNode(value) && value.nodeType === 1;
  }

  /**
   * Check if the value is a Node.
   *
   * @example
   * EagleJS.isNode(element); // true
   * EagleJS.isNode(document); // true
   * EagleJS.isNode(window); // false
   *
   * @see Node interface on {@link https://developer.mozilla.org/en-US/docs/Web/API/Node MDN}.
   * @param {*} value The value to be checked.
   * @returns {boolean} True if the value is a Node; otherwise, false.
   */
  static isNode (value) {
    return Boolean(value) && Boolean(value.nodeType);
  }

  /**
   * Check if the value implements the ParentNode interface.
   *
   * @example
   * EagleJS.isParentNode(element); // true
   * EagleJS.isParentNode(document); // true
   * EagleJS.isParentNode(window); // false
   *
   * @see ParentNode interface on {@link https://developer.mozilla.org/en-US/docs/Web/API/ParentNode MDN}.
   * @param {*} value The value to be checked.
   * @returns {boolean} True if the value implements the ParentNode interface;
   * otherwise, false.
   */
  static isParentNode (value) {
    return this.isNode(value) && [1, 9, 11].includes(value.nodeType);
  }

  /**
   * Get the next sibling of each node in the collection, optionally filtered by
   * a selector.
   *
   * @example
   * $(element).next();
   * $(element).next('selector');
   *
   * @see NonDocumentTypeChildNode.nextElementSibling on {@link https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/nextElementSibling MDN}.
   * @param {?(string|DOMItem|DOMItem[]|MatchCallback)} [filter=null] A selector
   * to filter by {@link module:eaglejs~EagleJS#filter filter()} method.
   * @returns {EagleJS} A new collection.
   */
  next (filter = null) {
    const $elements = new EagleJS();
    this.forEach((item) => {
      if ('nextElementSibling' in item &&
                item.nextElementSibling !== null) {
        $elements.push(item.nextElementSibling);
      }
    });
    if (filter !== null) {
      return $elements.filter(filter);
    }
    return $elements;
  }

  /**
   * Remove matched elements from the collection.
   *
   * @example
   * // string
   * $(element).not('selector');
   *
   * // DOMItem
   * $(element).not(DOMItem);
   *
   * // DOMItem[]
   * $(element).not(EagleJS);
   *
   * // Function
   * $(element).not(function (item, index) {
   *   return item.value > 0;
   * });
   *
   * @see Element.matches() on {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/matches MDN}
   * for string parameter.
   * @see Array.prototype.includes() on {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes MDN}
   * for DOMItem and DOMItem[] parameter.
   * @see Array.prototype.filter() on {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter MDN}
   * for function parameter.
   * @param {string|DOMItem|DOMItem[]|MatchCallback} selector A selector to
   * match.
   * @returns {this} A new collection.
   */
  not (selector) {
    if (typeof selector === 'string') {
      return this.filter((item) => {
        return EagleJS.isElement(item) && !item.matches(selector);
      });
    }
    if (typeof selector === 'function') {
      return this.filter((item, index, array) => {
        const flag = Boolean(selector(item, index, array));
        return !flag;
      });
    }
    if (Array.isArray(selector)) {
      return this.filter((item) => !selector.includes(item));
    }
    return this.filter((item) => item !== selector);
  }

  /**
   * Remove the event listener from each item in the collection.
   *
   * @example
   * $(element).off('click', handler);
   *
   * @see EventTarget.removeEventListener() on {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener MDN}.
   * @param {string} event A case-sensitive string representing the event type.
   * @param {EventListener|EventListenerObject} listener The handler function
   * for the event.
   * @param {boolean|EventListenerOptions} [options=false] Characteristics of
   * the event listener.
   * @returns {this} The current collection.
   */
  off (event, listener, options = false) {
    this.forEach((item) => {
      item.removeEventListener(event, listener, options);
    });
    return this;
  }

  /**
   * Attach the event listener to each item in the collection.
   *
   * @example
   * $(element).on('click', function (event) {
   *   console.log(event.type);
   * });
   *
   * @see EventTarget.addEventListener() on {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener MDN}.
   * @param {string} event A case-sensitive string representing the event type.
   * @param {EventListener|EventListenerObject} listener The handler function
   * for the event.
   * @param {boolean|AddEventListenerOptions} [options=false] Characteristics of
   * the event listener.
   * @returns {this} The current collection.
   */
  on (event, listener, options = false) {
    this.forEach((item) => {
      item.addEventListener(event, listener, options);
    });
    return this;
  }

  /**
   * Attach the event listener to each item in the collection. The event
   * listener is executed at most once per element per event type.
   *
   * @example
   * $(element).one('click', function (event) {
   *   console.log(event.type);
   * });
   *
   * @see {@link module:eaglejs~EagleJS#on EagleJS.prototype.on()} with
   * options.once parameter.
   * @param {string} event A case-sensitive string representing the event type.
   * @param {EventListener|EventListenerObject} listener The handler function
   * for the event.
   * @returns {this} The current collection.
   */
  one (event, listener) {
    return this.on(event, listener, {
      once: true
    });
  }

  /**
   * Get the parent of each node in the collection, optionally filtered by a
   * selector.
   *
   * @example
   * $(element).parent();
   * $(element).parent('selector');
   *
   * @see Node.parentNode on {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/parentNode MDN}.
   * @param {?(string|DOMItem|DOMItem[]|MatchCallback)} [filter=null] A selector
   * to filter by {@link module:eaglejs~EagleJS#filter filter()} method.
   * @returns {EagleJS} A new collection.
   */
  parent (filter = null) {
    const $elements = new EagleJS();
    this.forEach((item) => {
      if (EagleJS.isNode(item) && item.parentNode !== null) {
        $elements.push(item.parentNode);
      }
    });
    if (filter !== null) {
      return $elements.filter(filter);
    }
    return $elements;
  }

  /**
   * Insert content to the beginning of each node in the collection.
   *
   * @example
   * $(element).prepend('text');
   * $(element).prepend(Node);
   * $(element).prepend('text', Node);
   * $(element).prepend(Node, Node);
   *
   * @see ParentNode.prepend() on {@link https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/prepend MDN}.
   * @param {...(string|Node)} content The content to insert.
   * @returns {this} The current collection.
   */
  prepend (...content) {
    /** @type {Node[]} */
    const nodeArray = [];
    content.forEach((value) => {
      if (typeof value === 'string') {
        nodeArray.push(document.createTextNode(value));
      } else {
        nodeArray.push(value);
      }
    });
    let first = true;
    this.slice().reverse().forEach((item) => {
      if (EagleJS.isParentNode(item)) {
        const firstChild = item.firstChild;
        nodeArray.forEach((node) => {
          item.insertBefore(first ? node : node.cloneNode(true), firstChild);
        });
        first = false;
      }
    });
    return this;
  }

  /**
   * Get the previous sibling of each node in the collection, optionally
   * filtered by a selector.
   *
   * @example
   * $(element).prev();
   * $(element).prev('selector');
   *
   * @see NonDocumentTypeChildNode.previousElementSibling on {@link https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/previousElementSibling MDN}.
   * @param {?(string|DOMItem|DOMItem[]|MatchCallback)} [filter=null] A selector
   * to filter by {@link module:eaglejs~EagleJS#filter filter()} method.
   * @returns {EagleJS} A new collection.
   */
  prev (filter = null) {
    const $elements = new EagleJS();
    this.forEach((item) => {
      if ('previousElementSibling' in item) {
        if (item.previousElementSibling !== null) {
          $elements.push(item.previousElementSibling);
        }
      }
    });
    if (filter !== null) {
      return $elements.filter(filter);
    }
    return $elements;
  }

  /**
   * Adds one or more items to the end of the collection.
   *
   * @example
   * $(element).push(DOMItem, DOMItem, DOMItem);
   *
   * // Spread and push
   * $(element).push(...EagleJS);
   *
   * @see Array.prototype.push() on {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push MDN}.
   * @param {...DOMItem} items Items to add to the end of the collection.
   * @returns {number} The new length.
   */
  push (...items) {
    return super.push(...items.filter((item) => {
      return EagleJS.isDOMItem(item) && !this.includes(item);
    }));
  }

  /**
   * Specify a function to execute when the DOM is completely loaded.
   *
   * @example
   * $(document).ready(function () {
   *   // Call when DOM is completely loaded
   * });
   *
   * @see DOMContentLoaded event on {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event MDN}.
   * @param {EventListener} listener The handler function for the event.
   * @returns {this} The current collection.
   */
  ready (listener) {
    this.forEach((item) => {
      if (EagleJS.isDocument(item)) {
        if (item.readyState === 'loading') {
          item.addEventListener('DOMContentLoaded', listener);
        } else {
          setTimeout(listener); // Async
        }
      }
    });
    return this;
  }

  /**
   * Remove nodes of the collection from the DOM.
   *
   * @example
   * $(element).remove();
   *
   * @see ChildNode.remove() on {@link https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove MDN}.
   * @returns {this} The current collection.
   */
  remove () {
    this.forEach((item) => {
      if (EagleJS.isChildNode(item)) {
        if (item.parentNode !== null) {
          item.parentNode.removeChild(item);
        }
      }
    });
    return this;
  }

  /**
   * Remove the attribute from each element in the collection.
   *
   * @example
   * $(element).removeAttr('attributeName');
   * $(element).removeAttr('attributeName', 'attributeName');
   *
   * @see Element.removeAttribute() on {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute MDN}.
   * @param {...string} names One or more attribute names.
   * @returns {this} The current collection.
   */
  removeAttr (...names) {
    this.forEach((item) => {
      if (EagleJS.isElement(item)) {
        names.forEach((name) => {
          item.removeAttribute(name);
        });
      }
    });
    return this;
  }

  /**
   * Remove the class name from each element in the collection.
   *
   * @example
   * $(element).removeClass('className');
   * $(element).removeClass('className', 'className');
   *
   * @see DOMTokenList.remove() on {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/remove MDN}.
   * @param {...string} names One or more class names.
   * @returns {this} The current collection.
   */
  removeClass (...names) {
    this.forEach((item) => {
      if (EagleJS.isElement(item)) {
        item.classList.remove(...names);
      }
    });
    return this;
  }

  /**
   * Replace each node in the collection with the given content.
   *
   * @example
   * $(element).replaceWith('text');
   * $(element).replaceWith(Node);
   * $(element).replaceWith('text', Node);
   * $(element).replaceWith(Node, Node);
   *
   * @see ChildNode.replaceWith() on {@link https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/replaceWith MDN}.
   * @param {...(string|Node)} content The content to replace.
   * @returns {this} The current collection.
   */
  replaceWith (...content) {
    return this.before(...content).remove();
  }

  /**
   * Get the siblings of each node in the collection, optionally filtered by a
   * selector.
   *
   * @example
   * $(element).siblings();
   * $(element).siblings('selector');
   *
   * @param {?(string|DOMItem|DOMItem[]|MatchCallback)} [filter=null] A selector
   * to filter by {@link module:eaglejs~EagleJS#filter filter()} method.
   * @returns {EagleJS} A new collection.
   */
  siblings (filter = null) {
    const $elements = new EagleJS();
    this.forEach((item) => {
      const $element = new EagleJS(item);
      $elements.push(...$element.parent().children(filter).not($element));
    });
    return $elements;
  }

  /**
   * Get or set the text content of each node in the collection.
   *
   * @example <caption>text (): string | null</caption>
   * $(element).text();
   *
   * @example <caption>text (value: string): this</caption>
   * $(element).text('value');
   *
   * @see HTMLElement.innerText on {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText MDN}.
   * @param {string} [value] The text to set.
   * @returns {string|null|this} Text of the first node; Or if the value
   * parameter provided, returns the current collection.
   */
  text (value) {
    if (typeof value !== 'undefined') {
      this.forEach((item) => {
        if (EagleJS.isNode(item)) {
          item.textContent = value;
        }
      });
      return this;
    }
    /** @type {?string} */
    let returnValue = null;
    this.some((item) => {
      if (EagleJS.isNode(item)) {
        returnValue = item.textContent;
        return true;
      }
      return false;
    });
    return returnValue;
  }

  /**
   * Toggle the class name to each element in the collection.
   *
   * @example
   * $(element).toggleClass('className');
   * $(element).toggleClass('className', true);
   * $(element).toggleClass('className', false);
   *
   * @see DOMTokenList.toggle() on {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/toggle MDN}.
   * @param {string} name The class name.
   * @param {?boolean} [force=null] A boolean value to determine whether the
   * class should be added or removed.
   * @returns {this} The current collection.
   */
  toggleClass (name, force = null) {
    if (force === null) {
      this.forEach((item) => {
        if (EagleJS.isElement(item)) {
          item.classList.toggle(name);
        }
      });
    } else {
      this.forEach((item) => {
        if (EagleJS.isElement(item)) {
          item.classList.toggle(name);
        }
      });
    }
    return this;
  }

  /**
   * Trigger the specified event on each item in the collection.
   *
   * @example
   * $(element).trigger('click');
   * $(element).trigger('click', data);
   *
   * @see CustomEvent on {@link https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent MDN}.
   * @see EventTarget.dispatchEvent() on {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent MDN}.
   * @param {string} event The name of the event.
   * @param {?object} [data=null] Additional data to pass along to the event
   * handler.
   * @returns {this} The current collection.
   */
  trigger (event, data = null) {
    const customEvent = new CustomEvent(event, {
      bubbles: true,
      cancelable: true,
      detail: data
    });
    this.forEach((item) => {
      item.dispatchEvent(customEvent);
    });
    return this;
  }

  /**
   * Adds new items to the beginning of the collection.
   *
   * @example
   * $(element).unshift(DOMItem, DOMItem, DOMItem);
   *
   * // Spread and unshift
   * $(element).unshift(...EagleJS);
   *
   * @see Array.prototype.unshift() on {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift MDN}.
   * @param {...DOMItem} items Items to add to the front of the collection.
   * @returns {number} The new length.
   */
  unshift (...items) {
    return super.unshift(...items.filter((item) => {
      return EagleJS.isDOMItem(item) && !this.includes(item);
    }));
  }
}
/**
 * DOM items like EventTarget, Node (Element, Text, Document, etc.), and Window.
 *
 * @see EventTarget on {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget MDN}.
 * @see Node on {@link https://developer.mozilla.org/en-US/docs/Web/API/Node MDN}.
 * @see Window on {@link https://developer.mozilla.org/en-US/docs/Web/API/Window MDN}.
 * @typedef {EventTarget|Node|Window|Element|Text|CDATASection|
 * ProcessingInstruction|Comment|Document|DocumentType|DocumentFragment|
 * HTMLElement|SVGElement} DOMItem
 */
/**
 * A function to test each item in the collection.
 *
 * @callback MatchCallback
 * @param {DOMItem} element The current element being processed.
 * @param {number} [index] The index of the current element being processed.
 * @param {DOMItem[]} [array] The array function was called upon.
 * @returns {boolean}
 */
/**
 * Proxy to use EagleJS Class without the new keyword.
 *
 * @example <caption>Usage (Ecmascript 6 Module)</caption>
 * import { EagleJSProxy as $ } from 'eaglejs.esm.js';
 *
 * $(document).ready(function () {
 *   // Call when DOM is completely loaded
 * });
 *
 * @param {?(string|DOMItem|DOMItem[])} [selector=null] A selector to match.
 * @param {string|DOMItem|DOMItem[]} [context=document] A selector to use as
 * context.
 * @returns {EagleJS} A new collection.
 */
const EagleJSProxy = (selector = null, context = document) => {
  return new EagleJS(selector, context);
};

// Define $
window.$ = EagleJSProxy;