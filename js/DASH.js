// runtime script for SVG

var dataPoints = [];
var dataPointsDescr = [];
var jsonIds = [];
var jsonIdsDescr = [];
var jsonIdInfo = [];
var requests = [];
var requestsDescr = [];
var requestsAlm = [];
var requestsInfo = [];
var requestIndex = -1;
var bDeviceIsOn = false;
var allElements = [];
var uscita;

function getEnumeration(strEnum) {
    var aEnum = new Array();

    var item = "";
    var iItem = 0;
    for (var i = 0; i < strEnum.length; i++) {
        var ch = strEnum.charAt(i);
        switch (ch) {
            case "\\":           // escape
                i++;
                if (i < strEnum.length)
                    item += strEnum.charAt(i);
                break;

            case "*":            // separator
                aEnum[iItem++] = item;
                item = "";
                break;

            default:
                item += ch;
        }
    }

    if (item.length > 0)
        aEnum[iItem++] = item;

    return aEnum;
}

function getIdsDescr(dm) {

    // collect mapping ids for ajax request
    var jid = [];
    dm.forEach(function (element) {
        if (element.description) {
            if (jid.indexOf(element.description.id) < 0)
                jid.push(element.description.id);
        }

        element.found = false;
    });

    return jid;
}

function getRequests(jid) {
    var requests = [];

    var rmax = 10;

    for (var i = 0; i < jid.length; i += rmax) {

        var end = i + rmax;
        if (end > jid.length) end = jid.length;

        var rjid = jid.slice(i, end);

        var dataSend = (
        {
            fn: "Read",
            PIN: configuration.pin,
            us: 2,
            lng: configuration.language,
            id: rjid
        });

        // replace 'id[]' to 'id'
        var dataSendString = jQuery.param(dataSend).replace(/id%5B%5D/g, "id");
        var host = configuration.uselocal ? location.hostname : configuration.host;
        var url = "http://" + host + "/json.html?" + dataSendString;

        requests.push(url);
    }

    return requests;
}

function getRequestsDescr(jid) {
    var requests = [];

    var rmax = 10;

    for (var i = 0; i < jid.length; i += rmax) {

        var end = i + rmax;
        if (end > jid.length) end = jid.length;

        var rjid = jid.slice(i, end);

        var dataSend = (
        {
            fn: "GetText",
            PIN: configuration.pin,
            us: 2,
            lng: configuration.language,
            id: rjid
        });

        // replace 'id[]' to 'id'
        var dataSendString = jQuery.param(dataSend).replace(/id%5B%5D/g, "id");
        var host = configuration.uselocal ? location.hostname : configuration.host;
        var url = "http://" + host + "/json.html?" + dataSendString;

        requests.push(url);
    }

    return requests;
}

function getRequestsAlarms() {
    //JSInterface.maketoast();
    var requests = [];
    var host = configuration.uselocal ? location.hostname : configuration.host;
    //alert(host);
    //var url = "http://" + host + "/json.html?FN=ALList&PG=4096&LNG=2&fmt=%22%25m%2F%25d%2F%25y-%5Cu0025H:%25M:%25S%20%25s%20%25T:%20%25V%22";
    var url = "http://" + host + "/json.html?FN=ALList&PG=4096&LNG=" + configuration.language + "&fmt=%22%25m%2F%25d%2F%25y-%5Cu0025H:%25M:%25S%20%25s%20%25T:%20%25V%22";
    requests.push(url);
    return requests;
}

function getRequestTemp() {
    var requests = [];
    var host = configuration.uselocal ? location.hostname : configuration.host;
    //alert(host);
    //var url = "http://" + host + "/json.html?FN=ALList&PG=4096&LNG=2&fmt=%22%25m%2F%25d%2F%25y-%5Cu0025H:%25M:%25S%20%25s%20%25T:%20%25V%22";
    var url = "http://" + host + "/json.html?FN=ALList&PG=4096&LNG=" + configuration.language + "&fmt=%22%25m%2F%25d%2F%25y-%5Cu0025H:%25M:%25S%20%25s%20%25T:%20%25V%22";
    requests.push(url);
    return requests;
}


