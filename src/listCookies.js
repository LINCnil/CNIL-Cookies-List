const TICK = String.fromCharCode(0x2713);
const DATENOW = new Date(Date.now());

var COLSWIDTH;
var lCookies = Object();
let filename = "export_cookies_list_" + DATENOW.toLocaleDateString() + "T" + DATENOW.toLocaleTimeString();
filename = filename.replaceAll("/", "-");
filename = filename.replaceAll(":", ".");

var file_content = "Num;Domaine;Chemin;Nom;Valeur;Expiration;sameSite;httpOnly;hostOnly;isSecure\r\n";
let cookiestab;

window.onload = function() {
    document.getElementById("date").textContent = DATENOW.toLocaleString();
    document.getElementById("btnEffCookies").addEventListener("click", suppressAllCookies);
    document.getElementById("btnExportPDF").addEventListener("click", sauvegardePDF);
    document.getElementById("btnExportCSV").addEventListener("click", sauvegardeCSV);

    COLSWIDTH = document.querySelector("thead > tr").childElementCount;

    // Tableau contenant les cookies listés sur la page
    cookiestab = document.getElementById("cookiesTab");

    // Affichage des cookies
    listCookies();
};

/*
 * Écrit la liste des cookies dans le tableau HTML
 */
function listCookies() {
    var gettingAllCookies = chrome.cookies.getAll({});
    gettingAllCookies.then((cookies) => {
        lCookies = cookies;
        insertCookiesInTab(lCookies);
    });
}

function insertCookiesInTab(cookies) {
    let nbCookies = cookies.length;
    if (nbCookies == 0) {
        document.getElementById("nbCookies").textContent = "Aucun";
    } else {
        document.getElementById("nbCookies").textContent = nbCookies;
    }

    let pluralMark = nbCookies > 1 ? "s" : "";
    document.getElementById("cookiesPlural_1").textContent = pluralMark;
    document.getElementById("cookiesPlural_2").textContent = pluralMark;

    var domainTabs = Object();
    var domainCookies = Object();
    var cookie;
    for (cookie of cookies) {
        if (!domainTabs.hasOwnProperty(cookie.domain)) {
            let subtab = createDomainSection(cookie.domain);
            cookiestab.appendChild(subtab);

            domainTabs[cookie.domain] = subtab;
            domainCookies[cookie.domain] = Array()
        }

        domainCookies[cookie.domain].push(cookie);
    }

    var cntr = 0;
    for (domain in domainCookies) {
        for (cookie of domainCookies[domain]) {
            cntr += 1;
            let trcookie = createCookieRow(cookie, cntr);
            domainTabs[domain].appendChild(trcookie);
        }
    }
}

function createDomainSection(domain) {
    let subtab = document.createElement("tbody");
    let trsubtab = document.createElement("tr");
    let tdsubtab = document.createElement("td");

    tdsubtab.setAttribute("class", "domainName");
    tdsubtab.colSpan = COLSWIDTH;
    tdsubtab.textContent = domain;

    trsubtab.appendChild(tdsubtab);
    subtab.appendChild(trsubtab);

    return subtab;
}

