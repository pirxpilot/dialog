
/**
 * Module dependencies.
 */

const Emitter = require('component-emitter');

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

const template = `
<dialog>
  <div class="content">
    <span class="title"></span>
    <a href="#" class="close"></a>
    <div class="body">
        <p></p>
    </div>
  </div>
</dialog>
`;

function fromTemplate(template) {
  const p = document.createElement('div');
  p.innerHTML = template;
  return p.removeChild(p.firstElementChild);
}

class Dialog extends Emitter {
  constructor(options = {}) {
    super();
    this.template = template;
    this.el = fromTemplate(this.template);
    this.render(options);
    if (active && !active.hiding) active.hide();
    if (exports.effect) this.effect(exports.effect);
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
      this.hide();
    });
    this.el.addEventListener('close', () => this.remove());

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
    this._modal = true;
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
    document.body.appendChild(this.el);
    if (this._modal) {
      this.el.showModal();
    } else {
      this.el.show();
    }
    this.emit('show');
    return this;
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
    // prevent thrashing - this isn't used
    this.hiding = true;

    // duration
    if (ms) {
      setTimeout(() => this.hide(), ms);
      return this;
    }

    this.el.close();
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
      this.emit('hide', this.el.returnValue);
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
