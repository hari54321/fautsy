if (_coinzilla_fp_id_ === undefined) {
    localStorage.setItem('_coinzilla_fp_id_', coinzilla_fp_id);
    var _coinzilla_fp_id_ = coinzilla_fp_id;
}else
    localStorage.setItem('_coinzilla_fp_id_', _coinzilla_fp_id_);

if (_coinzilla_fp_interval_ === undefined) {
    localStorage.setItem('_coinzilla_fp_interval_', coinzilla_fp_interval);
    var _coinzilla_fp_interval_ = coinzilla_fp_interval;
}else
    localStorage.setItem('_coinzilla_fp_interval_', _coinzilla_fp_interval_);
(function (window) {
    'use strict';
    var
        userAgent = navigator.userAgent.toLowerCase(),
        thisUrl = window.location.href,
        referrerUrl = document.referrer,
        baseName = 'plug',
        counter = 0,
        cookieName = "_coinzilla_fp_",
        makeInterval = 1 , //minutes
        maxCap = 10, // base but overwritten
        keepCookie = 60*24, // minutes
        trafficType = 0,
        popType = 0,
        mobile = {
            true: /iphone|ipad|android|ucbrowser|iemobile|ipod|blackberry|bada/.test(userAgent)
        },
        browser = {
            win: /windows/.test(userAgent),
            mac: /macintosh/.test(userAgent),
            mobile: /iphone|ipad|ucbrowser|iemobile|ipod|blackberry|bada/.test(userAgent),
            android: /android/.test(userAgent),
            ios:  /iphone|ipad|ipod/.test(userAgent),
            webkit: /webkit/.test(userAgent),
            mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent),
            chrome: /chrome/.test(userAgent),
            msie: /msie|trident\//.test(userAgent) && !/opera/.test(userAgent),
            firefox: /firefox/.test(userAgent),
            safari: /safari/.test(userAgent) && !/chrome/.test(userAgent),
            opera: /opera/.test(userAgent),
            version: parseInt(userAgent.match(/(?:[^\s]+(?:ri|ox|me|ra)\/|trident\/.*?rv:)([\d]+)/i)[1], 10)
        },
        targetElement = null, // base but overwritten
        url = "https://czilladx.com/serve/go.php?webid="+_coinzilla_fp_id_+"&raw=10",
        parent = (top != self && typeof(top.document.location.toString()) === 'string') ? top : self,
        debug = false,
        action = {
            simulateClick: function (url) {
                var a = this.createElement('a', {href: url || 'data:text/html,<script>window.close();<\/script>'}),
                    event = new MouseEvent("click", {bubbles: true,cancelable: true,view: window,screenX:0,screenY:0,clientX:0,clientY:0,ctrlKey:false,shiftKey:false,altKey:false,metaKey:true,button:0,relatedTarget:null});
                document.body.appendChild(a);
                a.dispatchEvent(event);
                a.parentNode.removeChild(a);
            },
            blur: function(pop) {
                if (mobile.true) return;
                try {
                    if (browser.firefox) {
                        this.openCloseWindow(pop);
                    } else if (browser.webkit) {
                        if (!browser.chrome || (browser.chrome && browser.version < 41)) {
                            this.openCloseTab();
                        }
                    } else if (browser.msie) {
                        setTimeout(function() {
                            pop.blur();
                            pop.opener.window.focus();
                            window.self.window.focus();
                            window.focus();
                        }, 1000);
                    }
                    pop.blur();
                    pop.opener.window.focus();
                    window.self.window.focus();
                    window.focus();
                } catch (e) {
                    if(debug)
                        console.log(e.message);
                }
            },
            openCloseWindow: function() {
                var tmp = window.open('about:blank');
                tmp.focus();
                tmp.close();
                setTimeout(function() {
                    try {
                        tmp = window.open('about:blank');
                        tmp.focus();
                        tmp.close();
                    } catch (e) {}
                }, 1);
            },
            openCloseTab: function() {
                this.simulateClick();
            },
            attachEvent: function(event, callback, object) {
                var object = object || window;
                if (!object.addEventListener) {
                    return object.attachEvent('on' + event, callback);
                }
                return object.addEventListener(event, callback);
            },
            followLinks:function(event,object){
                event = event || window.event;
                var target = event.target || event.srcElement;
                while (target) {
                    if(browser.ios){
                        if(event.changedTouches.length > 1) {
                            event.preventDefault();
                            return false;
                        }
                    }
                    if (target instanceof HTMLAnchorElement) {
                        if(target.getAttribute('href') == "#")
                            return;
                        target.setAttribute("target", "_blank");
                        setTimeout(function() {
                            object.jobDone();
                            parent.document.location = object.url;
                        }, 300);
                        return true;
                    }
                    target = target.parentNode;
                }
                return false;
            },
            bind: function(args){
                var handler = args.function;
                var event = args.event;
                var target = args.target || window;
                if(mobile.true) {
                    if (target.addEventListener) {
                        return target.addEventListener("touchstart", handler, true);
                    }
                    else {
                        return target.attachEvent("touchstart", handler);
                    }
                }else{
                    if (target.addEventListener)
                        return target.addEventListener(event, handler, true);
                    else
                        return target.attachEvent("on" + event, handler);
                }
            },
            unBind: function(args){
                var handler = args.function;
                var event = args.event;
                var target = args.target || window;
                if(mobile.true) {
                    if (target.removeEventListener)
                        return target.removeEventListener("touchstart", handler, false);
                    else
                        return target.detachEvent("touchstart", handler);
                }else{
                    if (target.removeEventListener)
                        return target.removeEventListener(event, handler, false);
                    else
                        return target.detachEvent("on" + event, handler);
                }

            }
        },
        suite = {
            getCookie: function(name) {
                var cookieMatch = document.cookie.match(new RegExp(name + '=([^;]+)'));
                if(cookieMatch) {
                    return JSON.parse(decodeURIComponent(cookieMatch[1]));
                }else return null;
            },
            setCookie: function(name, value, minutes, path) {
                if (minutes === null || typeof minutes == 'undefined') {
                    minutes = null;
                } else {
                    var date;
                    if (typeof minutes == 'number') {
                        date = new Date();
                        date.setTime(date.getTime() + minutes * 60 * 1e3);
                    } else {
                        date = minutes;
                    }
                    minutes = '; expires=' + date.toUTCString();
                }
                document.cookie = name + '=' + encodeURIComponent(JSON.stringify(value)) + minutes + '; path=' + (path || '/');
            },
            isCookieEnabled: function(){
                return navigator.cookieEnabled;
            },
            isEmptyString : function (string) {
                return (
                    (typeof string == 'undefined')
                    ||
                    (string == null)
                    ||
                    (string == false)  //same as: !x
                    ||
                    (string.length == 0)
                    ||
                    (string == "")
                    ||
                    (string.replace(/\s/g,"") == "")
                    ||
                    (!/[^\s]/.test(string))
                    ||
                    (/^\s*$/.test(string))
                );
            }
        },
        call = function(args) {
            this.construct(args);
        };
    call.prototype = {
        __windowOptions : {
            'width'      : window.screen.width,
            'height'     : window.screen.height,
            'left'       : 0,
            'top'        : 0,
            'location'   : 1,
            'toolbar'    : 0,
            'statusbar'  : 1,
            'menubar'    : 0,
            'scrollbars' : 1,
            'resizable'  : 1
        },
        construct : function(args){
            var self = this;
            this.cap = 0;
            this.lastCall = null;
            this.index    = counter++;
            this.name     = baseName + '_' + (this.index);
            self.url = url;
            self.valid = false;
            var  _coinzilla_fp_interval_ = localStorage.getItem('_coinzilla_fp_interval_');
            var  _coinzilla_fp_id_ = localStorage.getItem('_coinzilla_fp_id_');
            if(_coinzilla_fp_id_ === undefined) {
                _coinzilla_fp_id_ = null;
                return;
            }
            var nounce = Math.floor(Math.random()*1000000000000);
            var urlCheck = 'https://request-global.czilladx.com/serve/popunder.php?withoutAdCode=1&z='+_coinzilla_fp_id_+'&n='+nounce;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', urlCheck);
            xhr.withCredentials = true;
            xhr.onload = function() {
                if (xhr.status === 200) {
                    var response = xhr.responseText;
                    if(suite.isEmptyString(response)) return;
                    self.url = response;
                    if(_coinzilla_fp_interval_ === undefined) {
                        _coinzilla_fp_interval_ = 10;
                    }
                    if ((trafficType == 2 && mobile.true) || !trafficType || trafficType == 0 || (trafficType == 1 && !mobile.true)){
                        self.valid = true;
                    }
                    if(!self.valid)
                        return;
                    self.target = document.getElementById(targetElement) || window;
                    if(!self.prepend(_coinzilla_fp_interval_))
                        return;
                    if(popType == 1){
                        self.prependDv();
                    }
                    var binding = function(event) {
                        if(popType == 0){
                            if (action.followLinks(event, self))
                                return;
                        }
                        if(mobile.true)
                            self.listenerEventMobile();
                        else
                            self.listenerEventWeb();
                        action.unBind({
                            function: binding,
                            event: "click",
                            target:self.target
                        });
                    };
                    action.bind({
                        function: binding,
                        event: "click",
                        target:self.target
                    });
                }
            };
            xhr.send();


        },
        prepend : function(_coinzilla_fp_interval_){
            if(!suite.isCookieEnabled())
                return false;
            this.loadCooked(this);
            if (new Date().getTime() - this.lastCall < 1000*60*_coinzilla_fp_interval_ && this.cap > 0)
                return false;
            if(this.cap >= maxCap)
                return false;
            if(mobile.true && browser.ios || browser.safari )
                this.prependBg();
            return true;
        },
        listenerEventMobile : function(){
            this.behindTabMobile();
            this.jobDone();
        },
        listenerEventWeb : function(){

            if(popType == 1){
                var form = document.createElement("form");
                form.method = "POST";
                form.action = url;
                form.target = "_blank";
                document.body.appendChild(form);
                form.submit();
                form.remove();
                this.removeDv();
                this.jobDone();
                return;
            }
            if(this.behindTabCheck) {
                this.behindTab();
                return;
            }

            var newWindow =  parent.window.open(this.url, this.name, this.parseParams());
            if(newWindow) {
                this.jobDone();
                action.blur(newWindow);
            }

        },
        behindTab: function() {
            var urlBehind = this.url,
                w = parent.open(window.location.href, '_blank');
            this.jobDone();
            setTimeout(function() {
                window.location.href = urlBehind;
            }, 10);
            return w;
        },
        behindTabMobile: function(){
            if(browser.android) {
                this.behindTab();
                return;
            }
        },
        behindTabCheck : function (){
            return  ( browser.opera || browser.chrome);
        },
        parseParams: function() {
            var params = '', k;
            for (k in this.__windowOptions) {
                if (typeof this.__windowOptions[k] != 'undefined') {
                    params += (params ? ',' : '') + k + '=' + this.__windowOptions[k];
                }
            }
            return params;
        },
        prependDv: function (){
            var self = this;
            var a = document.createElement('div');
            a.setAttribute('style', 'position: fixed; width: 100%; top:0; height: 100%; left:0; z-index: 9999999;');
            a.setAttribute('id',"plugpoara");
            document.body.insertBefore(a, document.body.lastChild);
        },
        removeDv: function(){
            var a = document.getElementById('plugpoara');
            a.remove();
        },
        prependBg: function (){
            var self = this;
            var a = document.createElement('a');
            a.href = thisUrl;
            a.target = "_blank";
            a.id = "prepend_plug";
            a.setAttribute('style', 'position:fixed !important; top:0 !important; left:0 !important; width:100% !important; height:100% !important; z-index:9999999 !important; background: transparent !important; ');
            var timer = setInterval(function() {
                if (document.readyState == 'complete') {
                    clearInterval(timer);
                    if(targetElement) {
                        a.removeAttribute('style');
                        a.setAttribute('style', 'position:absolute !important; top:0 !important; left:0 !important; width:100% !important; height:100% !important; z-index:9999999 !important; background: transparent !important; ');
                        self.target.insertBefore(a, self.target.firstChild);
                    }
                    else document.body.insertBefore(a, document.body.lastChild);
                    a.focus();
                }
            }, 10);
        },
        jobDone: function(){
            this.cap++;
            this.lastCall = new Date().getTime();
            this.bakeCookie();
        },
        loadCooked: function(){
            var cooked = suite.getCookie(cookieName);
            if(cooked === null) {
                this.cap = 0;
                this.lastCall = new Date().getTime();
            }else{

                var brute = suite.getCookie(cookieName);
                this.cap = brute.backed[0].cap;
                this.lastCall = brute.backed[0].lastCall;
            }
        },
        bakeCookie:function(){
            var backing = {
                backed: []
            };
            backing.backed.push({
                "cap": this.cap,
                "lastCall": this.lastCall
            });
            suite.setCookie(cookieName,backing,keepCookie,"/");
        }
    };
    call["do"] = function(args) {
        return new this(args);
    };
    call["do"]();
})(this);