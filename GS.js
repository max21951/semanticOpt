

function CrossDomainStorage(origin, path) {
    this.origin = origin;
    this.path = path;
    this._iframe = null;
    this._iframeReady = false;
    this._queue = [];
    this._requests = {};
    this._id = 0;
}

CrossDomainStorage.prototype = {


    constructor: CrossDomainStorage,



    init: function () {

        var that = this;

        if (!this._iframe) {
            if (window.postMessage && window.JSON && window.localStorage) {
                this._iframe = document.createElement("iframe");
                this._iframe.style.cssText = "position:absolute;width:1px;height:1px;left:-9999px;";
                document.body.appendChild(this._iframe);

                if (window.addEventListener) {
                    this._iframe.addEventListener("load", function () { that._iframeLoaded(); }, false);
                    window.addEventListener("message", function (event) { that._handleMessage(event); }, false);
                } else if (this._iframe.attachEvent) {
                    this._iframe.attachEvent("onload", function () { that._iframeLoaded(); }, false);
                    window.attachEvent("onmessage", function (event) { that._handleMessage(event); });
                }
            } else {
                throw new Error("Unsupported browser.");
            }
        }

        this._iframe.src = this.origin + this.path;

    },

    requestValue: function (key, callback) {
        var request = {
            key: key,
            isGet: true,
            id: ++this._id
        },
            data = {
                request: request,
                callback: callback
            };
        if (this._iframeReady) {
            this._sendRequest(data);
        } else {
            this._queue.push(data);
        }

        if (!this._iframe) {
            this.init();
        }
    },

    setValue: function (key, kValue) {
        var request = {
            key: key,
            isGet: false,
            value: kValue,
            id: ++this._id
        },
            data = {
                request: request
            };

        if (this._iframeReady) {
            this._sendRequest(data);
        } else {
            this._queue.push(data);
        }

        if (!this._iframe) {
            this.init();
        }
    },



    _sendRequest: function (data) {
        this._requests[data.request.id] = data;
        this._iframe.contentWindow.postMessage(JSON.stringify(data.request), this.origin);
    },

    _iframeLoaded: function () {
        this._iframeReady = true;

        if (this._queue.length) {
            for (var i = 0, len = this._queue.length; i < len; i++) {
                this._sendRequest(this._queue[i]);
            }
            this._queue = [];
        }
    },

    _handleMessage: function (event) {
        if (event.origin == this.origin) {
            var data = JSON.parse(event.data);
            this._requests[data.id].callback(data.key, data.value);
            delete this._requests[data.id];
        }
    }

};

function DataService(callBack) {
    this.callback = callBack;
    this.getData = function () { return this.callback(); };
}


function DataServiceManager() {
    //  this.cdStorage = cdStorage;
    this.providers = new Array();
    this.register = function (service) {
        this.providers.push(service);
    };

    this.getData = function () {
        var result = '';
        for (var i in this.providers) {
            result = result + this.providers[i].getData() + ' ';
        }
        return result;
    };
}
