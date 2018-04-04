// Fonction listant les cookies dans le tableau 'cookies-tab'
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
			
				// Numéro
				tabCel = document.createElement("td");
				tabCel.style = "text-align:center";
				tabCel.appendChild(document.createTextNode(nb));
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
 
// Affichage date du jour dans 'date'
var dateElem = document.getElementById('date');	
let date = new Date(Date.now());
dateElem.appendChild(document.createTextNode(date.toLocaleString()));

// Listage des cookies
listCookies();