function writeDataToClimatix(idwp, value) {
    var dataSend = (
    {
        //type: "POST", 
        fn: "Write",
        PIN: configuration.pin,
        us: 2,
        id: idwp,
        data: value

    });

    // replace 'id[]' to 'id'
    var dataSendString = jQuery.param(dataSend).replace(/id%5B%5D/g, "id");
    dataSendString = dataSendString.replace("&data=", "%3B");
    var host = configuration.uselocal ? location.hostname : configuration.host;
    var url2write = "http://" + host + "/json.html?" + dataSendString;

    $.ajax({
        url: url2write,
        dataType: "jsonp",
        success: function (msg) {
            //alert(msg);
        },
        error: function (xhr, status, error) {
            //alert(status);
        }
    });

    return true;
}

//per scrivere il valore
//http://ctx.ddns.net/JSON.html?FN=Write&ID=1-TMPECDZ%3B6&PIN=7659
//http://ctx.ddns.net/JSON.html?FN=Write&ID=1-TMPCOSPVHTG%3B58.17&PIN=7659

function isFloat(x) { return !!(x % 1); }

function loadDatapoints() {
    $.ajax({
        url: requests[requestIndex],
        dataType: "jsonp",
        success: function (data) {
            // debugger;
            data.forEach(function (value) {

                dataPoints.forEach(function (element) {
                    var tag = $("#" + element.id);

                    var val = value.value;
                    if (isFloat(val))
                        val = Math.round(val * 10) / 10;
                    if (typeof val == "boolean")
                        val = val ? 1 : 0;

                    if (element.text) {
                        if (element.text.id === value.id) { // print value
                            element.found = true;

                            if (element.text.raw)
                                $(tag).text(val);
                            else {
                                var rep = parseInt(value.rep, 10);
                                switch (rep) {
                                    case 0:
                                        $(tag).text(val);
                                        break;

                                    case 1:
                                    case 2:
                                        if (value.descr)
                                            $(tag).text(val + " " + value.descr);
                                        else {
                                            $(tag).text(val);
                                        }
                                        break;

                                    case 3:
                                        if (value.descr) {
                                            var aenum = getEnumeration(value.descr);

                                            var vale = val;
                                            if (vale < 0) vale = 0;
                                            if (vale >= aenum) vale = aenum - 1;

                                            $(tag).text(aenum[vale]);
                                        } else
                                            $(tag).text(val);

                                        break;

                                    case 4: // bitfield
                                        $(tag).text("0x" + val.toString(16));
                                        break;

                                    case 5: // time, TODO
                                        break;

                                    case 6: // date, TODO
                                        break;

                                    case 7: // week-N-day, TODO
                                        break;

                                    default:
                                        $(tag).text(val);
                                }
                            }
                        }
                    }

                    if (element.visible) {
                        if (element.visible.id === value.id) { // show or hide element
                            element.found = true;

                            if (typeof element.visible.levels == "undefined") {
                                $(tag).attr("opacity", 1);
                            } else {
                                var found = false;

                                element.visible.levels.forEach(function (level) {
                                    var vall = parseInt(level, 10);
                                    if (vall === val) {
                                        found = true;
                                    }
                                });

                                $(tag).attr("opacity", found ? 1 : 0);
                            }
                        }
                    }

                    if (element.colors) {
                        if (element.colors.id === value.id) { // set colors
                            element.found = true;
                            var color = null;

                            element.colors.steps.forEach(function (step) {
                                var valc = parseInt(step.step, 10);
                                if (valc === val)
                                    color = step.color;
                            });

                            colorElement(tag, color, element.colors.fill, element.colors.line, element.colors.opacity);
                            $(tag).find("*").each(function (i, elem) {
                                colorElement(elem, color, element.colors.fill, element.colors.line, element.colors.opacity);
                            });
                        }
                    }

                    if (element.onoff) {
                        if (element.onoff.id === value.id) { // set colors
                            element.found = true;

                            var color = null;
                            tag = $("#" + element.id);
                            var mOff = $("#onoff");
                            //var mOff_old = $("#off");
                            var mAuto = $("#auto");
                            if (window.changingOnOffValue == "-1" || window.changingOnOffValue == val) {
                                var msg = $('#swtchmessage');
                                msg.text("Switching...");
                                msg.attr("style", "color:white");
                                switch (val) {
                                    case 0:
                                        //mOff_old.bootstrapToggle('on');
                                        mOff.bootstrapToggle('off');
                                        mAuto.bootstrapToggle('on');
                                        bDeviceIsOn = true;
                                        break;

                                    case 1:
                                        //mOff_old.bootstrapToggle('off');
                                        mOff.bootstrapToggle('on');
                                        mAuto.bootstrapToggle('off');
                                        bDeviceIsOn = false;
                                        break;

                                        /*case 2:
                                            //mOff_old.bootstrapToggle('off');
                                            mOff.bootstrapToggle('off');
                                            mAuto.bootstrapToggle('on');
                                            break;*/
                                }
                                window.changingOnOffValue = -1;
                            }
                            else {
                                var msg = $('#swtchmessage');
                                msg.text("Switching...");
                                msg.attr("style", "color:black");
                            }
                            /*if (val) {
                                //color = "green";
                                $(tag).bootstrapToggle('on');
                            }
                            else {
                                //color = "red";
                                $(tag).bootstrapToggle('off');
                            }*/
                            //colorElement(tag, color);
                        }

                        //$(tag).text("Ciccio");
                    }
                });
            });
        },
        complete: function () {
            requestIndex++;
            if (requestIndex >= requests.length) {
                requestIndex = 0;

                // hide elements if element is not found
                dataPoints.forEach(function (element) {
                    var tag = $("#" + element.id);
                    if (!element.found)
                        $(tag).attr("opacity", 0);
                });

                setTimeout(loadDatapoints, 2000);
            } else
                setTimeout(loadDatapoints, 300);

            window.dataloaded = true;
        },
        error: function (e) {
            setTimeout(loadDatapoints, 2000);
        }
    });
}
function loadDatapointsDescr() {
    $.ajax({
        url: requestsDescr[requestIndex],
        dataType: "jsonp",
        success: function (data) {
            // debugger;
            data.forEach(function (value) {

                dataPointsDescr.forEach(function (element) {
                    var tag = $("#" + element.id);

                    var val = value.inst;
                    if (typeof val == "boolean")
                        val = val ? 1 : 0;

                    if (element.description) {
                        if (element.description.id === value.id) {
                            $(tag).text(val);
                        }
                    }
                });
            });
        },
        error: function (e) {
            alert(e);
        }
    });
}

