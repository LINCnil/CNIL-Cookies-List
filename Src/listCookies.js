﻿/* generic error handler */
function onError(error) {
  console.log(error);
}

function onDownloadFailed(error) {
  console.log(`Download failed: ${error}`);
}
  
// *********************************************************************
//
// Sauvegarde au format PDF et CSV
//
// *********************************************************************

// Sauvegarde de la liste au format PDF et CSV
//
function Sauvegarde() 
{
	var options = { year: 'numeric', month: '2-digit', day: '2-digit' ,hour: '2-digit', minute:'2-digit', second:'2-digit'};

	var ficName = new Intl.DateTimeFormat("fr-FR", options).format(datePage)
	ficName = ficName.replaceAll('/','-');
	ficName = ficName.replaceAll(':','.');
	ficName ="ExportCookiesList du "+ ficName +".csv";

	var liste="";
	for (let ligne of TabCookies) 
		{
			liste+=ligne + String.fromCharCode(13)+ String.fromCharCode(10)
		}
			
	var blob = new Blob
	(
		[ liste ], // Blob parts.
		{
			type : "text/plain;charset=utf-8"
		}
	)
	var downloadUrl = URL.createObjectURL( blob );

	// Ecriture du fichier au format CSV
	var downloading = browser.downloads.download({
	  url : downloadUrl,
	  filename : ficName,
	  conflictAction : 'uniquify'
	});
	downloading.then(null, onDownloadFailed);

	// Ecriture du fichier au format PDF
	browser.tabs.saveAsPDF({})
		.then((status) => {
		  console.log(status);
		});
}

// **************************************************************************
// Liste les cookies et les sauvarde dans le tableau TabCookies
//
function listCookies() 
{
	let nb=1;
	var gettingAllCookies = browser.cookies.getAll({});
	gettingAllCookies.then((cookies) => 
	{		
		// Ancrage sur la balise du tableau
		var cookieTab = document.getElementById('cookies-tab');
	
		if (cookies.length > 0) 
		{
			// Affichage date du jour dans 'date'
			var nbElem = document.getElementById('nbCookies');	
			nbElem.appendChild(document.createTextNode(cookies.length +" "));
			
			// Tri des cookies par Domain/Path
			//
			var cookiesArray = new Array();
			
			for (let cookie of cookies) 
			{
				cookiesArray.push(cookie);
			}
			cookiesArray.sort
				(
				function sortCookies(a, b) 
					{
					  if (a.domain === b.domain)
						{
							// Même domain
							if (a.domain>b.path)
								return 1;
							if (b.domain>a.path)
								return -1;
							return 0;
						}
						else
						{
							// Domain différents
							if (a.domain>b.domain)
								return 1;
							if (b.domain>a.domain)
								return -1;
						}
					}
				);
			
			// Gnération du tableau CSV correspondant
			let lig=1;
			TabCookies.push("Num;Chemin complet;Domaine;Chemin;Name;Date Expiration;Restrictions;Valeur");
			for (let cookie of cookiesArray) 
			{
				let ligne=lig +";";
					
				if (cookie.path.endsWith('/'))
				{
					ligne +=cookie.domain + cookie.path + cookie.name + ";";
				}
				else
				{
					ligne +=cookie.domain + cookie.path + "/" + cookie.name + ";";
				}
										
				ligne +=cookie.domain + ";" + cookie.path + ";" + cookie.name + ";" 

				if (cookie.session)
				{
					ligne+="Session";
				}
				else
				{
					var date = new Date(cookie.expirationDate*1000);
					ligne+=date.toLocaleDateString() + " " + date.toLocaleTimeString();
				}
				ligne += ";";
								
				ligne+=(cookie.hostOnly?" host-only ":"");
				ligne+=(cookie.secure?" secure ":"");
				ligne+= ";";
				
				var value = cookie.value;
				value=value.replaceAll("\"","\"\"")
				ligne+="\"" + value + "\"";
				
				TabCookies.push(ligne);
				lig++;
			}
						
			// Affichage des cookies
			//
			
			let content;
			
			let lastDomain="";
		
			for (let cookie of cookiesArray) 
			{
				let tabLig = document.createElement("tr");
				let tabCel;
				let text;
				let content;
			
				if (lastDomain != cookie.domain)
				{
					// Changement de domaine
					tabCel = document.createElement("td");
					tabCel.colSpan = "5"
					tabCel.style = "font-weight : bold"
					tabCel.appendChild(document.createTextNode(cookie.domain));
										
					tabLig.appendChild(tabCel);
					
					// Ajout de la ligne au tableau
					cookieTab.appendChild(tabLig);
					lastDomain=cookie.domain;
					
					tabLig = document.createElement("tr");
				}
			
				// Numéro et bouton d'effacement
				tabCel = document.createElement("td");
				tabCel.style = "text-align:center";
				tabCel.appendChild(document.createTextNode(nb));
				
				tabCel.appendChild(document.createElement("br"));
				
				btt = tabCel.appendChild(document.createElement("button"));
				btt.appendChild(document.createTextNode("Effacer"));
				btt.addEventListener('click', event => {SuppressCookie(cookie,true)});

				tabLig.appendChild(tabCel);
								
				
				// Path
				tabCel = document.createElement("td");
				tabCel.appendChild(document.createTextNode(cookie.path));
				tabLig.appendChild(tabCel);
				
				// Nom et valeur du cookie
				tabCel = document.createElement("td");
				tabCel.appendChild(document.createTextNode(cookie.name));
				tabCel.appendChild(document.createElement("br"));
				let span=document.createElement("span");
				span.style="font-style: italic";
				span.appendChild(document.createTextNode((cookie.value.length>50?cookie.value.substr(0,50)+"...":cookie.value)));
				tabCel.appendChild(span);
				tabLig.appendChild(tabCel);
						
				// Date d'expiration ou cookie de session
				if (cookie.session)
				{
					tabCel = document.createElement("td");
					tabCel.appendChild(document.createTextNode("Session"));
					tabLig.appendChild(tabCel);
				}
				else
				{
					var date = new Date(cookie.expirationDate*1000);
					tabCel = document.createElement("td");
					tabCel.style = "text-align:center";
					tabCel.appendChild(document.createTextNode(date.toLocaleDateString()));
					tabCel.appendChild(document.createElement("br"));
					tabCel.appendChild(document.createTextNode(date.toLocaleTimeString()));
					tabLig.appendChild(tabCel);
				}
				
				// Secure et/ou host-only
				tabCel = document.createElement("td");
				tabCel.style = "text-align:center";
				tabCel.appendChild(document.createTextNode((cookie.hostOnly?"host-only":"")));
				tabCel.appendChild(document.createElement("br"));
				tabCel.appendChild(document.createTextNode((cookie.secure?"secure":"")));
				tabLig.appendChild(tabCel);
				
				nb = nb+1;
				
				// Ajout de la ligne au tableau
				cookieTab.appendChild(tabLig);
			}
						
		}
		else 
		{
			// Pas de cookie
			let tabLig = document.createElement("tr");
			tabCel = document.createElement("td");
			tabCel.colSpan = "5"
			tabCel.style = "font-weight : bold"
			tabCel.appendChild(document.createTextNode("Pas de cookies enregistrés dans le navigateur"));
								
			tabLig.appendChild(tabCel);
			
			// Ajout de la ligne au tableau
			cookieTab.appendChild(tabLig);
		}
	})
}

