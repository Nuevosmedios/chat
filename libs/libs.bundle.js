// This code was written by Tyler Akins and has been placed in the
// public domain.  It would be nice if you left this header intact.
// Base64 code from Tyler Akins -- http://rumkin.com

var Base64 = (function () {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    var obj = {
        /**
         * Encodes a string in base64
         * @param {String} input The string to encode in base64.
         */
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) + keyStr.charAt(enc4);
            } while (i < input.length);

            return output;
        },

        /**
         * Decodes a base64 string.
         * @param {String} input The string to decode.
         */
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            } while (i < input.length);

            return output;
        }
    };

    return obj;
})();
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

var MD5 = (function () {
    /*
     * Configurable variables. You may need to tweak these to be compatible with
     * the server-side, but the defaults work in most cases.
     */
    var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase */
    var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance */
    var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode */

    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    var safe_add = function (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    };

    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    var bit_rol = function (num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    };

    /*
     * Convert a string to an array of little-endian words
     * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
     */
    var str2binl = function (str) {
        var bin = [];
        var mask = (1 << chrsz) - 1;
        for(var i = 0; i < str.length * chrsz; i += chrsz)
        {
            bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
        }
        return bin;
    };

    /*
     * Convert an array of little-endian words to a string
     */
    var binl2str = function (bin) {
        var str = "";
        var mask = (1 << chrsz) - 1;
        for(var i = 0; i < bin.length * 32; i += chrsz)
        {
            str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
        }
        return str;
    };

    /*
     * Convert an array of little-endian words to a hex string.
     */
    var binl2hex = function (binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for(var i = 0; i < binarray.length * 4; i++)
        {
            str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
                hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
        }
        return str;
    };

    /*
     * Convert an array of little-endian words to a base-64 string
     */
    var binl2b64 = function (binarray) {
        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var str = "";
        var triplet, j;
        for(var i = 0; i < binarray.length * 4; i += 3)
        {
            triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16) |
                (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 ) |
                ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
            for(j = 0; j < 4; j++)
            {
                if(i * 8 + j * 6 > binarray.length * 32) { str += b64pad; }
                else { str += tab.charAt((triplet >> 6*(3-j)) & 0x3F); }
            }
        }
        return str;
    };

    /*
     * These functions implement the four basic operations the algorithm uses.
     */
    var md5_cmn = function (q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q),safe_add(x, t)), s),b);
    };

    var md5_ff = function (a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    };

    var md5_gg = function (a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    };

    var md5_hh = function (a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    };

    var md5_ii = function (a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    };

    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length
     */
    var core_md5 = function (x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var a =  1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d =  271733878;

        var olda, oldb, oldc, oldd;
        for (var i = 0; i < x.length; i += 16)
        {
            olda = a;
            oldb = b;
            oldc = c;
            oldd = d;

            a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
            d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
            b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
            d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
            c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
            d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
            d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

            a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
            d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
            c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
            b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
            a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
            d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
            c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
            d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
            c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
            a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
            d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
            c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
            b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

            a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
            d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
            b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
            d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
            c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
            d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
            c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
            a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
            d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
            b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

            a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
            d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
            c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
            d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
            d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
            a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
            d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
            b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return [a, b, c, d];
    };


    /*
     * Calculate the HMAC-MD5, of a key and some data
     */
    var core_hmac_md5 = function (key, data) {
        var bkey = str2binl(key);
        if(bkey.length > 16) { bkey = core_md5(bkey, key.length * chrsz); }

        var ipad = new Array(16), opad = new Array(16);
        for(var i = 0; i < 16; i++)
        {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }

        var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
        return core_md5(opad.concat(hash), 512 + 128);
    };

    var obj = {
        /*
         * These are the functions you'll usually want to call.
         * They take string arguments and return either hex or base-64 encoded
         * strings.
         */
        hexdigest: function (s) {
            return binl2hex(core_md5(str2binl(s), s.length * chrsz));
        },

        b64digest: function (s) {
            return binl2b64(core_md5(str2binl(s), s.length * chrsz));
        },

        hash: function (s) {
            return binl2str(core_md5(str2binl(s), s.length * chrsz));
        },

        hmac_hexdigest: function (key, data) {
            return binl2hex(core_hmac_md5(key, data));
        },

        hmac_b64digest: function (key, data) {
            return binl2b64(core_hmac_md5(key, data));
        },

        hmac_hash: function (key, data) {
            return binl2str(core_hmac_md5(key, data));
        },

        /*
         * Perform a simple self-test to see if the VM is working
         */
        test: function () {
            return MD5.hexdigest("abc") === "900150983cd24fb0d6963f7d28e17f72";
        }
    };

    return obj;
})();
/*
    This program is distributed under the terms of the MIT license.
    Please see the LICENSE file for details.

    Copyright 2006-2008, OGG, LLC
*/

/* jslint configuration: */
/*global document, window, setTimeout, clearTimeout, console,
    XMLHttpRequest, ActiveXObject,
    Base64, MD5,
    Strophe, $build, $msg, $iq, $pres */

/** File: strophe.js
 *  A JavaScript library for XMPP BOSH.
 *
 *  This is the JavaScript version of the Strophe library.  Since JavaScript
 *  has no facilities for persistent TCP connections, this library uses
 *  Bidirectional-streams Over Synchronous HTTP (BOSH) to emulate
 *  a persistent, stateful, two-way connection to an XMPP server.  More
 *  information on BOSH can be found in XEP 124.
 */

/** PrivateFunction: Function.prototype.bind
 *  Bind a function to an instance.
 *
 *  This Function object extension method creates a bound method similar
 *  to those in Python.  This means that the 'this' object will point
 *  to the instance you want.  See
 *  <a href='https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind'>MDC's bind() documentation</a> and 
 *  <a href='http://benjamin.smedbergs.us/blog/2007-01-03/bound-functions-and-function-imports-in-javascript/'>Bound Functions and Function Imports in JavaScript</a>
 *  for a complete explanation.
 *
 *  This extension already exists in some browsers (namely, Firefox 3), but
 *  we provide it to support those that don't.
 *
 *  Parameters:
 *    (Object) obj - The object that will become 'this' in the bound function.
 *    (Object) argN - An option argument that will be prepended to the 
 *      arguments given for the function call
 *
 *  Returns:
 *    The bound function.
 */
if (!Function.prototype.bind) {
    Function.prototype.bind = function (obj /*, arg1, arg2, ... */)
    {
        var func = this;
        var _slice = Array.prototype.slice;
        var _concat = Array.prototype.concat;
        var _args = _slice.call(arguments, 1);
        
        return function () {
            return func.apply(obj ? obj : this,
                              _concat.call(_args,
                                           _slice.call(arguments, 0)));
        };
    };
}

/** PrivateFunction: Array.prototype.indexOf
 *  Return the index of an object in an array.
 *
 *  This function is not supplied by some JavaScript implementations, so
 *  we provide it if it is missing.  This code is from:
 *  http://developer.mozilla.org/En/Core_JavaScript_1.5_Reference:Objects:Array:indexOf
 *
 *  Parameters:
 *    (Object) elt - The object to look for.
 *    (Integer) from - The index from which to start looking. (optional).
 *
 *  Returns:
 *    The index of elt in the array or -1 if not found.
 */
if (!Array.prototype.indexOf)
{
    Array.prototype.indexOf = function(elt /*, from*/)
    {
        var len = this.length;

        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0) {
            from += len;
        }

        for (; from < len; from++) {
            if (from in this && this[from] === elt) {
                return from;
            }
        }

        return -1;
    };
}

/* All of the Strophe globals are defined in this special function below so
 * that references to the globals become closures.  This will ensure that
 * on page reload, these references will still be available to callbacks
 * that are still executing.
 */

