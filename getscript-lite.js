/*!
* getScript (lite)
*   github.com/premasagar/mishmash/tree/master/getscript/
*
*//*
    load single or multiple JavaScript files, with callbacks and optional settings

    by Premasagar Rose
        dharmafly.com

    license
        opensource.org/licenses/mit-license.php
        
    v0.1

*//*

    creates method
        getScript
        
    examples
        single script
            getScript('http://example.com/jquery.js', callback);
        
        set options
            charset:
                added as an attribute to the <script> element ('utf-8' by default);
            target:
                an iframe or other window (global 'window' by default);
            keep:
                boolean - should the script element in the document head remain after the script has loaded? (false by default)
            async: whether async attribute is added (true by default)
            
        getScript('http://example.com/jquery.js', callback, {charset:'utf-8', target:window, keep:false});
        
        // multiple scripts
        getScript(["jquery.js", "example.js"], callback);
        
    callback(status)
        status === true if the script loaded successfully (or all scripts, in the case of multiple scripts). status === false if the script load failed -> but in older versions of IE, the callback will never fire at all (to handle this, set a timeout in your calling script)
        
    TODO
        use options.timeout = 60 seconds, for older IEs that don't support onerror
        
*//*global self */



/**
 * Load a script into a <script> element
 * @param {String} src The source url for the script to load
 * @param {Function} callback Called when the script has loaded
 */

function getScript(src, callback, options){
    "use strict";
    
    options = options || {};
    
    var window = self,
        charset = options.charset || "utf-8",
        target = options.target || window,
        keep = options.keep,
        document = target.document,
        head = document.getElementsByTagName('head')[0],
        script = document.createElement('script'),
        loaded = false;
        
    function finish(){
        // Clean up circular references to prevent memory leaks in IE
        script.onload = script.onreadystatechange = script.onerror = null;
        
        // Remove script element once loaded
        if (!keep){
            head.removeChild(script); 
        }        
        if (callback){
            callback.call(target, loaded);
        }
    }
    
    script.type = 'text/javascript'; // This is the default for HTML5+ documents, but should should be applied for pre-HTML5 documents, or errors may be seen in some browsers.
    script.charset = charset;
    
    script.onload = script.onreadystatechange = function(){
        var state = this.readyState;
        
        if (!loaded && (!state || state === "complete" || state === "loaded")){
            loaded = true;
            finish();
        }
    };
    
    // NOTE: doesn't work in IE. Maybe IE9?
    script.onerror = finish;
    
    // Async loading (extra hinting for compliant browsers)
    script.async = true;
    
    // Apply the src
    script.src = src;
    
    // Go...
    head.appendChild(script);
}