function loadDash(file) {
    try {
        $.ajax({
            url: file,
            dataType: 'html',
            success: function (response) {
                $('#dash1').html(response);
                $('#dash1').css('display', 'block');
                $('#dash1').css({ 'width': "100%", 'height': "100%" });
                /*var $this = $(this);
                var $svgElem = $("#dash1", $this);
                $svgElem.css({ 'width': "100%", 'height': "100%" });*/

                /*jsonIdsDescr = getIdsDescr(dataPointsDescr);
                requestsDescr = getRequestsDescr(jsonIdsDescr);
    
                if (requestsDescr.length > 0) {
                    requestIndex = 0;
                    loadDatapointsDescr();
                }*/
                dataPoints = getDatapoints();
                prepare(dataPoints);
                jsonIds = getIds(dataPoints);
                requests = getRequests(jsonIds);

                if (requests.length > 0) {
                    requestIndex = 0;
                    loadDatapoints();
                }


            }, error:
                function () {
                    debugger;
                }
        });
    }
    catch (err) {
    }
}

function loadlastalarm() {
    //da abilitare e provarlo con usb
    try {
        /*if (configuration.host.indexOf("localhost") < 0) {
            loadalarms();
            return;
        }*/
        var lastal = JSInterface.getlastalarm();
        var mImg = document.getElementById('almicon');

        if (lastal == null || lastal == "") {
            mImg.style.visibility = "hidden";
            $('#almtxt').text(" ");
        }
        else {
            if (lastal == "WAITAL") {
                mImg.style.visibility = "hidden";
                $('#almtxt').text("Receiving alarms...");
            }
            else {
                mImg.style.visibility = "visible";
                $('#almtxt').text(lastal);
            }
        }
        window.alarmsloaded = true;
        setTimeout(loadlastalarm, 5000);
    }
    catch (err) {
        setTimeout(loadlastalarm, 2000);
    }
}

