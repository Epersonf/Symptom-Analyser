var actualized = false;

var filter = "";
function search() {
    filter = document.getElementById("search_input").value;
    actualized = false;
}


function selectSymptom(name) {
    if (symptoms.indexOf(name) == -1) {
        return;
    }
    actualized = false;
    if (selected.indexOf(name) == -1) {
        selected.push(name);
        return;
    }
    selected.splice(selected.indexOf(name), 1);
}


class Symptom_BTN {
    constructor(name, div) {
        this.name = name;
        this.obj = document.createElement("div");
        this.obj.innerHTML = "• " + name;
        this.obj.className = "Object";
        this.obj.setAttribute("onclick", "selectSymptom('" + name +"')");
        this.main_div = document.getElementById(divs[div]);
        this.main_div.appendChild(this.obj);
    }
}

function loop() {
    if (filter != "") {
        document.getElementById("img_find").style.opacity = 0.4;
    } else {
        document.getElementById("img_find").style.opacity = 1;
    }

    if (actualized) {
        window.requestAnimationFrame(loop);
        return;
    }

    actualized = true;


    for (var i = 0; i < 3; i ++) {
        clearHtml(i);
    }
    
    actualizeSymptoms();

    actualizeSelected();

    actualizeDiseases();

    if (($("#pick_symptoms").contents().length == 0 && selected.length == 0)) {
        actualized = false;
    }

    
    $(function() {
        $("#search_input").autocomplete({
            lookup: symptoms
        });
    });

    window.requestAnimationFrame(loop);
}

function actualizeSymptoms() {
    for (var i = 0; i < symptoms.length; i++) {
        if ((!symptoms[i].toLowerCase().includes(filter.toLowerCase()) && (filter != "" || filter != undefined)) || selected.indexOf(symptoms[i]) != -1) {
            continue;
        }
        objs_array.push(new Symptom_BTN(symptoms[i], 0));
    }
}

function actualizeSelected() {
    for (var i = 0; i < selected.length; i++) {
        objs_array.push(new Symptom_BTN(selected[i], 1));
    }
}

function actualizeDiseases() {
    for (var i = 0; i < diseases.length; i++) {
        var disease_name = diseases[i][0];
        var j;
        for (j = 1; j < diseases[i].length; j++) {
            var splitted = diseases[i][j].split("/");
            var found = false;
            for (var k = 0; k < splitted.length; k++) {
                var symp = splitted[k].replace(/[^0-9a-z ]/gi, '');
                if (selected.indexOf(symp) != -1) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                break;
            }
        }
        if (j == diseases[i].length) {
            objs_array.push(new Symptom_BTN(disease_name, 2));
        }
    }
}

$("#pick_symptoms").ready(function() {
    window.requestAnimationFrame(loop);
    actualized = false;
});


var input = document.getElementById("search_input");

input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("img_find").click();
    }
});

document.getElementById("img_find").ondragstart = function() {
    return false;
}

$("body").on("contextmenu", "img", function(e) {
    return false;
});

function changeLanguage(lan) {
    var split = window.location.href.split("?");
    window.location.replace(split[0] + "?" + lan);
}