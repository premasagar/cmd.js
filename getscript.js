"use strict";

/*!
* getScript
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
        
    to do
        synchronous loading of multiple scripts that have dependencies on one another
        
*/

/*jslint onevar: true, browser: true, devel: true, undef: true, eqeqeq: true, bitwise: true, regexp: false, strict: true, newcap: false, immed: true, nomen: false, evil: true*//*global window: true, self: true */

function getScript(srcs, callback, options){
    /**
     * Load a script into a <script> element
     * @param {String} src The source url for the script to load
     * @param {Function} callback Called when the script has loaded
     */
    function single(src, callback, options){
        var charset = options.charset,
            keep = options.keep,
            target = options.target,
            async = options.async,
            document = target.document,
            head = document.getElementsByTagName('head')[0],
            script = document.createElement('script'),
            loaded = false;
        
        script.type = 'text/javascript'; // This is the default for HTML5 documents, but should should be applied for pre-HTML5 documents, or errors may be seen in some browsers.
        script.charset = charset;
        script.onload = script.onreadystatechange = function(){
            var state = this.readyState;
            
            if (!loaded && (!state || state === "complete" || state === "loaded")){
                // Handle memory leak in IE
                script.onload = script.onreadystatechange = null;
                
                // Remove script element once loaded
                if (!keep){
                    head.removeChild(script); 
                }
                
                loaded = true;
                callback.call(target);
            }
        };
        // Async loading (extra hinting for compliant browsers; defaults to true)
        script.async = (async === false);
        
        // Apply the src
        script.src = src;
        
        // Go...
        head.appendChild(script);
    }

    // **

    /**
     * Load array of scripts into script elements.  
     *
     * Note, there is only one callback function here, called after each is loaded
     *
     * @param {Array} srcs array of source files to load
     * @param {Function} callback
     */

    function multiple(srcs, callback, options){
        var length = srcs.length,
            loaded = 0,
            checkIfComplete, i;
        
        // Check if all scripts have loaded
        checkIfComplete = function(){
            if (++loaded === length){
                callback.call(options.target);
            }
        };
        
        // Doesn't call callback until after all scripts have loaded
        for (i = 0; i < length; i++){
            single(srcs[i], checkIfComplete, options);
        }
    }

    // **
    
    var window = self,
        method = (typeof srcs === "string") ? single : multiple;
    
    options = options || {};
    if (!options.charset){
        options.charset = "utf-8";
    }
    if (!options.target){
        options.target = window;
    }
    
    callback = callback || function(){};        
    return method.call(window, srcs, callback, options);
}