(function (callback) {
var Strophe;

/** Function: $build
 *  Create a Strophe.Builder.
 *  This is an alias for 'new Strophe.Builder(name, attrs)'.
 *
 *  Parameters:
 *    (String) name - The root element name.
 *    (Object) attrs - The attributes for the root element in object notation.
 *
 *  Returns:
 *    A new Strophe.Builder object.
 */
function $build(name, attrs) { return new Strophe.Builder(name, attrs); }
/** Function: $msg
 *  Create a Strophe.Builder with a <message/> element as the root.
 *
 *  Parmaeters:
 *    (Object) attrs - The <message/> element attributes in object notation.
 *
 *  Returns:
 *    A new Strophe.Builder object.
 */
function $msg(attrs) { return new Strophe.Builder("message", attrs); }
/** Function: $iq
 *  Create a Strophe.Builder with an <iq/> element as the root.
 *
 *  Parameters:
 *    (Object) attrs - The <iq/> element attributes in object notation.
 *
 *  Returns:
 *    A new Strophe.Builder object.
 */
function $iq(attrs) { return new Strophe.Builder("iq", attrs); }
/** Function: $pres
 *  Create a Strophe.Builder with a <presence/> element as the root.
 *
 *  Parameters:
 *    (Object) attrs - The <presence/> element attributes in object notation.
 *
 *  Returns:
 *    A new Strophe.Builder object.
 */
function $pres(attrs) { return new Strophe.Builder("presence", attrs); }

/** Class: Strophe
 *  An object container for all Strophe library functions.
 *
 *  This class is just a container for all the objects and constants
 *  used in the library.  It is not meant to be instantiated, but to
 *  provide a namespace for library objects, constants, and functions.
 */
Strophe = {
    /** Constant: VERSION
     *  The version of the Strophe library. Unreleased builds will have
     *  a version of head-HASH where HASH is a partial revision.
     */
    VERSION: "8d27954",

    /** Constants: XMPP Namespace Constants
     *  Common namespace constants from the XMPP RFCs and XEPs.
     *
     *  NS.HTTPBIND - HTTP BIND namespace from XEP 124.
     *  NS.BOSH - BOSH namespace from XEP 206.
     *  NS.CLIENT - Main XMPP client namespace.
     *  NS.AUTH - Legacy authentication namespace.
     *  NS.ROSTER - Roster operations namespace.
     *  NS.PROFILE - Profile namespace.
     *  NS.DISCO_INFO - Service discovery info namespace from XEP 30.
     *  NS.DISCO_ITEMS - Service discovery items namespace from XEP 30.
     *  NS.MUC - Multi-User Chat namespace from XEP 45.
     *  NS.SASL - XMPP SASL namespace from RFC 3920.
     *  NS.STREAM - XMPP Streams namespace from RFC 3920.
     *  NS.BIND - XMPP Binding namespace from RFC 3920.
     *  NS.SESSION - XMPP Session namespace from RFC 3920.
     */
    NS: {
        HTTPBIND: "http://jabber.org/protocol/httpbind",
        BOSH: "urn:xmpp:xbosh",
        CLIENT: "jabber:client",
        AUTH: "jabber:iq:auth",
        ROSTER: "jabber:iq:roster",
        PROFILE: "jabber:iq:profile",
        DISCO_INFO: "http://jabber.org/protocol/disco#info",
        DISCO_ITEMS: "http://jabber.org/protocol/disco#items",
        MUC: "http://jabber.org/protocol/muc",
        SASL: "urn:ietf:params:xml:ns:xmpp-sasl",
        STREAM: "http://etherx.jabber.org/streams",
        BIND: "urn:ietf:params:xml:ns:xmpp-bind",
        SESSION: "urn:ietf:params:xml:ns:xmpp-session",
        VERSION: "jabber:iq:version",
        STANZAS: "urn:ietf:params:xml:ns:xmpp-stanzas"
    },

    /** Function: addNamespace
     *  This function is used to extend the current namespaces in
     *	Strophe.NS.  It takes a key and a value with the key being the
     *	name of the new namespace, with its actual value.
     *	For example:
     *	Strophe.addNamespace('PUBSUB', "http://jabber.org/protocol/pubsub");
     *
     *  Parameters:
     *    (String) name - The name under which the namespace will be
     *      referenced under Strophe.NS
     *    (String) value - The actual namespace.
     */
    addNamespace: function (name, value)
    {
	Strophe.NS[name] = value;
    },

    /** Constants: Connection Status Constants
     *  Connection status constants for use by the connection handler
     *  callback.
     *
     *  Status.ERROR - An error has occurred
     *  Status.CONNECTING - The connection is currently being made
     *  Status.CONNFAIL - The connection attempt failed
     *  Status.AUTHENTICATING - The connection is authenticating
     *  Status.AUTHFAIL - The authentication attempt failed
     *  Status.CONNECTED - The connection has succeeded
     *  Status.DISCONNECTED - The connection has been terminated
     *  Status.DISCONNECTING - The connection is currently being terminated
     *  Status.ATTACHED - The connection has been attached
     */
    Status: {
        ERROR: 0,
        CONNECTING: 1,
        CONNFAIL: 2,
        AUTHENTICATING: 3,
        AUTHFAIL: 4,
        CONNECTED: 5,
        DISCONNECTED: 6,
        DISCONNECTING: 7,
        ATTACHED: 8
    },

    /** Constants: Log Level Constants
     *  Logging level indicators.
     *
     *  LogLevel.DEBUG - Debug output
     *  LogLevel.INFO - Informational output
     *  LogLevel.WARN - Warnings
     *  LogLevel.ERROR - Errors
     *  LogLevel.FATAL - Fatal errors
     */
    LogLevel: {
        DEBUG: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3,
        FATAL: 4
    },

    /** PrivateConstants: DOM Element Type Constants
     *  DOM element types.
     *
     *  ElementType.NORMAL - Normal element.
     *  ElementType.TEXT - Text data element.
     */
    ElementType: {
        NORMAL: 1,
        TEXT: 3,
        CDATA: 4
    },

    /** PrivateConstants: Timeout Values
     *  Timeout values for error states.  These values are in seconds.
     *  These should not be changed unless you know exactly what you are
     *  doing.
     *
     *  TIMEOUT - Timeout multiplier. A waiting request will be considered
     *      failed after Math.floor(TIMEOUT * wait) seconds have elapsed.
     *      This defaults to 1.1, and with default wait, 66 seconds.
     *  SECONDARY_TIMEOUT - Secondary timeout multiplier. In cases where
     *      Strophe can detect early failure, it will consider the request
     *      failed if it doesn't return after
     *      Math.floor(SECONDARY_TIMEOUT * wait) seconds have elapsed.
     *      This defaults to 0.1, and with default wait, 6 seconds.
     */
    TIMEOUT: 1.1,
    SECONDARY_TIMEOUT: 0.1,

    /** Function: forEachChild
     *  Map a function over some or all child elements of a given element.
     *
     *  This is a small convenience function for mapping a function over
     *  some or all of the children of an element.  If elemName is null, all
     *  children will be passed to the function, otherwise only children
     *  whose tag names match elemName will be passed.
     *
     *  Parameters:
     *    (XMLElement) elem - The element to operate on.
     *    (String) elemName - The child element tag name filter.
     *    (Function) func - The function to apply to each child.  This
     *      function should take a single argument, a DOM element.
     */
    forEachChild: function (elem, elemName, func)
    {
        var i, childNode;

        for (i = 0; i < elem.childNodes.length; i++) {
            childNode = elem.childNodes[i];
            if (childNode.nodeType == Strophe.ElementType.NORMAL &&
                (!elemName || this.isTagEqual(childNode, elemName))) {
                func(childNode);
            }
        }
    },

    /** Function: isTagEqual
     *  Compare an element's tag name with a string.
     *
     *  This function is case insensitive.
     *
     *  Parameters:
     *    (XMLElement) el - A DOM element.
     *    (String) name - The element name.
     *
     *  Returns:
     *    true if the element's tag name matches _el_, and false
     *    otherwise.
     */
    isTagEqual: function (el, name)
    {
        return el.tagName.toLowerCase() == name.toLowerCase();
    },

    /** PrivateVariable: _xmlGenerator
     *  _Private_ variable that caches a DOM document to
     *  generate elements.
     */
    _xmlGenerator: null,

    /** PrivateFunction: _makeGenerator
     *  _Private_ function that creates a dummy XML DOM document to serve as
     *  an element and text node generator.
     */
    _makeGenerator: function () {
        var doc;

        if (document.implementation.createDocument === undefined) {
            doc = this._getIEXmlDom();
            doc.appendChild(doc.createElement('strophe'));
        } else {
            doc = document.implementation
                .createDocument('jabber:client', 'strophe', null);
        }

        return doc;
    },

    /** Function: xmlGenerator
     *  Get the DOM document to generate elements.
     *
     *  Returns:
     *    The currently used DOM document.
     */
    xmlGenerator: function () {
        if (!Strophe._xmlGenerator) {
            Strophe._xmlGenerator = Strophe._makeGenerator();
        }
        return Strophe._xmlGenerator;
    },

    /** PrivateFunction: _getIEXmlDom
     *  Gets IE xml doc object
     *
     *  Returns:
     *    A Microsoft XML DOM Object
     *  See Also:
     *    http://msdn.microsoft.com/en-us/library/ms757837%28VS.85%29.aspx
     */
    _getIEXmlDom : function() {
        var doc = null;
        var docStrings = [
            "Msxml2.DOMDocument.6.0",
            "Msxml2.DOMDocument.5.0",
            "Msxml2.DOMDocument.4.0",
            "MSXML2.DOMDocument.3.0",
            "MSXML2.DOMDocument",
            "MSXML.DOMDocument",
            "Microsoft.XMLDOM"
        ];

        for (var d = 0; d < docStrings.length; d++) {
            if (doc === null) {
                try {
                    doc = new ActiveXObject(docStrings[d]);
                } catch (e) {
                    doc = null;
                }
            } else {
                break;
            }
        }

        return doc;
    },

    /** Function: xmlElement
     *  Create an XML DOM element.
     *
     *  This function creates an XML DOM element correctly across all
     *  implementations. Note that these are not HTML DOM elements, which
     *  aren't appropriate for XMPP stanzas.
     *
     *  Parameters:
     *    (String) name - The name for the element.
     *    (Array|Object) attrs - An optional array or object containing
     *      key/value pairs to use as element attributes. The object should
     *      be in the format {'key': 'value'} or {key: 'value'}. The array
     *      should have the format [['key1', 'value1'], ['key2', 'value2']].
     *    (String) text - The text child data for the element.
     *
     *  Returns:
     *    A new XML DOM element.
     */
    xmlElement: function (name)
    {
        if (!name) { return null; }

        var node = Strophe.xmlGenerator().createElement(name);

        // FIXME: this should throw errors if args are the wrong type or
        // there are more than two optional args
        var a, i, k;
        for (a = 1; a < arguments.length; a++) {
            if (!arguments[a]) { continue; }
            if (typeof(arguments[a]) == "string" ||
                typeof(arguments[a]) == "number") {
                node.appendChild(Strophe.xmlTextNode(arguments[a]));
            } else if (typeof(arguments[a]) == "object" &&
                       typeof(arguments[a].sort) == "function") {
                for (i = 0; i < arguments[a].length; i++) {
                    if (typeof(arguments[a][i]) == "object" &&
                        typeof(arguments[a][i].sort) == "function") {
                        node.setAttribute(arguments[a][i][0],
                                          arguments[a][i][1]);
                    }
                }
            } else if (typeof(arguments[a]) == "object") {
                for (k in arguments[a]) {
                    if (arguments[a].hasOwnProperty(k)) {
                        node.setAttribute(k, arguments[a][k]);
                    }
                }
            }
        }

        return node;
    },

    /*  Function: xmlescape
     *  Excapes invalid xml characters.
     *
     *  Parameters:
     *     (String) text - text to escape.
     *
     *	Returns:
     *      Escaped text.
     */
    xmlescape: function(text)
    {
        text = text.replace(/\&/g, "&amp;");
        text = text.replace(/</g,  "&lt;");
        text = text.replace(/>/g,  "&gt;");
        text = text.replace(/'/g,  "&apos;");
        text = text.replace(/"/g,  "&quot;");
        return text;
    },

    /** Function: xmlTextNode
     *  Creates an XML DOM text node.
     *
     *  Provides a cross implementation version of document.createTextNode.
     *
     *  Parameters:
     *    (String) text - The content of the text node.
     *
     *  Returns:
     *    A new XML DOM text node.
     */
    xmlTextNode: function (text)
    {
	//ensure text is escaped
	text = Strophe.xmlescape(text);

        return Strophe.xmlGenerator().createTextNode(text);
    },

    /** Function: getText
     *  Get the concatenation of all text children of an element.
     *
     *  Parameters:
     *    (XMLElement) elem - A DOM element.
     *
     *  Returns:
     *    A String with the concatenated text of all text element children.
     */
    getText: function (elem)
    {
        if (!elem) { return null; }

        var str = "";
        if (elem.childNodes.length === 0 && elem.nodeType ==
            Strophe.ElementType.TEXT) {
            str += elem.nodeValue;
        }

        for (var i = 0; i < elem.childNodes.length; i++) {
            if (elem.childNodes[i].nodeType == Strophe.ElementType.TEXT) {
                str += elem.childNodes[i].nodeValue;
            }
        }

        return str;
    },

    /** Function: copyElement
     *  Copy an XML DOM element.
     *
     *  This function copies a DOM element and all its descendants and returns
     *  the new copy.
     *
     *  Parameters:
     *    (XMLElement) elem - A DOM element.
     *
     *  Returns:
     *    A new, copied DOM element tree.
     */
    copyElement: function (elem)
    {
        var i, el;
        if (elem.nodeType == Strophe.ElementType.NORMAL) {
            el = Strophe.xmlElement(elem.tagName);

            for (i = 0; i < elem.attributes.length; i++) {
                el.setAttribute(elem.attributes[i].nodeName.toLowerCase(),
                                elem.attributes[i].value);
            }

            for (i = 0; i < elem.childNodes.length; i++) {
                el.appendChild(Strophe.copyElement(elem.childNodes[i]));
            }
        } else if (elem.nodeType == Strophe.ElementType.TEXT) {
            el = Strophe.xmlGenerator().createTextNode(elem.nodeValue);
        }

        return el;
    },

    /** Function: escapeNode
     *  Escape the node part (also called local part) of a JID.
     *
     *  Parameters:
     *    (String) node - A node (or local part).
     *
     *  Returns:
     *    An escaped node (or local part).
     */
    escapeNode: function (node)
    {
        return node.replace(/^\s+|\s+$/g, '')
            .replace(/\\/g,  "\\5c")
            .replace(/ /g,   "\\20")
            .replace(/\"/g,  "\\22")
            .replace(/\&/g,  "\\26")
            .replace(/\'/g,  "\\27")
            .replace(/\//g,  "\\2f")
            .replace(/:/g,   "\\3a")
            .replace(/</g,   "\\3c")
            .replace(/>/g,   "\\3e")
            .replace(/@/g,   "\\40");
    },

    /** Function: unescapeNode
     *  Unescape a node part (also called local part) of a JID.
     *
     *  Parameters:
     *    (String) node - A node (or local part).
     *
     *  Returns:
     *    An unescaped node (or local part).
     */
    unescapeNode: function (node)
    {
        return node.replace(/\\20/g, " ")
            .replace(/\\22/g, '"')
            .replace(/\\26/g, "&")
            .replace(/\\27/g, "'")
            .replace(/\\2f/g, "/")
            .replace(/\\3a/g, ":")
            .replace(/\\3c/g, "<")
            .replace(/\\3e/g, ">")
            .replace(/\\40/g, "@")
            .replace(/\\5c/g, "\\");
    },

    /** Function: getNodeFromJid
     *  Get the node portion of a JID String.
     *
     *  Parameters:
     *    (String) jid - A JID.
     *
     *  Returns:
     *    A String containing the node.
     */
    getNodeFromJid: function (jid)
    {
        if (jid.indexOf("@") < 0) { return null; }
        return jid.split("@")[0];
    },

    /** Function: getDomainFromJid
     *  Get the domain portion of a JID String.
     *
     *  Parameters:
     *    (String) jid - A JID.
     *
     *  Returns:
     *    A String containing the domain.
     */
    getDomainFromJid: function (jid)
    {
        var bare = Strophe.getBareJidFromJid(jid);
        if (bare.indexOf("@") < 0) {
            return bare;
        } else {
            var parts = bare.split("@");
            parts.splice(0, 1);
            return parts.join('@');
        }
    },

    /** Function: getResourceFromJid
     *  Get the resource portion of a JID String.
     *
     *  Parameters:
     *    (String) jid - A JID.
     *
     *  Returns:
     *    A String containing the resource.
     */
    getResourceFromJid: function (jid)
    {
        var s = jid.split("/");
        if (s.length < 2) { return null; }
        s.splice(0, 1);
        return s.join('/');
    },

    /** Function: getBareJidFromJid
     *  Get the bare JID from a JID String.
     *
     *  Parameters:
     *    (String) jid - A JID.
     *
     *  Returns:
     *    A String containing the bare JID.
     */
    getBareJidFromJid: function (jid)
    {
        return jid ? jid.split("/")[0] : null;
    },

    /** Function: log
     *  User overrideable logging function.
     *
     *  This function is called whenever the Strophe library calls any
     *  of the logging functions.  The default implementation of this
     *  function does nothing.  If client code wishes to handle the logging
     *  messages, it should override this with
     *  > Strophe.log = function (level, msg) {
     *  >   (user code here)
     *  > };
     *
     *  Please note that data sent and received over the wire is logged
     *  via Strophe.Connection.rawInput() and Strophe.Connection.rawOutput().
     *
     *  The different levels and their meanings are
     *
     *    DEBUG - Messages useful for debugging purposes.
     *    INFO - Informational messages.  This is mostly information like
     *      'disconnect was called' or 'SASL auth succeeded'.
     *    WARN - Warnings about potential problems.  This is mostly used
     *      to report transient connection errors like request timeouts.
     *    ERROR - Some error occurred.
     *    FATAL - A non-recoverable fatal error occurred.
     *
     *  Parameters:
     *    (Integer) level - The log level of the log message.  This will
     *      be one of the values in Strophe.LogLevel.
     *    (String) msg - The log message.
     */
    log: function (level, msg)
    {
        return;
    },

    /** Function: debug
     *  Log a message at the Strophe.LogLevel.DEBUG level.
     *
     *  Parameters:
     *    (String) msg - The log message.
     */
    debug: function(msg)
    {
        this.log(this.LogLevel.DEBUG, msg);
    },

    /** Function: info
     *  Log a message at the Strophe.LogLevel.INFO level.
     *
     *  Parameters:
     *    (String) msg - The log message.
     */
    info: function (msg)
    {
        this.log(this.LogLevel.INFO, msg);
    },

    /** Function: warn
     *  Log a message at the Strophe.LogLevel.WARN level.
     *
     *  Parameters:
     *    (String) msg - The log message.
     */
    warn: function (msg)
    {
        this.log(this.LogLevel.WARN, msg);
    },

    /** Function: error
     *  Log a message at the Strophe.LogLevel.ERROR level.
     *
     *  Parameters:
     *    (String) msg - The log message.
     */
    error: function (msg)
    {
        this.log(this.LogLevel.ERROR, msg);
    },

    /** Function: fatal
     *  Log a message at the Strophe.LogLevel.FATAL level.
     *
     *  Parameters:
     *    (String) msg - The log message.
     */
    fatal: function (msg)
    {
        this.log(this.LogLevel.FATAL, msg);
    },

    /** Function: serialize
     *  Render a DOM element and all descendants to a String.
     *
     *  Parameters:
     *    (XMLElement) elem - A DOM element.
     *
     *  Returns:
     *    The serialized element tree as a String.
     */
    serialize: function (elem)
    {
        var result;

        if (!elem) { return null; }

        if (typeof(elem.tree) === "function") {
            elem = elem.tree();
        }

        var nodeName = elem.nodeName;
        var i, child;

        if (elem.getAttribute("_realname")) {
            nodeName = elem.getAttribute("_realname");
        }

        result = "<" + nodeName;
        for (i = 0; i < elem.attributes.length; i++) {
               if(elem.attributes[i].nodeName != "_realname") {
                 result += " " + elem.attributes[i].nodeName.toLowerCase() +
                "='" + elem.attributes[i].value
                    .replace(/&/g, "&amp;")
                       .replace(/\'/g, "&apos;")
                       .replace(/</g, "&lt;") + "'";
               }
        }

        if (elem.childNodes.length > 0) {
            result += ">";
            for (i = 0; i < elem.childNodes.length; i++) {
                child = elem.childNodes[i];
                switch( child.nodeType ){
                  case Strophe.ElementType.NORMAL:
                    // normal element, so recurse
                    result += Strophe.serialize(child);
                    break;
                  case Strophe.ElementType.TEXT:
                    // text element to escape values
                    result += child.nodeValue;
                    break;
                  case Strophe.ElementType.CDATA:
                    // cdata section so don't escape values
                    result += "<![CDATA["+child.nodeValue+"]]>";
                }
            }
            result += "</" + nodeName + ">";
        } else {
            result += "/>";
        }

        return result;
    },

    /** PrivateVariable: _requestId
     *  _Private_ variable that keeps track of the request ids for
     *  connections.
     */
    _requestId: 0,

    /** PrivateVariable: Strophe.connectionPlugins
     *  _Private_ variable Used to store plugin names that need
     *  initialization on Strophe.Connection construction.
     */
    _connectionPlugins: {},

    /** Function: addConnectionPlugin
     *  Extends the Strophe.Connection object with the given plugin.
     *
     *  Parameters:
     *    (String) name - The name of the extension.
     *    (Object) ptype - The plugin's prototype.
     */
    addConnectionPlugin: function (name, ptype)
    {
        Strophe._connectionPlugins[name] = ptype;
    }
};

/** Class: Strophe.Builder
 *  XML DOM builder.
 *
 *  This object provides an interface similar to JQuery but for building
 *  DOM element easily and rapidly.  All the functions except for toString()
 *  and tree() return the object, so calls can be chained.  Here's an
 *  example using the $iq() builder helper.
 *  > $iq({to: 'you', from: 'me', type: 'get', id: '1'})
 *  >     .c('query', {xmlns: 'strophe:example'})
 *  >     .c('example')
 *  >     .toString()
 *  The above generates this XML fragment
 *  > <iq to='you' from='me' type='get' id='1'>
 *  >   <query xmlns='strophe:example'>
 *  >     <example/>
 *  >   </query>
 *  > </iq>
 *  The corresponding DOM manipulations to get a similar fragment would be
 *  a lot more tedious and probably involve several helper variables.
 *
 *  Since adding children makes new operations operate on the child, up()
 *  is provided to traverse up the tree.  To add two children, do
 *  > builder.c('child1', ...).up().c('child2', ...)
 *  The next operation on the Builder will be relative to the second child.
 */

/** Constructor: Strophe.Builder
 *  Create a Strophe.Builder object.
 *
 *  The attributes should be passed in object notation.  For example
 *  > var b = new Builder('message', {to: 'you', from: 'me'});
 *  or
 *  > var b = new Builder('messsage', {'xml:lang': 'en'});
 *
 *  Parameters:
 *    (String) name - The name of the root element.
 *    (Object) attrs - The attributes for the root element in object notation.
 *
 *  Returns:
 *    A new Strophe.Builder.
 */
Strophe.Builder = function (name, attrs)
{
    // Set correct namespace for jabber:client elements
    if (name == "presence" || name == "message" || name == "iq") {
        if (attrs && !attrs.xmlns) {
            attrs.xmlns = Strophe.NS.CLIENT;
        } else if (!attrs) {
            attrs = {xmlns: Strophe.NS.CLIENT};
        }
    }

    // Holds the tree being built.
    this.nodeTree = Strophe.xmlElement(name, attrs);

    // Points to the current operation node.
    this.node = this.nodeTree;
};

Strophe.Builder.prototype = {
    /** Function: tree
     *  Return the DOM tree.
     *
     *  This function returns the current DOM tree as an element object.  This
     *  is suitable for passing to functions like Strophe.Connection.send().
     *
     *  Returns:
     *    The DOM tree as a element object.
     */
    tree: function ()
    {
        return this.nodeTree;
    },

    /** Function: toString
     *  Serialize the DOM tree to a String.
     *
     *  This function returns a string serialization of the current DOM
     *  tree.  It is often used internally to pass data to a
     *  Strophe.Request object.
     *
     *  Returns:
     *    The serialized DOM tree in a String.
     */
    toString: function ()
    {
        return Strophe.serialize(this.nodeTree);
    },

    /** Function: up
     *  Make the current parent element the new current element.
     *
     *  This function is often used after c() to traverse back up the tree.
     *  For example, to add two children to the same element
     *  > builder.c('child1', {}).up().c('child2', {});
     *
     *  Returns:
     *    The Stophe.Builder object.
     */
    up: function ()
    {
        this.node = this.node.parentNode;
        return this;
    },

    /** Function: attrs
     *  Add or modify attributes of the current element.
     *
     *  The attributes should be passed in object notation.  This function
     *  does not move the current element pointer.
     *
     *  Parameters:
     *    (Object) moreattrs - The attributes to add/modify in object notation.
     *
     *  Returns:
     *    The Strophe.Builder object.
     */
    attrs: function (moreattrs)
    {
        for (var k in moreattrs) {
            if (moreattrs.hasOwnProperty(k)) {
                this.node.setAttribute(k, moreattrs[k]);
            }
        }
        return this;
    },

    /** Function: c
     *  Add a child to the current element and make it the new current
     *  element.
     *
     *  This function moves the current element pointer to the child,
     *  unless text is provided.  If you need to add another child, it
     *  is necessary to use up() to go back to the parent in the tree.
     *
     *  Parameters:
     *    (String) name - The name of the child.
     *    (Object) attrs - The attributes of the child in object notation.
     *    (String) text - The text to add to the child.
     *
     *  Returns:
     *    The Strophe.Builder object.
     */
    c: function (name, attrs, text)
    {
        var child = Strophe.xmlElement(name, attrs, text);
        this.node.appendChild(child);
        if (!text) {
            this.node = child;
        }
        return this;
    },

    /** Function: cnode
     *  Add a child to the current element and make it the new current
     *  element.
     *
     *  This function is the same as c() except that instead of using a
     *  name and an attributes object to create the child it uses an
     *  existing DOM element object.
     *
     *  Parameters:
     *    (XMLElement) elem - A DOM element.
     *
     *  Returns:
     *    The Strophe.Builder object.
     */
    cnode: function (elem)
    {
        var xmlGen = Strophe.xmlGenerator();
        try {
            var impNode = (xmlGen.importNode !== undefined);
        }
        catch (e) {
            var impNode = false;
        }
        var newElem = impNode ?
                      xmlGen.importNode(elem, true) :
                      Strophe.copyElement(elem);
        this.node.appendChild(newElem);
        this.node = newElem;
        return this;
    },

    /** Function: t
     *  Add a child text element.
     *
     *  This *does not* make the child the new current element since there
     *  are no children of text elements.
     *
     *  Parameters:
     *    (String) text - The text data to append to the current element.
     *
     *  Returns:
     *    The Strophe.Builder object.
     */
    t: function (text)
    {
        var child = Strophe.xmlTextNode(text);
        this.node.appendChild(child);
        return this;
    }
};


/** PrivateClass: Strophe.Handler
 *  _Private_ helper class for managing stanza handlers.
 *
 *  A Strophe.Handler encapsulates a user provided callback function to be
 *  executed when matching stanzas are received by the connection.
 *  Handlers can be either one-off or persistant depending on their
 *  return value. Returning true will cause a Handler to remain active, and
 *  returning false will remove the Handler.
 *
 *  Users will not use Strophe.Handler objects directly, but instead they
 *  will use Strophe.Connection.addHandler() and
 *  Strophe.Connection.deleteHandler().
 */

/** PrivateConstructor: Strophe.Handler
 *  Create and initialize a new Strophe.Handler.
 *
 *  Parameters:
 *    (Function) handler - A function to be executed when the handler is run.
 *    (String) ns - The namespace to match.
 *    (String) name - The element name to match.
 *    (String) type - The element type to match.
 *    (String) id - The element id attribute to match.
 *    (String) from - The element from attribute to match.
 *    (Object) options - Handler options
 *
 *  Returns:
 *    A new Strophe.Handler object.
 */
Strophe.Handler = function (handler, ns, name, type, id, from, options)
{
    this.handler = handler;
    this.ns = ns;
    this.name = name;
    this.type = type;
    this.id = id;
    this.options = options || {matchbare: false};

    // default matchBare to false if undefined
    if (!this.options.matchBare) {
        this.options.matchBare = false;
    }

    if (this.options.matchBare) {
        this.from = from ? Strophe.getBareJidFromJid(from) : null;
    } else {
        this.from = from;
    }

    // whether the handler is a user handler or a system handler
    this.user = true;
};

Strophe.Handler.prototype = {
    /** PrivateFunction: isMatch
     *  Tests if a stanza matches the Strophe.Handler.
     *
     *  Parameters:
     *    (XMLElement) elem - The XML element to test.
     *
     *  Returns:
     *    true if the stanza matches and false otherwise.
     */
    isMatch: function (elem)
    {
        var nsMatch;
        var from = null;

        if (this.options.matchBare) {
            from = Strophe.getBareJidFromJid(elem.getAttribute('from'));
        } else {
            from = elem.getAttribute('from');
        }

        nsMatch = false;
        if (!this.ns) {
            nsMatch = true;
        } else {
            var that = this;
            Strophe.forEachChild(elem, null, function (elem) {
                if (elem.getAttribute("xmlns") == that.ns) {
                    nsMatch = true;
                }
            });

            nsMatch = nsMatch || elem.getAttribute("xmlns") == this.ns;
        }

        if (nsMatch &&
            (!this.name || Strophe.isTagEqual(elem, this.name)) &&
            (!this.type || elem.getAttribute("type") == this.type) &&
            (!this.id || elem.getAttribute("id") == this.id) &&
            (!this.from || from == this.from)) {
                return true;
        }

        return false;
    },

    /** PrivateFunction: run
     *  Run the callback on a matching stanza.
     *
     *  Parameters:
     *    (XMLElement) elem - The DOM element that triggered the
     *      Strophe.Handler.
     *
     *  Returns:
     *    A boolean indicating if the handler should remain active.
     */
    run: function (elem)
    {
        var result = null;
        try {
            result = this.handler(elem);
        } catch (e) {
            if (e.sourceURL) {
                Strophe.fatal("error: " + this.handler +
                              " " + e.sourceURL + ":" +
                              e.line + " - " + e.name + ": " + e.message);
            } else if (e.fileName) {
                if (typeof(console) != "undefined") {
                    console.trace();
                    console.error(this.handler, " - error - ", e, e.message);
                }
                Strophe.fatal("error: " + this.handler + " " +
                              e.fileName + ":" + e.lineNumber + " - " +
                              e.name + ": " + e.message);
            } else {
                Strophe.fatal("error: " + this.handler);
            }

            throw e;
        }

        return result;
    },

    /** PrivateFunction: toString
     *  Get a String representation of the Strophe.Handler object.
     *
     *  Returns:
     *    A String.
     */
    toString: function ()
    {
        return "{Handler: " + this.handler + "(" + this.name + "," +
            this.id + "," + this.ns + ")}";
    }
};

/** PrivateClass: Strophe.TimedHandler
 *  _Private_ helper class for managing timed handlers.
 *
 *  A Strophe.TimedHandler encapsulates a user provided callback that
 *  should be called after a certain period of time or at regular
 *  intervals.  The return value of the callback determines whether the
 *  Strophe.TimedHandler will continue to fire.
 *
 *  Users will not use Strophe.TimedHandler objects directly, but instead
 *  they will use Strophe.Connection.addTimedHandler() and
 *  Strophe.Connection.deleteTimedHandler().
 */

/** PrivateConstructor: Strophe.TimedHandler
 *  Create and initialize a new Strophe.TimedHandler object.
 *
 *  Parameters:
 *    (Integer) period - The number of milliseconds to wait before the
 *      handler is called.
 *    (Function) handler - The callback to run when the handler fires.  This
 *      function should take no arguments.
 *
 *  Returns:
 *    A new Strophe.TimedHandler object.
 */
Strophe.TimedHandler = function (period, handler)
{
    this.period = period;
    this.handler = handler;

    this.lastCalled = new Date().getTime();
    this.user = true;
};

Strophe.TimedHandler.prototype = {
    /** PrivateFunction: run
     *  Run the callback for the Strophe.TimedHandler.
     *
     *  Returns:
     *    true if the Strophe.TimedHandler should be called again, and false
     *      otherwise.
     */
    run: function ()
    {
        this.lastCalled = new Date().getTime();
        return this.handler();
    },

    /** PrivateFunction: reset
     *  Reset the last called time for the Strophe.TimedHandler.
     */
    reset: function ()
    {
        this.lastCalled = new Date().getTime();
    },

    /** PrivateFunction: toString
     *  Get a string representation of the Strophe.TimedHandler object.
     *
     *  Returns:
     *    The string representation.
     */
    toString: function ()
    {
        return "{TimedHandler: " + this.handler + "(" + this.period +")}";
    }
};

/** PrivateClass: Strophe.Request
 *  _Private_ helper class that provides a cross implementation abstraction
 *  for a BOSH related XMLHttpRequest.
 *
 *  The Strophe.Request class is used internally to encapsulate BOSH request
 *  information.  It is not meant to be used from user's code.
 */

/** PrivateConstructor: Strophe.Request
 *  Create and initialize a new Strophe.Request object.
 *
 *  Parameters:
 *    (XMLElement) elem - The XML data to be sent in the request.
 *    (Function) func - The function that will be called when the
 *      XMLHttpRequest readyState changes.
 *    (Integer) rid - The BOSH rid attribute associated with this request.
 *    (Integer) sends - The number of times this same request has been
 *      sent.
 */
Strophe.Request = function (elem, func, rid, sends)
{
    this.id = ++Strophe._requestId;
    this.xmlData = elem;
    this.data = Strophe.serialize(elem);
    // save original function in case we need to make a new request
    // from this one.
    this.origFunc = func;
    this.func = func;
    this.rid = rid;
    this.date = NaN;
    this.sends = sends || 0;
    this.abort = false;
    this.dead = null;
    this.age = function () {
        if (!this.date) { return 0; }
        var now = new Date();
        return (now - this.date) / 1000;
    };
    this.timeDead = function () {
        if (!this.dead) { return 0; }
        var now = new Date();
        return (now - this.dead) / 1000;
    };
    this.xhr = this._newXHR();
};

Strophe.Request.prototype = {
    /** PrivateFunction: getResponse
     *  Get a response from the underlying XMLHttpRequest.
     *
     *  This function attempts to get a response from the request and checks
     *  for errors.
     *
     *  Throws:
     *    "parsererror" - A parser error occured.
     *
     *  Returns:
     *    The DOM element tree of the response.
     */
    getResponse: function ()
    {
        var node = null;
        if (this.xhr.responseXML && this.xhr.responseXML.documentElement) {
            node = this.xhr.responseXML.documentElement;
            if (node.tagName == "parsererror") {
                Strophe.error("invalid response received");
                Strophe.error("responseText: " + this.xhr.responseText);
                Strophe.error("responseXML: " +
                              Strophe.serialize(this.xhr.responseXML));
                throw "parsererror";
            }
        } else if (this.xhr.responseText) {
            Strophe.error("invalid response received");
            Strophe.error("responseText: " + this.xhr.responseText);
            Strophe.error("responseXML: " +
                          Strophe.serialize(this.xhr.responseXML));
        }

        return node;
    },

    /** PrivateFunction: _newXHR
     *  _Private_ helper function to create XMLHttpRequests.
     *
     *  This function creates XMLHttpRequests across all implementations.
     *
     *  Returns:
     *    A new XMLHttpRequest.
     */
    _newXHR: function ()
    {
        var xhr = null;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
            if (xhr.overrideMimeType) {
                xhr.overrideMimeType("text/xml");
            }
        } else if (window.ActiveXObject) {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        // use Function.bind() to prepend ourselves as an argument
        xhr.onreadystatechange = this.func.bind(null, this);

        return xhr;
    }
};


if (callback) {
    callback(Strophe, $build, $msg, $iq, $pres);
}

})(function () {
    window.Strophe = arguments[0];
    window.$build = arguments[1];
    window.$msg = arguments[2];
    window.$iq = arguments[3];
    window.$pres = arguments[4];
});
/*
Plugin to implement the MUC extension. http://xmpp.org/extensions/xep-0045.html
*/
/* jslint configuration: */
/* global document, window, setTimeout, clearTimeout, console,
    XMLHttpRequest, ActiveXObject,
    Base64, MD5,
    Strophe, $build, $msg, $iq, $pres 
*/

Strophe.addConnectionPlugin('muc', {
    _connection: null,
    // The plugin must have the init function
    /***Function
    Initialize the MUC plugin. Sets the correct connection object and
    extends the namesace.
    */
    init: function(conn) {
        this._connection = conn;
        /* extend name space 
         *  NS.MUC - XMPP Multi-user chat namespace
         *              from XEP 45.  
         *
         */
        Strophe.addNamespace('MUC_OWNER', Strophe.NS.MUC+"#owner");
        Strophe.addNamespace('MUC_ADMIN', Strophe.NS.MUC+"#admin");
    },
    /***Function
    Join a multi-user chat room
    Parameters:
    (String) room - The multi-user chat room to join.
    (String) nick - The nickname to use in the chat room. Optional
    (Function) msg_handler_cb - The function call to handle messages from the
    specified chat room.
    (Function) pres_handler_cb - The function call back to handle presence
    in the chat room.
    (String) password - The optional password to use. (password protected
    rooms only)
    */
    join: function(room, nick, msg_handler_cb, pres_handler_cb, password) {
        var room_nick = this.test_append_nick(room, nick);        
        var msg = $pres({from: this._connection.jid,
                         to: room_nick})
            .c("x",{xmlns: Strophe.NS.MUC});
        if (password)
        {
            var password_elem = Strophe.xmlElement("password", 
                                                   [],
                                                   password);
            msg.cnode(password_elem);
        }
        if (msg_handler_cb)
        {
            this._connection.addHandler(function(stanza) {
                var from = stanza.getAttribute('from');
                var roomname = from.split("/");
                // filter on room name
                if (roomname[0] == room)
                {
                    return msg_handler_cb(stanza);
                }
                else
                {
                    return true;
                }
            },
                                        null,
                                        "message",
                                        null,
                                        null,
                                        null);
        }
        if (pres_handler_cb)
        {
            this._connection.addHandler(function(stanza) {
                var xquery = stanza.getElementsByTagName("x");
                if (xquery.length > 0)
                {
                    //Handle only MUC user protocol
                    for (var i = 0; i < xquery.length; i++)
                    {
                        var xmlns = xquery[i].getAttribute("xmlns");
                        
                        if (xmlns && xmlns.match(Strophe.NS.MUC))
                        {
                            return pres_handler_cb(stanza);
                        }
                    }
                }
                return true;                
            },
                                        null,
                                        "presence",
                                        null,
                                        null,
                                        null);
        }
        this._connection.send(msg);
    },
    /***Function
    Leave a multi-user chat room
    Parameters:
    (String) room - The multi-user chat room to leave.
    (String) nick - The nick name used in the room.
    (Function) handler_cb - Optional function to handle the successful leave.
    Returns:
    iqid - The unique id for the room leave.
    */
    leave: function(room, nick, handler_cb) {
        var room_nick = this.test_append_nick(room, nick);        
        var presenceid = this._connection.getUniqueId();
        var presence = $pres({type: "unavailable",
                              id: presenceid,
                              from: this._connection.jid,
                              to: room_nick})
            .c("x",{xmlns: Strophe.NS.MUC});
        this._connection.addHandler(handler_cb,
                                    null,
                                    "presence",
                                    null,
                                    presenceid,
                                    null);
        this._connection.send(presence);
        return presenceid;
    },
    /***Function
    Parameters:
    (String) room - The multi-user chat room name.
    (String) nick - The nick name used in the chat room.
    (String) message - The message to send to the room.
    (String) type - "groupchat" for group chat messages or "chat" for private chat messages
    Returns:
    msgiq - the unique id used to send the message
    */
    message: function(room, nick, message, type) {
        var room_nick = this.test_append_nick(room, nick);        
        type = type || "groupchat";
        var msgid = this._connection.getUniqueId();
        var msg = $msg({to: room_nick,
                        from: this._connection.jid,
                        type: type,
                        id: msgid}).c("body",
                                      {xmlns: Strophe.NS.CLIENT}).t(message);
        msg.up().c("x", {xmlns: "jabber:x:event"}).c("composing");
        this._connection.send(msg);
        return msgid;
    },
    /***Function
    Start a room configuration.
    Parameters:
    (String) room - The multi-user chat room name.
    Returns:
    id - the unique id used to send the configuration request
    */
    configure: function(room) {
        //send iq to start room configuration
        var config = $iq({to:room,
                          type: "get"}).c("query",
                                          {xmlns: Strophe.NS.MUC_OWNER});
        var stanza = config.tree();
        return this._connection.sendIQ(stanza,
                               function(){},
                               function(){});
    },
    /***Function
    Cancel the room configuration
    Parameters:
    (String) room - The multi-user chat room name.
    Returns:
    id - the unique id used to cancel the configuration.
    */
    cancelConfigure: function(room) {
        //send iq to start room configuration
        var config = $iq({to: room,
                          type: "set"})
            .c("query", {xmlns: Strophe.NS.MUC_OWNER})
            .c("x", {xmlns: "jabber:x:data", type: "cancel"});
        var stanza = config.tree();
        return this._connection.sendIQ(stanza,
                                       function(){},
                                       function(){});
    },
    /***Function
    Save a room configuration.
    Parameters:
    (String) room - The multi-user chat room name.
    (Array) configarray - an array of form elements used to configure the room.
    Returns:
    id - the unique id used to save the configuration.
    */
    saveConfiguration: function(room, configarray) {
        var config = $iq({to: room,
                          type: "set"})
            .c("query", {xmlns: Strophe.NS.MUC_OWNER})
            .c("x", {xmlns: "jabber:x:data", type: "submit"});
        for (var i = 0; i < configarray.length; i++) {
            config.cnode(configarray[i]);
            config.up();
        }
        var stanza = config.tree();
        return this._connection.sendIQ(stanza,
                                       function(){},
                                       function(){});        
    },
    /***Function
    Parameters:
    (String) room - The multi-user chat room name.
    Returns:
    id - the unique id used to create the chat room.
    */
    createInstantRoom: function(room) {
        var roomiq = $iq({to: room,
                          type: "set"})
            .c("query", {xmlns: Strophe.NS.MUC_OWNER})
            .c("x", {xmlns: "jabber:x:data",
                     type: "submit"});
        return this._connection.sendIQ(roomiq.tree(),
                                       function() {},
                                       function() {});
    },
    /***
     Set the topic of the chat room.
     Parameters:
     (String) room - The multi-user chat room name.
     (String) topic - Topic message.
     */
    setTopic: function(room, topic) {
        var msg = $msg({to: room,
                        from: this._connection.jid,
                        type: "groupchat"})
            .c("subject", {xmlns: "jabber:client"}).t(topic);
        this._connection.send(msg.tree());
    },
    /***Function
    Changes the role and affiliation of a member of a MUC room.
    The modification can only be done by a room moderator. An error will be
    returned if the user doesn't have permission.
    Parameters:
    (String) room - The multi-user chat room name.
    (String) nick - The nick name of the user to modify.
    (String) role - The new role of the user.
    (String) affiliation - The new affiliation of the user.
    (String) reason - The reason for the change.
    Returns:
    iq - the id of the mode change request.
    */
    modifyUser: function(room, nick, role, affiliation, reason) {
        var item_attrs = {nick: Strophe.escapeNode(nick)};
        if (role !== null)
        {
            item_attrs.role = role;
        }
        if (affiliation !== null)
        {
            item_attrs.affiliation = affiliation;
        }
        var item = $build("item", item_attrs);
        if (reason !== null)
        {
            item.cnode(Strophe.xmlElement("reason", reason));
        }
        var roomiq = $iq({to: room,
                          type: "set"})
            .c("query", {xmlns: Strophe.NS.MUC_OWNER}).cnode(item.tree());
        return this._connection.sendIQ(roomiq.tree(),
                                       function() {},
                                       function() {});
    },
    /***Function
    Change the current users nick name.
    Parameters:
    (String) room - The multi-user chat room name.
    (String) user - The new nick name.
    */
    changeNick: function(room, user) {
        var room_nick = this.test_append_nick(room, user);
        var presence = $pres({from: this._connection.jid,
                              to: room_nick})
            .c("x",{xmlns: Strophe.NS.MUC});
        this._connection.send(presence.tree());
    },
    /***Function
    List all chat room available on a server.
    Parameters:
    (String) server - name of chat server.
    (String) handle_cb - Function to call for room list return.
    */
    listRooms: function(server, handle_cb) {
        var iq = $iq({to: server,
                      from: this._connection.jid,
                      type: "get"})
            .c("query",{xmlns: Strophe.NS.DISCO_ITEMS});        
        this._connection.sendIQ(iq, handle_cb, function(){});        
    },
    test_append_nick: function(room, nick) {
        var room_nick = room;
        if (nick) 
        {
            room_nick += "/" + Strophe.escapeNode(nick); 
        }
        return room_nick;
    }
});
/*
  mustache.js — Logic-less templates in JavaScript

  See http://mustache.github.com/ for more info.
*/

var Mustache = function() {
  var Renderer = function() {};

  Renderer.prototype = {
    otag: "{{",
    ctag: "}}",
    pragmas: {},
    buffer: [],
    pragmas_implemented: {
      "IMPLICIT-ITERATOR": true
    },
    context: {},

    render: function(template, context, partials, in_recursion) {
      // reset buffer & set context
      if(!in_recursion) {
        this.context = context;
        this.buffer = []; // TODO: make this non-lazy
      }

      // fail fast
      if(!this.includes("", template)) {
        if(in_recursion) {
          return template;
        } else {
          this.send(template);
          return;
        }
      }

      template = this.render_pragmas(template);
      var html = this.render_section(template, context, partials);
      if(in_recursion) {
        return this.render_tags(html, context, partials, in_recursion);
      }

      this.render_tags(html, context, partials, in_recursion);
    },

    /*
      Sends parsed lines
    */
    send: function(line) {
      if(line !== "") {
        this.buffer.push(line);
      }
    },

    /*
      Looks for %PRAGMAS
    */
    render_pragmas: function(template) {
      // no pragmas
      if(!this.includes("%", template)) {
        return template;
      }

      var that = this;
      var regex = new RegExp(this.otag + "%([\\w-]+) ?([\\w]+=[\\w]+)?" +
            this.ctag, "g");
      return template.replace(regex, function(match, pragma, options) {
        if(!that.pragmas_implemented[pragma]) {
          throw({message: 
            "This implementation of mustache doesn't understand the '" +
            pragma + "' pragma"});
        }
        that.pragmas[pragma] = {};
        if(options) {
          var opts = options.split("=");
          that.pragmas[pragma][opts[0]] = opts[1];
        }
        return "";
        // ignore unknown pragmas silently
      });
    },

    /*
      Tries to find a partial in the curent scope and render it
    */
    render_partial: function(name, context, partials) {
      name = this.trim(name);
      if(!partials || partials[name] === undefined) {
        throw({message: "unknown_partial '" + name + "'"});
      }
      if(typeof(context[name]) != "object") {
        return this.render(partials[name], context, partials, true);
      }
      return this.render(partials[name], context[name], partials, true);
    },

    /*
      Renders inverted (^) and normal (#) sections
    */
    render_section: function(template, context, partials) {
      if(!this.includes("#", template) && !this.includes("^", template)) {
        return template;
      }

      var that = this;
      // CSW - Added "+?" so it finds the tighest bound, not the widest
      var regex = new RegExp(this.otag + "(\\^|\\#)\\s*(.+)\\s*" + this.ctag +
              "\n*([\\s\\S]+?)" + this.otag + "\\/\\s*\\2\\s*" + this.ctag +
              "\\s*", "mg");

      // for each {{#foo}}{{/foo}} section do...
      return template.replace(regex, function(match, type, name, content) {
        var value = that.find(name, context);
        if(type == "^") { // inverted section
          if(!value || that.is_array(value) && value.length === 0) {
            // false or empty list, render it
            return that.render(content, context, partials, true);
          } else {
            return "";
          }
        } else if(type == "#") { // normal section
          if(that.is_array(value)) { // Enumerable, Let's loop!
            return that.map(value, function(row) {
              return that.render(content, that.create_context(row),
                partials, true);
            }).join("");
          } else if(that.is_object(value)) { // Object, Use it as subcontext!
            return that.render(content, that.create_context(value),
              partials, true);
          } else if(typeof value === "function") {
            // higher order section
            return value.call(context, content, function(text) {
              return that.render(text, context, partials, true);
            });
          } else if(value) { // boolean section
            return that.render(content, context, partials, true);
          } else {
            return "";
          }
        }
      });
    },

    /*
      Replace {{foo}} and friends with values from our view
    */
    render_tags: function(template, context, partials, in_recursion) {
      // tit for tat
      var that = this;

      var new_regex = function() {
        return new RegExp(that.otag + "(=|!|>|\\{|%)?([^\\/#\\^]+?)\\1?" +
          that.ctag + "+", "g");
      };

      var regex = new_regex();
      var tag_replace_callback = function(match, operator, name) {
        switch(operator) {
        case "!": // ignore comments
          return "";
        case "=": // set new delimiters, rebuild the replace regexp
          that.set_delimiters(name);
          regex = new_regex();
          return "";
        case ">": // render partial
          return that.render_partial(name, context, partials);
        case "{": // the triple mustache is unescaped
          return that.find(name, context);
        default: // escape the value
          return that.escape(that.find(name, context));
        }
      };
      var lines = template.split("\n");
      for(var i = 0; i < lines.length; i++) {
        lines[i] = lines[i].replace(regex, tag_replace_callback, this);
        if(!in_recursion) {
          this.send(lines[i]);
        }
      }

      if(in_recursion) {
        return lines.join("\n");
      }
    },

    set_delimiters: function(delimiters) {
      var dels = delimiters.split(" ");
      this.otag = this.escape_regex(dels[0]);
      this.ctag = this.escape_regex(dels[1]);
    },

    escape_regex: function(text) {
      // thank you Simon Willison
      if(!arguments.callee.sRE) {
        var specials = [
          '/', '.', '*', '+', '?', '|',
          '(', ')', '[', ']', '{', '}', '\\'
        ];
        arguments.callee.sRE = new RegExp(
          '(\\' + specials.join('|\\') + ')', 'g'
        );
      }
      return text.replace(arguments.callee.sRE, '\\$1');
    },

    /*
      find `name` in current `context`. That is find me a value
      from the view object
    */
    find: function(name, context) {
      name = this.trim(name);

      // Checks whether a value is thruthy or false or 0
      function is_kinda_truthy(bool) {
        return bool === false || bool === 0 || bool;
      }

      var value;
      if(is_kinda_truthy(context[name])) {
        value = context[name];
      } else if(is_kinda_truthy(this.context[name])) {
        value = this.context[name];
      }

      if(typeof value === "function") {
        return value.apply(context);
      }
      if(value !== undefined) {
        return value;
      }
      // silently ignore unkown variables
      return "";
    },

    // Utility methods

    /* includes tag */
    includes: function(needle, haystack) {
      return haystack.indexOf(this.otag + needle) != -1;
    },

    /*
      Does away with nasty characters
    */
    escape: function(s) {
      s = String(s === null ? "" : s);
      return s.replace(/&(?!\w+;)|["'<>\\]/g, function(s) {
        switch(s) {
        case "&": return "&amp;";
        case "\\": return "\\\\";
        case '"': return '&quot;';
        case "'": return '&#39;';
        case "<": return "&lt;";
        case ">": return "&gt;";
        default: return s;
        }
      });
    },

    // by @langalex, support for arrays of strings
    create_context: function(_context) {
      if(this.is_object(_context)) {
        return _context;
      } else {
        var iterator = ".";
        if(this.pragmas["IMPLICIT-ITERATOR"]) {
          iterator = this.pragmas["IMPLICIT-ITERATOR"].iterator;
        }
        var ctx = {};
        ctx[iterator] = _context;
        return ctx;
      }
    },

    is_object: function(a) {
      return a && typeof a == "object";
    },

    is_array: function(a) {
      return Object.prototype.toString.call(a) === '[object Array]';
    },

    /*
      Gets rid of leading and trailing whitespace
    */
    trim: function(s) {
      return s.replace(/^\s*|\s*$/g, "");
    },

    /*
      Why, why, why? Because IE. Cry, cry cry.
    */
    map: function(array, fn) {
      if (typeof array.map == "function") {
        return array.map(fn);
      } else {
        var r = [];
        var l = array.length;
        for(var i = 0; i < l; i++) {
          r.push(fn(array[i]));
        }
        return r;
      }
    }
  };

  return({
    name: "mustache.js",
    version: "0.3.1-dev",

    /*
      Turns a template and view into HTML
    */
    to_html: function(template, view, partials, send_fun) {
      var renderer = new Renderer();
      if(send_fun) {
        renderer.send = send_fun;
      }
      renderer.render(template, view, partials);
      if(!send_fun) {
        return renderer.buffer.join("\n");
      }
    }
  });
}();
/*
 * jQuery i18n plugin
 * @requires jQuery v1.1 or later
 *
 * See http://recursive-design.com/projects/jquery-i18n/
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Version: 0.9.2 (201111281039)
 */
 (function($) {
/**
 * i18n provides a mechanism for translating strings using a jscript dictionary.
 *
 */


/*
 * i18n property list
 */
$.i18n = {
	
	dict: null,
	
/**
 * setDictionary()
 * Initialise the dictionary and translate nodes
 *
 * @param property_list i18n_dict : The dictionary to use for translation
 */
	setDictionary: function(i18n_dict) {
		this.dict = i18n_dict;
	},
	
/**
 * _()
 * The actual translation function. Looks the given string up in the 
 * dictionary and returns the translation if one exists. If a translation 
 * is not found, returns the original word
 *
 * @param string str : The string to translate 
 * @param property_list params : params for using printf() on the string
 * @return string : Translated word
 *
 */
	_: function (str, params) {
		var transl = str;
		if (this.dict && this.dict[str]) {
			transl = this.dict[str];
		}
		return this.printf(transl, params);
	},
	
/**
 * toEntity()
 * Change non-ASCII characters to entity representation 
 *
 * @param string str : The string to transform
 * @return string result : Original string with non-ASCII content converted to entities
 *
 */
	toEntity: function (str) {
		var result = '';
		for (var i=0;i<str.length; i++) {
			if (str.charCodeAt(i) > 128)
				result += "&#"+str.charCodeAt(i)+";";
			else
				result += str.charAt(i);
		}
		return result;
	},
	
/**
 * stripStr()
 *
 * @param string str : The string to strip
 * @return string result : Stripped string
 *
 */
 	stripStr: function(str) {
		return str.replace(/^\s*/, "").replace(/\s*$/, "");
	},
	
/**
 * stripStrML()
 *
 * @param string str : The multi-line string to strip
 * @return string result : Stripped string
 *
 */
	stripStrML: function(str) {
		// Split because m flag doesn't exist before JS1.5 and we need to
		// strip newlines anyway
		var parts = str.split('\n');
		for (var i=0; i<parts.length; i++)
			parts[i] = stripStr(parts[i]);
	
		// Don't join with empty strings, because it "concats" words
		// And strip again
		return stripStr(parts.join(" "));
	},

/*
 * printf()
 * C-printf like function, which substitutes %s with parameters
 * given in list. %%s is used to escape %s.
 *
 * Doesn't work in IE5.0 (splice)
 *
 * @param string S : string to perform printf on.
 * @param string L : Array of arguments for printf()
 */
	printf: function(S, L) {
		if (!L) return S;

		var nS = "",
			search = /%(\d+)\$s/g;
		// replace %n1$ where n is a number
		while (result = search.exec(S)) {
			var index = parseInt(result[1], 10) -1;
			S = S.replace('%' + result[1] + '\$s', (L[index]));
			L.splice(index, 1);
		}
		var tS = S.split("%s");
		if (tS.length > 1) {
			for(var i = 0; i < L.length; i++) {
				if (tS[i].lastIndexOf('%') == tS[i].length-1 && i != L.length-1)
					tS[i] += "s"+tS.splice(i+1,1)[0];
				nS += tS[i] + L[i];
			}
		}
		return nS + tS[tS.length-1];
	}

};

/*
 * _t
 * Allows you to translate a jQuery selector
 *
 * eg $('h1')._t('some text')
 * 
 * @param string str : The string to translate 
 * @param property_list params : params for using printf() on the string
 * @return element : chained and translated element(s)
*/
$.fn._t = function(str, params) {
  return $(this).text($.i18n._(str, params));
};


})(jQuery);
/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 *
 * @link http://blog.stevenlevithan.com/archives/date-time-format
 */

var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};