function loadClimatixValues() {
    try {
        $(document).ready(function () {

            allElements = document.getElementsByTagName("*");
            dataPoints = [];
            for (var i = 0, n = allElements.length; i < n; ++i) {
                var el = allElements[i];
                var isDatapoint = "";
                if (el.id != "" && el.id.length >2 && el.id.substring(0,3) == "DP_")
                    if (el.id) { dataPoints.push(el.id.substring(3)); }
            }

            /*jsonIdInfo = [];
            jsonIdInfo.push("1-SUPPLYTMP");

            requestsInfo = getRequests(jsonIdInfo);*/

            //var rjid = ["1-SUPPLYTMP", "1-OUTTMP"];// getNextJsonIds(jsonIdIndex, requestNum, jsonIds);
            var host = configuration.uselocal ? location.hostname : configuration.host;
            var hostUrl = "http://" + configuration.username + ":" + configuration.password + "@" + host;
            requestsInfo = getRequest(dataPoints, configuration.pin, hostUrl, configuration.preview, configuration.isCloud);

            //http://JSON:SBTAdmin!@195.198.85.22/json.html?fn=Read&PIN=7659&us=2&id=1-SW…id=1-OUTTMP&id=1-SUPPLYFLOW&id=1-RETURNFLOW&id=1-SUPPLYTMP&id=1-EXHAUSTTMP
            try {
                $.ajax({
                    url: requestsInfo,
                    dataType: "jsonp",
                    success: function (data) {

                        data.forEach(function (value) {

                            dataPoints.forEach(function (element) {
                                var tag = $("#DP_" + element);
                                var tagsp = $("#SP_" + element);

                                var val = value.value;
                                if (isFloat(val))
                                    val = Math.round(val * 10) / 10;
                                if (typeof val == "boolean")
                                    val = val ? 1 : 0;

                                //if (element.text) {
                                    if (element === value.id) { // print value
                                        //element.found = true;

                                        /*if (element.text.raw)
                                            $(tag).text(val);
                                        else {*/
                                        var oldText = (tag)[0].textContent;
                                            var rep = parseInt(value.rep, 10);
                                            switch (rep) {
                                                case 0:
                                                    $(tag).text(parseFloat(val).toFixed(2));
                                                    break;

                                                case 1:
                                                case 2:
                                                    if (value.descr)
                                                        $(tag).text(parseFloat(val).toFixed(2) + " " + value.descr);
                                                    else {
                                                        $(tag).text(val);
                                                    }
                                                    break;

                                                case 3:
                                                    if (value.descr) {
                                                        var aenum = getEnumeration(value.descr);

                                                        var vale = val;
                                                        if (vale < 0) vale = 0;
                                                        if (vale >= aenum) vale = aenum - 1;

                                                        $(tag).text(aenum[vale]);
                                                    } else
                                                        $(tag).text(val);

                                                    break;

                                                case 4: // bitfield
                                                    $(tag).text("0x" + val.toString(16));
                                                    break;

                                                case 5: // time, TODO
                                                    break;

                                                case 6: // date, TODO
                                                    break;

                                                case 7: // week-N-day, TODO
                                                    break;

                                                default:
                                                    $(tag).text(val);
                                            }

                                            var attribute = $(tag).attr('data-climatix-originalvalue');
                                            var attributeHigh = $(tag).attr('data-climatix-high');
                                            var attributeLow = $(tag).attr('data-climatix-low');
                                            //var attributeDisply = $(tag).attr('data-climatix-display');

                                            if (attribute != null && attribute != undefined)
                                                $(tag).attr('data-climatix-originalvalue', val);
                                            if (attributeHigh != null && attributeHigh != undefined)
                                                $(tag).attr('data-climatix-high', value.high);
                                            if (attributeLow != null && attributeLow != undefined)
                                                $(tag).attr('data-climatix-low', value.low);
                                            /*if (attributeDisply != null && attributeDisply != undefined)
                                                $(tag).attr('data-climatix-display', value.diplay);*/

                                            if ((tag)[0].textContent != oldText) {
                                                $(tagsp).text(parseFloat(val).toFixed(2));
                                            }
                                    }
                                //}
                            });
                        });


                        setTimeout(loadClimatixValues, 2000);
                    },
                    error: function (e) {
                        setTimeout(loadalarms, 2000);
                    }

                });
            }
            catch (err) {
                setTimeout(loadClimatixValues, 2000);
            }

        });
    }
    catch (err) {
        setTimeout(loadClimatixValues, 2000);
    }

}

