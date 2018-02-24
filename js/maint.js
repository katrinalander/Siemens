function openCtrlSelect() {
    window.location.href = "controlSelection.html";
}
function openVersion() {
    window.location.href = "version.html";
}
var Users = [
    {
        user: "Kat",
        password: "0000",
        group: "Users",
        logoff: 2
    },
    {
        user:"Alex",
        password: "1111",
        group: "Users",
        logoff: 3
    },
    {
        user: "Liran",
        password: "2222",
        group: "Users",
        logoff: 4
    }];
function returnName(user) {
    return function () {
        console.log("Close Modal Users and open modal for user - ", user.user);
        modal.style.display = "none";
        modalUser.style.display = "block";

        var userName = document.createElement('input');
        userName.type = 'text';
        userName.readOnly = true;
        userName.className = 'modalInput';
        userName.value = user.user;
        if(document.getElementsByClassName('modalInput')[0]) {
            document.getElementById('userName').removeChild(document.getElementsByClassName('modalInput')[0]);
        }
        document.getElementById('userName').appendChild(userName);
        var pass = document.createElement('input');
        pass.type = 'password';
        pass.className = 'modalInput';
        pass.value = user.password;
        if(document.getElementsByClassName('modalInput')[1]) {
            document.getElementById('pass').removeChild(document.getElementsByClassName('modalInput')[1]);
        }
        document.getElementById('pass').appendChild(pass);
        var group = document.createElement('input');
        group.type = 'text';
        group.className = 'modalInput';
        group.readOnly = true;
        group.value = user.group;
        if(document.getElementsByClassName('modalInput')[2]) {
            document.getElementById('group').removeChild(document.getElementsByClassName('modalInput')[2]);
        }
        document.getElementById('group').appendChild(group);
        var logoff = document.createElement('input');
        logoff.type = 'text';
        logoff.className = 'modalInput';
        logoff.value = user.logoff;
        if(document.getElementsByClassName('modalInput')[3]) {
            document.getElementById('time').removeChild(document.getElementsByClassName('modalInput')[3]);
        }
        document.getElementById('time').appendChild(logoff);

        function submitUser() {
            console.log("submit user form for user: "+user.user);
            modalUser.style.display = "none";
        }
        var okBtn = document.getElementById('submitUser');
        okBtn.addEventListener('click',submitUser);
    };
}
for (var u in Users) {
    var newElement = document.createElement('div');
    var newName = document.createElement('span');
    newName.className = "col-md-6";
    newName.innerHTML = Users[u].user;
    var newGroup = document.createElement('span');
    newGroup.className = "col-md-6";
    newGroup.innerHTML = Users[u].group;
    newElement.id = u;
    newElement.className = "col-md-12";
    newElement.appendChild(newName);
    newElement.appendChild(newGroup);
    newElement.addEventListener("click", returnName(Users[u]));
    document.getElementById('showUsers').appendChild(newElement);
}

/*------ Modal -----*/
// Get the modal
var modal = document.getElementById('modal');
var modalUser = document.getElementById('modalUser');

// Get the button that opens the modal
var btn = document.getElementById("password");

// Get the <span> element that closes the modal
var span1 = document.getElementsByClassName("close")[0];
var span2 = document.getElementsByClassName("close")[1];

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span1.onclick = function() {
    modal.style.display = "none";
};
span2.onclick = function() {
    modalUser.style.display = "none";
};
function clickCancel() {
    modalUser.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};