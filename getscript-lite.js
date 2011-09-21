/*!
* getScript (lite)
*   github.com/premasagar/mishmash/tree/master/getscript/
*
*//*
    Flexible JavaScript loader

    by Premasagar Rose
        dharmafly.com

    license
        opensource.org/licenses/mit-license.php
        
    v0.1

*//*

    creates method
        getScript
        
    usage
        load a single script
            // as with getscript.js full version
            
        load a single script, with a callback
            // as with getscript.js full version
            
        set config options
            // as with getscript.js full version, except `options.path` not accepted
        
*//*global window */



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
        head = document.getElementsByTagName("head")[0],
        script = document.createElement("script"),
        loaded = false,
        now = (new Date()).getTime();
        
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
    
    script.type = "text/javascript"; // This is the default for HTML5+ documents, but should should be applied for pre-HTML5 documents, or errors may be seen in some browsers.
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
    script.src = (options.path || "") + src + (options.noCache ? "?v=" + now : "");
    
    // Go...
    head.appendChild(script);
}
