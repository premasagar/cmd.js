'use strict';

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
        // single script
        getScript('http://example.com/jquery.js', callback);
        
        // set options
            // charset is added as an attribute to the <script> element ('utf-8' by default);
            // target could be an iframe window, etc (global window by default);
            // keep is boolean - should the script element in the document head remain after the script has loaded? (false by default)
        getScript('http://example.com/jquery.js', callback, {charset:'utf-8', target:window, keep:false});
        
        // multiple scripts
        getScript(['jquery.js', 'example.js'], callback);
        
    to do
        synchronous loading of multiple scripts that have dependencies on one another
        

*/

function getScript(srcs, callback, options){
    /**
     * Load a script into a <script> element
     * @param {String} src The source url for the script to load
     * @param {Function} callback Called when the script has loaded
     */
    function single(src, callback, options){
        var
            charset = options.charset,
            keep = options.keep,
            target = options.target,
            document = target.document,
            head = document.getElementsByTagName('head')[0],
            script = document.createElement('script'),
            loaded;
        
        script.type = 'text/javascript'; // Needed for some gitchy browsers, outside of HTML5
        script.charset = charset;
        script.onload = script.onreadystatechange = function(){
            var state = this.readyState;
            if (!loaded && (!state || state === 'complete' || state === 'loaded')){
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
        // Async loading (extra hinting for compliant browsers)
        script.async = true;
        
        // Apply the src
        script.src = src;
        
        // And go...
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
        var
            length = srcs.length,
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
    
    var window = this,
        method = (typeof srcs === 'string') ? single : multiple;
    
    options = options || {};
    if (!options.charset){
        options.charset = 'utf-8';
    }
    if (!options.target){
        options.target = window;
    }
    
    callback = callback || function(){};        
    return method.call(this, srcs, callback, options);
}

/*jslint browser: true, devel: true, onevar: true, undef: true, eqeqeq: true, bitwise: true, regexp: true, strict: true, newcap: true, immed: true */
