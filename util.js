const divs = ["pick_symptoms", "chosen_symptoms", "possible_diseases"];

language = "EN";


function getLanguage() {
    var url = window.location.href.split("?");
    if (url.length < 2) return;
    switch (url[1]) {
        case "PT":
            language = "PT";
            break;
        case "ES":
            language = "ES";
            break;
        default:
            language = "EN";
            break;
    }
}
getLanguage();

var objs_array = [];

var symptoms = [];

var error = false;

function getSymptomsContent(path) {
    $.get(path, function(data) {
        readSymptoms(data);
    }, 'text');
}
function readSymptoms(data) {
    var lines = data.split("\n");
    if (lines[0].replace(/[^0-9a-z]/gi, '') != "SymptomAnalyserFile" || lines[1].replace(/[^0-9a-z]/gi, '') != "start") {
        error = true;
        return;
    }
    for (var i = 2; i < lines.length - 1; i++) {
        symptoms.push(lines[i].replace(/[^0-9a-z ]/gi, ''));
    }
    if (lines[lines.length - 1].replace(/[^0-9a-z]/gi, '') != "end") {
        error = true;
        return;
    }
}
getSymptomsContent("Info/" + language + "/symptoms.file");


var selected = [];


var diseases = [];

function addDisease(disease, disease_symptoms) {
    diseases.push([disease]);
    for (var j = 0; j < disease_symptoms.length; j++) {
        diseases[diseases.length - 1].push(disease_symptoms[j]);
    }
}

function getDiseasesContent(path) {
    $.get(path, function(data) {
        readDiseases(data);
    }, 'text');
}
function readDiseases(data) {
    var lines = data.split("\n");
    if (lines[0].replace(/[^0-9a-z]/gi, '') != "SymptomAnalyserFile" || lines[1].replace(/[^0-9a-z]/gi, '') != "start") {
        error = true;
        return;
    }
    var disease = "";
    var disease_symptoms = [];
    for (var i = 2; i < lines.length - 1; i++) {
        if (lines[i][0] == "@") {
            if (disease != "") {
                addDisease(disease, disease_symptoms);
                disease_symptoms = [];
            }
            disease = lines[i].replace("@", "").replace(/[^0-9a-z ]/gi, '');
        }
        if (lines[i][0] == "-") {
            disease_symptoms.push(lines[i].replace("-", ""));
        }
    }
    if (disease != "") {
        addDisease(disease, disease_symptoms);
        disease_symptoms = [];
    }
    if (lines[lines.length - 1].replace(/[^0-9a-z]/gi, '') != "end") {
        error = true;
    }
}
getDiseasesContent("Info/" + language + "/diseases.file");


function clearHtml(v) {
    try {
        document.getElementById(divs[v]).innerHTML = "";
    } catch(Exception) {}
}