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
        
        // set options - charset is added as an attribute to the <script> element; targetWindow could be an iframe window, etc
        getScript('http://example.com/jquery.js', callback, {charset:'utf-8', targetWindow:window});
        
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
            targetWindow = options.targetWindow,
            document = targetWindow.document,
            head = document.getElementsByTagName('head')[0],
            script = document.createElement('script'),
            loaded;
            
        script.src = src;
        script.type = 'text/javascript'; // Needed for some gitchy browsers, outside of HTML5
        script.charset = charset;
        script.onload = script.onreadystatechange = function(){
            var state = this.readyState;
            if (!loaded && (!state || state === 'complete' || state === 'loaded')){
                // Handle memory leak in IE
                script.onload = script.onreadystatechange = null;
                // head.removeChild(script); // Worth removing script element once loaded?
                
                loaded = true;
                callback.call(targetWindow);
            }
        };
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
                callback.call(options.targetWindow);
            }
        };
        
        // Doesn't call callback until after all scripts have loaded
        for (i = 0; i < length; i++){
            single(srcs[i], checkIfComplete, options);
        }
    }

    // **
    
    var
        method = (typeof srcs === 'string') ? single : multiple;
    
    if (!options.charset){
        options.charset = 'utf-8';
    }
    if (!options.targetWindow){
        options.targetWindow = window;
    }
    
    callback = callback || function(){};        
    return method.call(this, srcs, callback, options);
}

/*jslint browser: true, devel: true, onevar: true, undef: true, eqeqeq: true, bitwise: true, regexp: true, strict: true, newcap: true, immed: true */