function SuppressAllCookies()
{
	if (window.confirm("Effacer tous les cookies ?")) 
	{ 
    	var gettingAllCookies = browser.cookies.getAll({});
		gettingAllCookies.then((cookies) => 
			{
				for (let cookie of cookies) 
				{
					SuppressCookie (cookie,false,false)
				}
				
				browser.tabs.reload();
			}
		)
	}
}

function SuppressCookie (cookie,refresh,confirme = true)
{
	const cookieName = cookie.name;
	const cookieProtocol = cookie.secure ? "https://" : "http://";
	const cookieUrl = cookieProtocol + cookie.domain + cookie.path;
	
	if (!confirme || window.confirm("Effacer le cookie '"+ cookieName +"' ?")) 
	{ 
		
		var removing = browser.cookies.remove({
		url: cookieUrl,
		name: cookie.name
		});
		
		removing.then(onRemoved, onError);
		
		if (refresh)
		{
			// On rafraichi la page
			browser.tabs.reload();
		}
	}
}

function onError(error) {
  console.log(`Error removing cookie: ${error}`);
}

function onRemoved(cookie) {
  console.log(`Removed: ${cookie}`);
}

// Affichage date du jour dans 'date'
var dateElem = document.getElementById('date');	
let datePage = new Date(Date.now());
dateElem.appendChild(document.createTextNode(datePage.toLocaleString()));

// Attache des évènements aux boutons
document.getElementById("btnEffCookies").addEventListener('click', SuppressAllCookies);
document.getElementById("btnExportXLS").addEventListener('click', Sauvegarde);


// Tableau contenant les cookies listés sur la page
var TabCookies = [];

// Affichage des cookies
listCookies();

