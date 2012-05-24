# [cmd.js](http://github.com/premasagar/cmd.js)

cmd.js is a lightweight, asynchronous flow controller / file loader. It can load and execute a series of JavaScript files and passed functions in an orderly manner, either in parallel or in series, or a mixture of the two.

## Example usage

**Load a single JavaScript file into the current page**

    cmd("http://example.com/foo.js");

    
**Load a single JavaScript file, with a callback function**

Callbacks fire when a script loads.  The callback is passed a single argument: `success`, a boolean that is `true` if all scripts loaded successfully; `false` if the at least one script load failed

    cmd("http://example.com/foo.js", loadComplete);    

    
**Load a single JavaScript file, with a callback, overriding default options**

    cmd("http://example.com/foo.js", loadComplete, {
        charset: "utf-16",
        target:this,
        keep:true,
        path:"/javascript/",
        noCache:true
    });


**Load a single local/remote JavaScript file into the current page**

    cmd("foo.js");                    // load a local file    
    cmd("http://example.com/foo.js"); // load a remote file

       
**Load multiple JavaScript files in series (one after the other)**

    cmd("foo.js", "http://example.com/bar.js", "boo.js");
    
    
**Load multiple scripts in series, with a callback**

The callback fires when all scripts have loaded

    cmd("foo.js", "bar.js", "boo.js", loadComplete);


**Loading multiple scripts in parallel**

Scripts within an array will be loaded asyncronously so must be executable in any order

    cmd([
      "foo.js", 
      "bar.js", 
      "http://example.com/lorem.js",
      "ipsum.js"
    ]);

    
**Load scripts with dependencies**

    cmd(["foo.js", "bar.js"], "boo.js", loadComplete);
    // here, foo.js and bar.js are loaded in parallel, but boo.js waits until both are loaded before it executes
    
    
**Load any number of scripts and callback functions, in any sequence**

    cmd(
        "foo.js",
        callback1,
        ["1.js", "2.js", "3.js"],
        callback2
    );


**Feature-testing**

Different scripts can be loaded depending on whether a variable is 'truthy' 

    cmd(
        "1.js", 
        isTheSkyBlue ? "2.js" : "3.js", 
        "4.js"
    );
    // load 1.js, then *either* 2.js *or* 3.js, depending on whether variable `isTheSkyBlue` is truthy, then load 4.js
        
        
**Feature-testing with `null`**

The use of `null` will skip to the next argument without loading/executing a script

    cmd(
        "foo.js", 
        isBarSupported ? null : "barPolyfill.js", 
        "bar.js"
    );
    // load foo.js, then load barPolyfill.js *if variable `isBarSupported` is not true*, then load bar.js
    
    
**Un-nest and re-arrange inline functions**

Each function is passed the value returned from the previously called function.

    cmd(
        callback1,
        callback2,
        callback3
    );
    
    
## cmd()

**Arguments**: [... multiple src URLs and callbacks ...], [options]

### Multiple src URLs and callbacks

The `cmd()` method can take any number of arguments.  If multiple parameters are set, these are treated as sets of dependencies.  

Each successive argument is executed after the previous one has finished (i.e. in series). Scripts can be loaded via URLs. Callback functions can be passed, which are passed the result of the previous step.

Scripts within an array are downloaded in parallel, and so should not have dependencies on one another. Each successive argument can contain a script or scripts that are dependent on the previous argument, as they will not be downloaded until the previous set of dependencies have loaded.

Possible arguments to pass to `cmd()` are:

* **src**: (string, array, function, or combination of) Path to JavaScript file(s), documented above
* **callback**: (function) Optional callback function to call when script has loaded
* **options**: (object) Contains optional parameters:
    * **charset**: (string) Added as an attribute to the script element (default: "utf-8")
    * **target**: (object) An iframe or other window (default: global `window` object)
    * **keep**: (boolean) Should the script element remain in the document head after the script has loaded? (default: false)
    * **path**: (string) Path to prefix to all script urls, such as "http://example.com/javascript/" (default: "")
    * **noCache**: (boolean) Set to true in debug / development mode to prevent scripts being cached by the browser (default: false)


### Callbacks

When a callback follows a script URL, the callback will be passed `true` if the script successfully loaded, or `false` if it failed.

Example testing the callback status:

    cmd("foo.js", function(status){
      if (status === true) {
        // file loaded successfully, do something
      } else {
        // file failed to load, process error
      }
    });    

#### 'Failure' callbacks in IE6-8
NOTE: In Internet Explorer 6, 7 and 8, the callback will only fire if the script successfully loads. In IE9+, as with other browsers, the callback will also fire if the script fails to load (here, boolean `false` will be passed into the callback). Currently, if you need to have a 'failure' callback in IE6-8, then setTimeout in the calling script and if the success callback hasn't fired within, say 30 seconds, then assume that the script failed to load. Future versions of cmd.js may allow `option.timeout`, to handle this situation.


<!-- //Group callbacks -->

<!-- 

`options.type === "json"`. Callbacks that follow JSON transport are passed the JSON object. Those callbacks can process the data in some manner, and then return a value to be used by the following callback.

`options.type === "css"`, to load external stylesheets.

`options.type === "img"`, to preload an image.

-->


## /lib

### getscript.js

getscript.js is a barebones, standalone, script loader. It has all the script loading options of cmd.js, but only allows a single script src to be loaded at a time. It can be used separately to cmd.js as a single script loader.

It dynamically loads a `<script>` element to a page, with a success/failure callback and optional configuration.

#### getscript.js options

    getScript(
        "foo.js", 
        callback, 
        {
            charset: "utf-16", 
            target:this, 
            keep:true,
            noCache: true
        }
    );  


## Alternative script loaders

cmd.js is similar to:

* [lab.js](http://labjs.com)
* [require.js](http://requirejs.org/)
* [$script.js](http://www.dustindiaz.com/scriptjs)
* [control.js](http://stevesouders.com/controljs/)
* [head.js](http://headjs.com/)
* [yepnope.js](http://yepnopejs.com/)
