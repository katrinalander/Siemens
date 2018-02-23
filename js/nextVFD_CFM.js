var page = Number(sessionStorage.getItem("page"));
var newVFD = JSON.parse(sessionStorage.getItem("newVFD"));
var VFD = JSON.parse(sessionStorage.getItem("VFD"));

function cleanSessionStorage(){
    sessionStorage.removeItem("newVFD");
    sessionStorage.removeItem("VFD");
}

function updateSessionStorage(VFD,newVFD) {
    sessionStorage.setItem("newVFD", JSON.stringify(newVFD));
    sessionStorage.setItem("VFD", JSON.stringify(VFD));
}

if (page > 0) { //show PREV PAGE button
    document.getElementsByClassName('leftButton')[0].classList.remove('showPrev');
    // document.getElementsByClassName('arrowL')[0].classList.remove('showPrev');
}
if ((page+1) < newVFD.length) { //show NEXT PAGE button
    document.getElementsByClassName('rightButton')[0].classList.remove('showNext');
    // document.getElementsByClassName('arrowR')[0].classList.remove('showNext');
}

newVFD[page].forEach(function (vfd, index) {
    // buttons VFD
    var fan = document.getElementById('fan'+index);

    // onClick function for buttons DISABLE, ENABLE, RESET
    if(newVFD[page][index] === "DI" || newVFD[page][index] === "EN") {
        fan.onclick = function () {
            if (newVFD[page][index] === "DI") {
                newVFD[0][index] = "EN";
                vfd = "EN";
                fan.innerHTML = "ENABLE<br />VFD " + Number(index + (6*page+1));
                fan.classList.remove('greenBtn');
                fan.classList.add('redBtn');
            }
            else if (newVFD[page][index] === "EN") {
                newVFD[page][index] = "DI";
                vfd = "DI";
                fan.innerHTML = "DISABLE<br>VFD " + Number(index + (6*page+1));
                fan.classList.remove('redBtn');
                fan.classList.add('greenBtn');
            }
        };// switch VFD between DISABLE and ENABLE
    }
    else if(newVFD[page][index] === "RE") {
        fan.onclick = function () {
            console.log("RESET VFD!");
        }
    }

    // added class and content for button
    if(vfd === "DI") {
        fan.innerHTML = "DISABLE<br>VFD "+Number(index+(6*page+1));
        fan.classList.add('greenBtn');
    }
    else if(vfd === "EN") {
        fan.innerHTML = "ENABLE<br />VFD "+Number(index+(6*page+1));
        fan.classList.add('redBtn');

    }
    else if(vfd === "RE") {
        fan.innerHTML = "RESET<br />VFD "+Number(index+(6*page+1))+" FAULT";
        fan.classList.add('pinkBtn');
    }
    else if(vfd === "CO") {
        fan.innerHTML = "Comm Lost<br />VFD "+Number(index+(6*page+1));
        fan.classList.add('flashBlueBtn');
    }
    else {
        fan.classList.add("showPrev");
    }
});

function onGlobalStart() {
    console.log("on global start!");
    console.log("VFD = ",VFD);
    cleanSessionStorage();

    VFD.forEach(function (vfd,index) {
        if (VFD[index] === "EN") {
            vfd="DI";
            VFD[index] = "DI";
        }
    });

    var numPages = Math.ceil(VFD.length / 6);
    var index=0;
    for(var i=0; i<numPages; i++){
        newVFD[i] = (VFD.slice(index,6+index));
        index+=6;
    }

    newVFD[page].forEach(function (vfd,index) {
        if (vfd === "DI") {
            var fan = document.getElementById('fan'+index);
            fan.innerHTML = "DISABLE<br>VFD "+Number(index+(6*page+1));
            fan.classList.remove('redBtn');
            fan.classList.add('greenBtn');
        }
    });

    updateSessionStorage(VFD,newVFD);

    console.log("after global start");
    console.log("VFD = ",VFD);
}

function onGlobalStop() {
    console.log("on global stop!");
    console.log("VFD = ",VFD);
    cleanSessionStorage();

    VFD.forEach(function (vfd,index) {
        if (VFD[index] === "DI") {
            vfd="EN";
            VFD[index] = "EN";
        }
    });

    var numPages = Math.ceil(VFD.length / 6);
    var index=0;
    for(var i=0; i<numPages; i++){
        newVFD[i] = (VFD.slice(index,6+index));
        index+=6;
    }

    newVFD[page].forEach(function (vfd,index) {
        if (vfd === "EN") {
            var fan = document.getElementById('fan'+index);
            fan.innerHTML = "ENABLE<br>VFD "+Number(index+(6*page+1));
            fan.classList.remove('greenBtn');
            fan.classList.add('redBtn');
        }
    });

    updateSessionStorage(VFD,newVFD);

    console.log("after global stop");
    console.log("VFD = ",VFD);
}

function onGlobalReset() {
    console.log("on global reset!");
    console.log("VFD = ",VFD);
    cleanSessionStorage();

    VFD.forEach(function (vfd,index) {
        if (VFD[index] === "DI") {
            vfd="EN";
            VFD[index] = "EN";
        }
    });

    var numPages = Math.ceil(VFD.length / 6);
    var index=0;
    for(var i=0; i<numPages; i++){
        newVFD[i] = (VFD.slice(index,6+index));
        index+=6;
    }

    newVFD[page].forEach(function (vfd,index) {
        if (vfd === "EN") {
            var fan = document.getElementById('fan'+index);
            fan.innerHTML = "ENABLE<br>VFD "+Number(index+(6*page+1));
            fan.classList.remove('greenBtn');
            fan.classList.add('redBtn');
        }
    });

    updateSessionStorage(VFD,newVFD);

    console.log("after global reset");
    console.log("VFD = ",VFD);
}

function nextPage() {
    sessionStorage.setItem("page", page+1);
    window.location.href = "nextVFD_CFM.html";
}

function prevPage() {
    // sessionStorage.setItem("VFD", JSON.stringify(newVFD));
    if(page-1 > 0) {
        sessionStorage.setItem("page", page-1);
        window.location.href = "nextVFD_CFM.html";
    }
    else {
        window.location.href = "VFDstatus.html";
    }
}