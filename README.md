# getScript and getScript Lite

getScript is an asyncronous JavaScript file loader; it allows you to dynamically load JavaScript files, with callbacks and optional settings.

There are two versions of getScript: the "standard" (full) version, and a stripped down "lite" version.  The core functionality of both versions is identical, and is described below.  


## getScript - lite version

The lite version of getScript allows you to dynamically add a `<script>` element to a page.  

### getScript()

**Arguments**: src, [callback], [options]

* **src**: (string) Path to a JavaScript file
* **callback**: (function) Optional callback function to call when script has loaded
* **options**: (object) Contains optional parameters:
    * **charset**: (string) Added as an attribute to the `<script>` element ('utf-8' by default)
    * **target**: (object) An iframe or other window (global 'window' by default);
    * **keep**: (boolean) Should the script element in the document head remain after the script has loaded? (false by default)


### Example usage

Load a single JavaScript file into the current page

    getScript('http://example.com/jquery.js');
    
Load a single JavaScript file, with a callback function

    getScript('http://example.com/jquery.js', loadComplete);
    
Load a single JavaScript file, with a callback, overriding default options

    getScript('http://example.com/jquery.js', loadComplete, {charset: "utf-16", target:this, keep:true});    


### Callback status

The callback method is passed a status parameter which will be set to true if the script loaded successfully.  This is set to false if the script load failed.  

Example testing the callback status:

    getScript('http://example.com/jquery.js', function(status){
      if (status === true) {
        // file loaded successfully, carry on
      } else {
        // file failed to load, process error
      }
    });    
    
Please note - in older versions of IE, the callback will never fire at all. To handle this, set a timeout in your calling script.


## getScript - full version

The full getScript extends the basic functionality of the lite version. 


### Loading multiple scripts

In the full version of getScript, the src parameter can be a string containing a path to a single file, or an array of paths for loading multiple files.  

The getScript method can take any number of arguments.  If multiple parameters are set, these are treated as sets of dependencies.  

Scripts within an array are downloaded in parallel, and so should not have dependencies on one another.

Each successive argument can contain a script or scripts that are dependent on the previous argument, as they will not be downloaded until the previous set of dependencies have loaded.


### Example usage

Loading multiple scripts in parallel:

    getScript([
      "jquery.js", 
      "example.js",
      "lorem.js"
    ], callback);

Dependencies - Load each string/array in turn.  Within an array, scripts will be loaded asyncronously (so must be executable in any order):

    getScript([
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

Within a getScript call, it is possible to require files only if certain tests are passed.  

For example:

    var isNode = true;  // variable to test

    getScript([
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
    

## Alternative script loaders

getScript is similar to:

* [lab.js](http://labjs.com)
* [require.js](http://requirejs.org/)
* [$script.js](http://www.dustindiaz.com/scriptjs)
* [control.js](http://stevesouders.com/controljs/)
* [head.js](http://headjs.com/)
* [yepnope.js](http://yepnopejs.com/)