function createCookieRow(cookie, cntr) {
	let cookierow = document.createElement("tr");
	var file_line = "";

    let actioncell = document.createElement("td");
    actioncell.setAttribute("class", "action");
    actioncell.appendChild(document.createTextNode(cntr));
    actioncell.appendChild(createCookieActionButtons(cookie));
    file_line += String(cntr) + ";" + cookie.domain + ";";

    let pathcell = document.createElement("td");
    pathcell.setAttribute("class", "path");
    pathcell.textContent = cookie.path;
    file_line += cookie.path + ";"

    let valnamecell = document.createElement("td");
    valnamecell.setAttribute("class", "wrap valname");
    valnamecell.appendChild(document.createTextNode(cookie.name));
    valnamecell.appendChild(document.createElement("br"));
    file_line += cookie.name + ";";

    let cookievalcellpart = document.createElement("i");
    var displayval = cookie.value;
    if (cookie.value.length > 120) {
        displayval = cookie.value.substr(0, 120) + "...";
        cookievalcellpart.setAttribute("title", cookie.value);
    }
    
    cookievalcellpart.textContent = displayval;
    valnamecell.appendChild(cookievalcellpart);
    file_line += cookie.value + ";";

    let expcell = document.createElement("td");
    expcell.setAttribute("class", "property");
    if (cookie.hasOwnProperty("expirationDate")) {
        expcell.textContent = (new Date(cookie.expirationDate * 1000)).toLocaleString();
    } else if (cookie.session = true) {
        expcell.textContent = "session";
    } else {
        expcell.textContent = "/";
    }
    file_line += expcell.textContent + ";";

    let samesitecell = document.createElement("td");
    samesitecell.setAttribute("class", "property");
    samesitecell.textContent = cookie.sameSite;
    file_line += cookie.sameSite + ";";

    let httponlycell = document.createElement("td");
    httponlycell.setAttribute("class", "property");
    httponlycell.textContent = cookie.httpOnly ? TICK : "";
    file_line += (cookie.httpOnly ? "oui" : "non") + ";";

    let hostonlycell = document.createElement("td");
    hostonlycell.setAttribute("class", "property");
    hostonlycell.textContent = cookie.hostOnly ? TICK : "";
    file_line += (cookie.hostOnly ? "oui" : "non") + ";";

    let securecell = document.createElement("td");
    securecell.setAttribute("class", "property");
    securecell.textContent = cookie.secure ? TICK : "";
    file_line += (cookie.secure ? "oui" : "non") + "\r\n";

    cookierow.appendChild(actioncell);
    cookierow.appendChild(pathcell);
    cookierow.appendChild(valnamecell);
    cookierow.appendChild(expcell);
    cookierow.appendChild(samesitecell);
    cookierow.appendChild(httponlycell);
    cookierow.appendChild(hostonlycell);
    cookierow.appendChild(securecell);

    file_content += file_line;
    return cookierow;
}

function createCookieActionButtons(cookie) {
    let spanactionbuttons = document.createElement("span");
    spanactionbuttons.setAttribute("class", "cookieActionButtons");

    let imgTrash = document.createElement("img");
    imgTrash.setAttribute("class", "actionIcon noPrint");
    imgTrash.setAttribute("src", "icons/trash.svg");
    imgTrash.setAttribute("width", "20px");

    imgTrash.addEventListener("click", event => {
        deleteCookie(cookie, true);
    });

    spanactionbuttons.appendChild(imgTrash);
    return spanactionbuttons
}

function deleteCookie(cookie, refresh, confirme=true) {
    let cookieName = cookie.name;
    let cookieProtocol = cookie.secure ? "https://" : "http://";
    let cookieUrl = cookieProtocol + cookie.domain + cookie.path;

    if (!confirme || window.confirm("Effacer le cookie '" + cookieName + "' ?")) { 
        var removing = chrome.cookies.remove({
            url: cookieUrl,
            name: cookie.name
        });

        removing.then(onRemoved, onError);
        if (refresh) {
            chrome.tabs.reload();
        }
    }
}

function suppressAllCookies() {
    if (window.confirm("Effacer tous les cookies ?")) {
        var gettingAllCookies = chrome.cookies.getAll({});
        gettingAllCookies.then((cookies) => {
            for (let cookie of cookies) {
                deleteCookie(cookie, false, false);
            }

            chrome.tabs.reload();
        });
    }
}

function sauvegardePDF() {
    let titlepage = document.title;
    document.title = filename + ".pdf";
    window.print();
    document.title = titlepage;
}

function sauvegardeCSV() {
    var ficName = filename + ".csv";
    var blob = new Blob([file_content], { type : "text/csv;charset=utf-8" });
    var downloadUrl = URL.createObjectURL( blob );

    var downloading = chrome.downloads.download({
        url : downloadUrl,
        filename : ficName,
        conflictAction : 'uniquify'
    });
    downloading.then(null, onDownloadFailed);
}

function onError(error) {
    console.log(`Error removing cookie: ${error}`);
}

function onRemoved(cookie) {
    console.log(`Removed: ${cookie}`);
}

function onDownloadFailed(error) {
  console.log(`Download failed: ${error}`);
}
