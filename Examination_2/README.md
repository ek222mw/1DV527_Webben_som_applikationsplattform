#Installationsinstruktioner för Webb API
Steg 1. Installera mongoDB lokalt och sedan kommandot use catchDB  
Steg 2. npm install  
Steg 3. Följ Postman collection uppifrån och ner  
Steg 4. Lägg till en användare sedan autentisera.  

#Frågor för examination 2
##How have you implemented the idea of HATEOAS in your API? Motivate your choices and how it support the idea of HATEOAS!
Jag har implementerat idén av HATEOAS i mitt api. Jag använt HATEOAS för göra det lätt för användaren att förstå APÌ:et utan behöva läsa massa med dokumentation på github. Istället kan användaren läsa om varje resurs i API:et genom olika länk adresser. Idén bygger på att användaren kan klicka sig fram till olika resurser i form av hyperlänkar i exempelvis Postman för Google Chrome eller i en vanlig webbläsare utan att behöva mata in dessa i adressfältet. HATEOAS bygger mycket på att användaren kan orientera sig i API:et utan att behöva en massa med extra dokumentation.
##If your solution should implement multiple representations of the resources. How would you do it?
Jag skulle bygga det så att användaren fick skicka upp en accept header till API:et för önskad resurs och sedan få svaret i det som accept headern beskriver.
##Motivate and defend your authentication solution? Why did you choose the one you did? Pros/Cons.
Jag valde JSONWebToken(JWT eller JOT) för man kan välja utgångstid för JWT, vilket innebär att JWT värdet ändras efter exempelvis 15 minuter och om någon kommer över detaljerna så ändras den snart och attackeraren hinner troligtvis inte göra så mycket om den kommer över den. Ihop med HTTPS så funkar JWT bra eftersom all trafik som skickas är skyddad, dvs. användarnamn och lösenord som skickas till servern är i klartext, men med HTTPS så förblir den krypterad för externa lyssnare. Jag valde JWT också för att den är enkel att implementera och använda i olika anrop till och från API:et. Fördelarna med JWT är att man inte behöver använda någon databas, enkel att använda, kan användas över flera olika tjänster inom systemet. Nackdelarna är att JWT baseras på en hemlig nyckel och om den läcker ut så exponeras all känslig information. Fler nackdelar är JWT tokens har en begränsning i storleken, det är även omöjligt att förstöra/återkalla en JTW token.
##Explain how your web hook works.
Användaren registrerar en giltig webb-hook adress med JWT verifiering, när en ny fångst skapas så skickas en webb-hook ut till den angivna adressen med fångstens detaljer.
##Since this is your first own web API there are probably things you would solve in an other way looking back at this assignment. Write your thoughts down.
Jag skulle troligen spara alla mina webb-hook adresser i en databas istället för i en JSON fil. Skulle troligtvis gjort en större implementation angående funktioner för andra resurser som exempelvis webhooks, dvs. kunna editera en webhook, ta bort en webhook, läsa en specifik webhook och att koppla en specifik webhook till en specifik användare. Skulle även ha implementerat admin funktionalitet så att en admin användare kan ta bort, redigera och lägga till saker för en annan användare.
##Did you do something extra besides the fundamental requirements? Explain them.
Jag adderade HTTPS för att jag använder JWT och vill med det skydda att användardetaljer skickas i klartext.
