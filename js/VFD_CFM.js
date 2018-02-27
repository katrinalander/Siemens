var VFD, newVFD, numPages, index;
if(!sessionStorage.getItem("VFD")) {
    VFD = ["DI", "DI", "EN", "EN", "CO", "DI", "DI", "RE", "DI", "DI", "EN", "EN", "CO", "DI", "DI", "RE", "CO", "CO", "CO", "CO"];
    newVFD = [];
    if (VFD.length >6) {
        document.getElementsByClassName('rightButton')[0].classList.remove('showNext');
        // document.getElementsByClassName('arrowR')[0].classList.remove('showNext');
        numPages = Math.ceil(VFD.length / 6);
        console.log("numPages="+numPages);
        index=0;
        for(var i=0; i<numPages; i++){
            newVFD.push(VFD.slice(index,6+index));
            index+=6;
        }// split all fans for pages
        console.log("newVFD=",newVFD);
    }
    else {
        newVFD[0] = VFD;
    }
}
else {
    newVFD = JSON.parse(sessionStorage.getItem("newVFD"));
    VFD = JSON.parse(sessionStorage.getItem("VFD"));
    if (VFD.length >6) {
        document.getElementsByClassName('rightButton')[0].classList.remove('showNext');
        // document.getElementsByClassName('arrowR')[0].classList.remove('showNext');
        numPages = Math.ceil(VFD.length / 6);
        console.log("numPages="+numPages);
    }
    else {
        newVFD[0] = VFD;
    }
}

function cleanSessionStorage(){
    sessionStorage.removeItem("newVFD");
    sessionStorage.removeItem("VFD");
}

function updateSessionStorage(VFD,newVFD) {
    sessionStorage.setItem("newVFD", JSON.stringify(newVFD));
    sessionStorage.setItem("VFD", JSON.stringify(VFD));
}

cleanSessionStorage();

newVFD[0].forEach(function (vfd, index) {
    // buttons VFD
    var fan = document.getElementById('fan'+index);

    // onClick function for buttons DISABLE, ENABLE, RESET
    if(newVFD[0][index] === "DI" || newVFD[0][index] === "EN") {
        fan.onclick = function () {
            if (newVFD[0][index] === "DI") {
                newVFD[0][index] = "EN";
                vfd = "EN";
                fan.innerHTML = "ENABLE<br />VFD " + Number(index + 1);
                fan.classList.remove('greenBtn');
                fan.classList.add('redBtn');
            }
            else if (newVFD[0][index] === "EN") {
                newVFD[0][index] = "DI";
                vfd = "DI";
                fan.innerHTML = "DISABLE<br>VFD " + Number(index + 1);
                fan.classList.remove('redBtn');
                fan.classList.add('greenBtn');
            }
        };// switch VFD between DISABLE and ENABLE
    }
    else if(newVFD[0][index] === "RE") {
        fan.onclick = function () {
            console.log("RESET VFD!");
        }
    }

    // added class and content for button
    if(vfd === "DI") {
        fan.innerHTML = "DISABLE<br>VFD "+Number(index+1);
        fan.classList.add('greenBtn');
    }
    else if(vfd === "EN") {
        fan.innerHTML = "ENABLE<br />VFD "+Number(index+1);
        fan.classList.add('redBtn');

    }
    else if(vfd === "RE") {
        fan.innerHTML = "RESET<br />VFD "+Number(index+1)+" FAULT";
        fan.classList.add('pinkBtn');
    }
    else if(vfd === "CO") {
        fan.innerHTML = "Comm Lost<br />VFD "+Number(index+1);
        fan.classList.add('flashBlueBtn');
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

    newVFD[0].forEach(function (vfd,index) {
        if (vfd === "DI") {
            var fan = document.getElementById('fan'+index);
            fan.innerHTML = "DISABLE<br>VFD "+Number(index+1);
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

    newVFD[0].forEach(function (vfd,index) {
        if (vfd === "EN") {
            var fan = document.getElementById('fan'+index);
            fan.innerHTML = "ENABLE<br>VFD "+Number(index+1);
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

    newVFD[0].forEach(function (vfd,index) {
        if (vfd === "EN") {
            var fan = document.getElementById('fan'+index);
            fan.innerHTML = "ENABLE<br>VFD "+Number(index+1);
            fan.classList.remove('greenBtn');
            fan.classList.add('redBtn');
        }
    });

    updateSessionStorage(VFD,newVFD);

    console.log("after global stop");
    console.log("VFD = ",VFD);
}

function nextPage() {
    sessionStorage.setItem("newVFD", JSON.stringify(newVFD));
    sessionStorage.setItem("VFD", JSON.stringify(VFD));
    sessionStorage.setItem("page", 1);
    window.location.href = "nextVFD_CFM.html";
}
