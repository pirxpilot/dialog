
3.0.0 / 2024-07-11
==================

 * reimplement `escapable` method
 * implement .close as a button
 * reimplement dialog using dialog API
 * switch from browserify to esbuild

2.0.2 / 2022-04-13
==================

 * remove component-domify depenency

2.0.1 / 2019-07-09
==================

 * remove stringify transformation
 * replace template.html with template string

2.0.0 / 2018-11-30
==================

 * rewrite in ES6

1.1.4 / 2018-11-27
==================

 * remove component-query

1.1.3 / 2017-12-12
==================

 * minify HTML template
 * remove component-event
 * remove component-classes

1.1.2 / 2017-05-13
==================

 * replace .npmignore with package.files
 * replace overlay-component with @pirxpilot/overlay

1.1.1 / 2017-02-16
==================

 * change name to @pirxpilot/dialog

1.1.0 / 2015-09-18
==================

 * use CSS to center dialog
 * simplify dialog template

1.0.1 / 2015-09-18
==================

 * switch to browserify build
 * lint fixes

0.3.0 / 2014-08-25
==================

 * fix CSS for test/demo
 * removed generic style rules which break user styles
 * reduced specificity: Changed #dialog to .dialog
 * component.json: Pin and update deps

0.2.1 / 2014-06-16
==================

 * c8: Update overlay dep

0.2.0 / 2014-04-05
==================

 * add Dialog.fixed function to allow for an alternate centering algorithm
 * fix 'dialog not centered in some cases' issue

0.1.0 / 2014-04-03
==================

 * remove jQuery dependency
 * fix problems with reopening dialog - remove 'hide' class on show
 * support passing options in overlay() to overlay component
 * make escapable() public
 * use component templates to translate HTML

0.0.7 / 2013-05-27 
==================

 * pin deps

0.0.6 / 2013-02-12 
==================

  * remove redundant 'show' event
  * fix gap between x and "close"

0.0.5 / 2012-09-21 
==================

  * add hidden "close" em within .close
  * remove default box-shadow on .modal. Closes #3

0.0.4 / 2012-08-31 
==================

  * add `.addClass()`. Closes #2
  * add template.js

0.0.3 / 2012-08-03 
==================

  * add component.json
  * fix some event race-conditions

0.0.2 / 2012-07-05 
==================

  * fix dialog.effect support