function loadChartValue(strDataPoint) {
    uscita;
    var val;
    jsonIdInfo = [];
    jsonIdInfo.push(strDataPoint);

    requestsInfo = getRequests(jsonIdInfo);
    jQuery.ajax({
        url: requestsInfo,
        dataType: "jsonp",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.length > 0) {
                val = data[0].value;
                if (isFloat(val))
                    val = Math.round(val * 10) / 10;
                if (typeof val == "boolean")
                    val = val ? 1 : 0;
                uscita = val;
            }
        }
    });

    return uscita;
}

function getRequest(rjid, pin, hostUrl, isPreview, isCloud) {
    if (!isPreview && !isCloud) {
        pin = document.cookie.replace(/(?:(?:^|.*;\s*)password\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    }

    var dataSend = (
        {
            fn: "Read",
            PIN: pin,
            us: 2,
            id: rjid
        });

    // replace 'id[]' to 'id'
    var dataSendString = jQuery.param(dataSend).replace(/id%5B%5D/g, "id");
    var host;
    if (isPreview)
        host = /*"http://" + */hostUrl + "/";
    else {
        if (/(.*\/Web\/)/i.test(hostUrl) || /(.*\/Web\/)/i.test(location.href))
            host = RegExp.$1;                                     // check for Cloud connectivity
        else
            host = location.href.replace(location.pathname, "/");  // local web server
    }

    var url = host + "json.html?" + dataSendString;
    return url;
}

function loadalarms() {
    try {
        $(document).ready(function () {
            //alert('worked');
            // ajax call here
            requestsAlm = getRequestsAlarms();
            try {
                $.ajax({
                    url: requestsAlm[0],
                    dataType: "jsonp",
                    success: function (data) {
                        if (data == null || data.cnt <= 0) {
                            $('#almtxt').text(" ");
                            var mImg = document.getElementById('almicon');
                            mImg.style.visibility = "hidden";
                        }
                        else {
                            var index = data.cnt - 1;
                            $('#almtxt').text(data.text[index]);
                            var mImg = document.getElementById('almicon');
                            mImg.style.visibility = "visible";
                        }
                        window.alarmsloaded = true;
                        setTimeout(loadalarms, 2000);
                    },
                    error: function (e) {
                        setTimeout(loadalarms, 2000);
                    }

                });
            }
            catch (err) {
                setTimeout(loadlastalarm, 2000);
            }

        });
    }
    catch (err) {
        setTimeout(loadlastalarm, 2000);
    }

}

function changeImg() {
    document.getElementById("infoicon").src = (document.getElementById("infoicon").src.indexOf("images/alarm.jpg") == -1) ? "images/alarm.jpg" : "images/greenlight.jpg";
}



function loadinfoled() {
    $(document).ready(function () {

        if (!bDeviceIsOn) {
            var mImgoff = document.getElementById('infoicon');
            mImgoff.src = "images/grey.png";
            mImgoff.style.visibility = "visible";
            setTimeout(loadinfoled, 1000);
            return;
        }
        jsonIdInfo = [];
        jsonIdInfo.push("1-HMI");

        requestsInfo = getRequests(jsonIdInfo);

        $.ajax({
            url: requestsInfo[0],
            dataType: "jsonp",
            success: function (data) {
                var mImg = document.getElementById('infoicon');

                if (data == null || data[0] == null || data[0].value == null) {
                    document.getElementById("infoicon").src = "images/grey.png";
                    mImg.style.visibility = "visible";
                    setTimeout(loadinfoled, 1000);
                    return;
                }
                switch (data[0].value) {
                    case 51:
                        document.getElementById("infoicon").src = "images/grey.png";
                        mImg.style.visibility = "visible";
                        break;
                    case 49:
                        document.getElementById("infoicon").src = "images/red.png";
                        mImg.style.visibility = "visible";
                        break;
                    case 19:
                        document.getElementById("infoicon").src = "images/green.png";
                        mImg.style.visibility = "visible";
                        break;
                    case 17:
                        document.getElementById("infoicon").src = "images/amber.png";
                        mImg.style.visibility = "visible";
                        break;
                    case 50:
                        document.getElementById("infoicon").src = (document.getElementById("infoicon").src.indexOf("images/red.png") == -1) ? "images/red.png" : "images/grey.png";
                        mImg.style.visibility = "visible";
                        break;
                    case 35:
                        document.getElementById("infoicon").src = (document.getElementById("infoicon").src.indexOf("images/green.png") == -1) ? "images/green.png" : "images/grey.png";
                        mImg.style.visibility = "visible";
                        break;
                    case 34:
                        document.getElementById("infoicon").src = (document.getElementById("infoicon").src.indexOf("images/amber.png") == -1) ? "images/amber.png" : "images/grey.png";
                        mImg.style.visibility = "visible";
                        break;
                    case 33:
                        document.getElementById("infoicon").src = (document.getElementById("infoicon").src.indexOf("images/red.png") == -1) ? "images/red.png" : "images/amber.png";
                        mImg.style.visibility = "visible";
                        break;
                    case 18:
                        document.getElementById("infoicon").src = (document.getElementById("infoicon").src.indexOf("images/green.png") == -1) ? "images/green.png" : "images/amber.png";
                        mImg.style.visibility = "visible";
                        break;


                }

                //51 -> 00110011 tutto spento
                //49 -> 00110001 0 3 0 1 -> led rosso acceso
                //19 -> 00010011 0 1 0 3 -> led verde acceso
                //17 -> 00010001 0 1 0 1 -> led arancione
                //50 -> 00110010 0 3 0 2 -> led rosso lampeggiante
                //35 -> 00100011 0 2 0 3 -> led verde lampeggiante
                //34 -> 00100010 0 2 0 2 -> led arancione lampeggiante
                //33 -> 00100001 0 2 0 1 -> led rosso di base e lampeggio arancione
                //18 -> 00010010 0 1 0 2 -> led verde di base e lampeggio arancione

                //da capire bene che icone mettere e con che valori
                /*if (data[0].value <= 0) {
                    /*var mImg = document.getElementById('infoicon');
                    mImg.style.visibility = "hidden";*
                    //$('#infoicon').attr('src', 'images/alarm.jpg');
                    document.getElementById("infoicon").src = (document.getElementById("infoicon").src.indexOf("images/red.png") == -1) ? "images/red.png" : "images/green.png";
                }
                else {
                    /*var mImg = document.getElementById('infoicon');
                    mImg.style.visibility = "visible";
                    $('#infoicon').attr('src', 'images/greenlight.jpg');*
                    document.getElementById("infoicon").src = (document.getElementById("infoicon").src.indexOf("images/red.png") == -1) ? "images/red.png" : "images/green.png";
                }*/
                window.infoledloaded = true;
                setTimeout(loadinfoled, 1000);
            },
            error: function (e) {
                setTimeout(loadinfoled, 2000);
            }
        });
    });

}

function writevalue(watchpointID, newvalue) {
    writeDataToClimatix(watchpointID, newvalue);
}

function loadValue(datapoint, idelement) {
    try {

            //datapoints.push(datapoint);

            jsonIdInfo = [];
            jsonIdInfo.push(datapoint);

            requestsInfo = getRequests(jsonIdInfo);

            //var rjid = ["1-SUPPLYTMP", "1-OUTTMP"];// getNextJsonIds(jsonIdIndex, requestNum, jsonIds);
            /*var host = configuration.uselocal ? location.hostname : configuration.host;
            var hostUrl = "http://" + configuration.username + ":" + configuration.password + "@" + host;
            requestsInfo = getRequest(dataPoints, configuration.pin, hostUrl, configuration.preview, configuration.isCloud);*/

            //http://JSON:SBTAdmin!@195.198.85.22/json.html?fn=Read&PIN=7659&us=2&id=1-SW…id=1-OUTTMP&id=1-SUPPLYFLOW&id=1-RETURNFLOW&id=1-SUPPLYTMP&id=1-EXHAUSTTMP
            try {
                $.ajax({
                    url: requestsInfo,
                    dataType: "jsonp",
                    success: function (data) {
                        if (data.length <= 0)
                            return;
                        var val = data[0].value;

                        var tag = $("#" + idelement);
                        $(tag).attr("data-climatix-value", val);

                        if (idelement == "")
                            return;

                                var rep = parseInt(data[0].rep, 10);
                                    switch (rep) {
                                        case 0:
                                            $(tag).text(val);
                                            break;

                                        case 1:
                                        case 2:
                                            if (data[0].descr)
                                                $(tag).text(val + " " + data[0].descr);
                                            else {
                                                $(tag).text(val);
                                            }
                                            break;

                                        case 3:
                                            if (data[0].descr) {
                                                var aenum = getEnumeration(data[0].descr);

                                                var vale = val;
                                                if (vale < 0) vale = 0;
                                                if (vale >= aenum) vale = aenum - 1;

                                                $(tag).text(aenum[vale]);
                                            } else
                                                $(tag).text(val);

                                            break;

                                        case 4: // bitfield
                                            $(tag).text("0x" + val.toString(16));
                                            break;

                                        case 5: // time, TODO
                                            break;

                                        case 6: // date, TODO
                                            break;

                                        case 7: // week-N-day, TODO
                                            break;

                                        default:
                                            $(tag).text(val);
                                    }
                                    //}
                                    return val;
                    },
                    error: function (e) {
                    }

                });
            }
            catch (err) {
            }

    }
    catch (err) {
    }

}
function loadValueToAttribute(datapoint, idelement, attribute) {
    try {

        //datapoints.push(datapoint);

        jsonIdInfo = [];
        jsonIdInfo.push(datapoint);

        requestsInfo = getRequests(jsonIdInfo);
        try {
            $.ajax({
                url: requestsInfo,
                dataType: "jsonp",
                success: function (data) {
                    if (data.length <= 0)
                        return;
                    if (idelement == "")
                        return;
                    var val = data[0].value;

                    var tag = $("#" + idelement);
                    $(tag).attr("data-climatix-value", val);

                }

            });
        }
        catch (err) {
        }

    }
    catch (err) {
    }

}

function swipeIncrement(datapoint, idelement, idtempelement, attribute, increment) {
    try {

        var mElPadre = document.getElementById(idelement);
        var mElTemp = document.getElementById(idtempelement);
        var attrvalue = mElPadre.getAttribute(attribute);
        //var tempel = document.getElementById('touchsurface');
        if (attrvalue != null) {
            attrvalue = parseFloat(attrvalue) + parseFloat(increment);
            mElPadre.setAttribute(attribute, attrvalue);
            mElTemp.innerHTML = parseFloat(attrvalue).toFixed(2); 
            //tempel.innerHTML = increment;
            return;
        }

        jsonIdInfo = [];
        jsonIdInfo.push(datapoint);

        requestsInfo = getRequests(jsonIdInfo);
        try {
            $.ajax({
                url: requestsInfo,
                dataType: "jsonp",
                success: function (data) {
                    if (data.length <= 0)
                        return;
                    if (idelement == "")
                        return;
                    var val = data[0].value;

                    var tag = $("#" + idelement);
                    val = parseFloat(val) + parseFloat(increment);
                    $(tag).attr(attribute, val);
                    mElTemp.innerHTML = parseFloat(val).toFixed(2);
                    //tempel.innerHTML = "DL" + increment;
                    return;
                }

            });
        }
        catch (err) {
        }

    }
    catch (err) {
    }
}

function writeIncrementiOS(datapoint, idelement, idtempelement, attribute, increment) {
    try {

        var mElPadre = document.getElementById(idelement);
        var mElTemp = document.getElementById(idtempelement);
        var attrvalue = mElPadre.getAttribute(attribute);
        //var tempel = document.getElementById('touchsurface');
        if (attrvalue != null) {
            attrvalue = parseFloat(attrvalue) + parseFloat(increment);
            mElPadre.setAttribute(attribute, attrvalue);
            mElTemp.innerHTML = parseFloat(attrvalue).toFixed(2);

            window.open("ios://write?page=0&name=" + datapoint + "&value=" + parseFloat(attrvalue).toFixed(2));

            //tempel.innerHTML = increment;
            return;
        }

        jsonIdInfo = [];
        jsonIdInfo.push(datapoint);

        requestsInfo = getRequests(jsonIdInfo);
        try {
            $.ajax({
                url: requestsInfo,
                dataType: "jsonp",
                success: function (data) {
                    if (data.length <= 0)
                        return;
                    if (idelement == "")
                        return;
                    var val = data[0].value;

                    var tag = $("#" + idelement);
                    val = parseFloat(val) + parseFloat(increment);
                    $(tag).attr(attribute, val);
                    mElTemp.innerHTML = parseFloat(val).toFixed(2);

                    window.open("ios://write?page=0&name=" + datapoint + "&value=" + parseFloat(val).toFixed(2));

                    //tempel.innerHTML = "DL" + increment;
                    return;
                }

            });
        }
        catch (err) {
        }

    }
    catch (err) {
    }
}

function writeIncrementAndroid(datapoint, idelement, attribute, increment) {
    try {

        var mElPadre = document.getElementById(idelement);
        if (mElPadre == null)
            return;
        var attrvalue = mElPadre.getAttribute(attribute);

        if (attrvalue != null) {
            attrvalue = parseFloat(attrvalue) + parseFloat(increment);
            mElPadre.setAttribute(attribute, attrvalue);
            window.JSInterface.writeValue(datapoint, parseFloat(attrvalue).toFixed(2));
            return;
        }

        jsonIdInfo = [];
        jsonIdInfo.push(datapoint);

        requestsInfo = getRequests(jsonIdInfo);
        try {
            $.ajax({
                url: requestsInfo,
                dataType: "jsonp",
                success: function (data) {
                    if (data.length <= 0)
                        return;
                    if (idelement == "")
                        return;
                    var val = data[0].value;

                    var tag = $("#" + idelement);
                    val = parseFloat(val) + parseFloat(increment);
                    $(tag).attr(attribute, val);
                    window.JSInterface.writeValue(datapoint, parseFloat(val).toFixed(2));
                    return;
                }

            });
        }
        catch (err) {
        }

    }
    catch (err) {
    }
}



function setvalue(datapointIndexPage, datapointName, newValue) {
    if (getPlatform().toString() == "iOS") {
        window.open("ios://write?page=" + datapointIndexPage + "&name=" + datapointName + "&value=" + newValue);
        }
    else {
        window.JSInterface.writeValue(datapointName, newValue); 
    }
}

function getPlatform() {
    /*var platform = ["Win32", "Android", "iOS"];
    for (var i = 0; i < platform.length; i++) {
        if (navigator.platform.indexOf(platform[i]) > -1) {
            return platform[i];
        }
    }*/

    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}

function openAlarmPage() {
    if (getPlatform().toString() == "iOS") {
        window.open('ios://jump2alarms');
    }
    else {
        window.JSInterface.startAlarmPage('xxx');
    }

}


$.fn.extend({
    otherinfo: function () {
        loadalarms();
    }
});

//--- end of file ----
