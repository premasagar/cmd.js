# [cmd.js](http://github.com/premasagar/cmd.js)

cmd.js is a lightweight, asyncronous flow controller. It can execute a series of JavaScript files and passed functions in an orderly manner, either in parallel or in series, or a mixture of the two.

## Example usage

Load a single JavaScript file into the current page

    cmd('http://example.com/jquery.js');
    
Load a single JavaScript file, with a callback function

    cmd('http://example.com/jquery.js', loadComplete);
    
Load a single JavaScript file, with a callback, overriding default options

    cmd('http://example.com/jquery.js', loadComplete, {charset: "utf-16", target:this, keep:true});  

Load a single JavaScript file into the current page

    cmd("foo.js");
    cmd("http://example.com");
    
Load a single JavaScript file, with a callback
    cmd("foo.js", callback);
    // callback fires when script loads
    // callback is passed a single argument: `success`, a boolean that is`true` if all scripts loaded successfully; false if the at least one script load failed
    // in older versions of IE, currently, the callback will not fire if one of the scripts fails to load. to overcome this, set a timeout in your calling script. TODO: implement `options.timeout = 60` // in seconds, for older IEs that don't support `script.onerror`
    
Load multiple scripts
    cmd("foo.js", "bar.js", "boo.js");
    
Load multiple scripts, with a callback
    cmd("foo.js", "bar.js", "boo.js", callback);
    // callback fires when all scripts have loaded
    
Load scripts with dependencies
    cmd(["foo.js", "bar.js"], "boo.js", callback);
    // here, foo.js and bar.js are loaded in parallel, but boo.js waits until both are loaded before it executes
    
Load any number of scripts and callback functions, in any sequence
    cmd(
        callback1,
        "foo.js",
        callback2,
        ["1.js", "2.js", "3.js"],
        callback3
        // etc
    );
    
Un-nest and re-arrange inline functions
    cmd(
        callback1,
        callback2,
        callback3
    );
    // Each function is passed the value returned from the previously called function.
    
Override default options

    cmd("foo.js", callback, {
        charset: "utf-16",
        target:this,
        keep:true,
        path:"/javascript/",
        noCache:true
    });


### cmd()

**Arguments**: [... multiple src URLs and callbacks ...], [options]

#### Multiple src URLs and callbacks

Each successive argument is executed after the previous one has finished (i.e. in series). Scripts can be loaded via URLs. Callback functions can be passed, which are passed the result of the previous step.

* **src**: (string) Path to a JavaScript file
* **callback**: (function) Optional callback function to call when script has loaded
* **options**: (object) Contains optional parameters:
    * **charset**: (string) Added as an attribute to the script element (default: "utf-8")
    * **target**: (object) An iframe or other window (default: global `window` object)
    * **keep**: (boolean) Should the script element remain in the document head after the script has loaded? (default: false)
    * **path**: "http://example.com/javascript/", // path to prefix to all script urls (default: "")
    * **noCache**: false // debug / development mode, to prevent scripts being cached by the browser (default: false)


### Callbacks

When a callback follows a script URL, the callback will be passed `true` if the script successfully loaded, or `false` if it failed.

Example testing the callback status:

    cmd("foo.js", function(status){
      if (status === true) {
        // file loaded successfully, carry on
      } else {
        // file failed to load, process error
      }
    });    
    
NOTE: in older versions of IE, the callback will fire only if the script successfully loads (it won't fire if the script fails to load). To handle this, set a timeout in the calling script and wait to see if the callback has already fired.


### Arrays, and group callbacks
If an array of URLs and callbacks is passed, the array's items will be executed in parallel, with no guaranteed order.
// Group callbacks


### Loading multiple scripts

The src parameter can be a string containing a path to a single file, or an array of paths for loading multiple files.  

The cmd() method can take any number of arguments.  If multiple parameters are set, these are treated as sets of dependencies.  

Scripts within an array are downloaded in parallel, and so should not have dependencies on one another.

Each successive argument can contain a script or scripts that are dependent on the previous argument, as they will not be downloaded until the previous set of dependencies have loaded.


### Example usage

Loading multiple scripts in parallel:

    cmd([
      "jquery.js", 
      "example.js",
      "lorem.js"
    ], callback);

Dependencies - Load each string/array in turn.  Within an array, scripts will be loaded asyncronously (so must be executable in any order):

    cmd([
          "lorem.js",
          "ipsum.js",
          "dolor.js"
      ],
      "sit.js",
      "amet.js",
      [
          "foo.js", 
          "bar.js",
      ], callback);

### loading files based on 'feature tests'

Within a cmd() call, it is possible to require files only if certain tests are passed.  

For example:

    var isNode = true;  // variable to test

    cmd([
          "lorem.js",
          "ipsum.js",
          "dolor.js"
      ],
      [
          isNode ? "server-side-code.js" : "client-side-code.js"
      ],
      "sit.js",
      "amet.js",
    );


## /lib

### getscript.js

It has all the script loading options of cmd.js, but only allows a single script src to be loaded at a time.

A single script loader. It dynamically load a `<script>` element to a page, with success/failure callback and optional configuration (including all the script-related options from cmd.js).

### Ideas

`options.type === "json"`. Callbacks that follow JSON transport are passed the JSON object. Those callbacks can process the data in some manner, and then return a value to be used by the following callback.

`options.type === "css"`, to load external stylesheets.

`options.type === "img"`, to preload an image.


## Alternative script loaders

cmd.js is similar to:

* [lab.js](http://labjs.com)
* [require.js](http://requirejs.org/)
* [$script.js](http://www.dustindiaz.com/scriptjs)
* [control.js](http://stevesouders.com/controljs/)
* [head.js](http://headjs.com/)
* [yepnope.js](http://yepnopejs.com/)
