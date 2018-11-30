
/**
 * Module dependencies.
 */

const Emitter = require('component-emitter');

const overlay = require('@pirxpilot/overlay');
const domify = require('component-domify');

/**
 * Active dialog.
 */

let active;

/**
 * Expose `dialog()`.
 */

exports = module.exports = dialog;


/**
 * Initialize a new `Dialog`.
 *
 * Options:
 *
 *    - `title` dialog title
 *    - `message` a message to display
 *
 * Emits:
 *
 *    - `show` when visible
 *    - `hide` when hidden
 *
 * @param {Object} options
 * @api public
 */

class Dialog extends Emitter {
  constructor(options = {}) {
    super();
    this.template = require('./template.html');
    this.el = domify(this.template);
    this.render(options);
    if (active && !active.hiding) active.hide();
    if (exports.effect) this.effect(exports.effect);
    this.on('escape', () => this.hide());
    active = this;
  }

  /**
   * Render with the given `options`.
   *
   * @param {Object} options
   * @api public
   */

  render({ message, title }) {

    this.el.querySelector('.close').addEventListener('click', ev => {
      ev.preventDefault();
      this.emit('close');
      this.hide();
    });

    const titleEl = this.el.querySelector('.title');
    if (titleEl) {
      if (!title) {
        titleEl.remove();
      } else {
        titleEl.textContent = title;
      }
    }

    // message
    const pEl = this.el.querySelector('p');
    if ('string' === typeof message) {
      pEl.textContent = message;
    } else if (message) {
      pEl.parentNode.replaceChild(message.el || message, pEl);
    }
  }

  /**
   * Enable the dialog close link.
   *
   * @return {Dialog} for chaining
   * @api public
   */

  closable() {
    return this.addClass('closable');
  }

  /**
   * Add class `name`.
   *
   * @param {String} name
   * @return {Dialog}
   * @api public
   */

  addClass(name) {
    this.el.classList.add(name);
    return this;
  }

  /**
   * Set the effect to `type`.
   *
   * @param {String} type
   * @return {Dialog} for chaining
   * @api public
   */

  effect(type) {
    this._effect = type;
    this.addClass(type);
    return this;
  }

  /**
   * Make it modal!
   *
   * @return {Dialog} for chaining
   * @api public
   */

  modal() {
    this._overlay = overlay();
    return this;
  }

  /**
   * Add an overlay.
   *
   * @return {Dialog} for chaining
   * @api public
   */

  overlay(opts) {
    opts = opts || { closable: true };
    const o = overlay(opts);
    o.on('hide', () => {
      this._overlay = null;
      this.hide();
    });
    this._overlay = o;
    return this;
  }

  /**
   * Close the dialog when the escape key is pressed.
   *
   * @api public
   */

  escapable() {
    // Save reference to remove listener later
    if (!this._escKeyCallback) {
      this._escKeyCallback = e => 'Escape' === e.key && this.emit('escape');
    }
    document.addEventListener('keydown', this._escKeyCallback);
    return this;
  }

  /**
   * Show the dialog.
   *
   * Emits "show" event.
   *
   * @return {Dialog} for chaining
   * @api public
   */

  show() {
    const overlay = this._overlay;

    // overlay
    if (overlay) {
      overlay.show();
      this.el.classList.add('modal');
    }

    // escape
    if (!overlay || overlay.closable) this.escapable();

    // show
    document.body.appendChild(this.el);
    // let render before removing hide for effects to kick in
    setTimeout(() => this.el.classList.remove('hide'), 0);
    this.emit('show');
    return this;
  }

  /**
   * Hide the overlay.
   *
   * @api private
   */

  hideOverlay() {
    if (!this._overlay) return;
    this._overlay.remove();
    this._overlay = null;
  }

  /**
   * Hide the dialog with optional delay of `ms`,
   * otherwise the dialog is removed immediately.
   *
   * Emits "hide" event.
   *
   * @return {Number} ms
   * @return {Dialog} for chaining
   * @api public
   */

  hide(ms) {
    if (this._escKeyCallback) {
      document.removeEventListener('keydown', this._escKeyCallback);
    }

    // prevent thrashing - this isn't used
    this.hiding = true;

    // duration
    if (ms) {
      setTimeout(() => this.hide(), ms);
      return this;
    }

    // hide / remove
    this.el.classList.add('hide');
    if (this._effect) {
      setTimeout(() => this.remove(), 500);
    } else {
      this.remove();
    }

    // overlay
    this.hideOverlay();

    return this;
  }

  /**
   * Hide the dialog without potential animation.
   *
   * @return {Dialog} for chaining
   * @api public
   */

  remove() {
    if (this.el.parentNode) {
      this.emit('hide');
      this.el.remove();
    }
    return this;
  }
}

/**
 * Expose `Dialog`.
 */

exports.Dialog = Dialog;

/**
 * Return a new `Dialog` with the given
 * (optional) `title` and `msg`.
 *
 * @param {String} title or msg
 * @param {String} msg
 * @return {Dialog}
 * @api public
 */

function dialog(title, message){
  switch (arguments.length) {
    case 2:
      return new Dialog({ title, message });
    case 1:
      return new Dialog({ message: title });
  }
}
