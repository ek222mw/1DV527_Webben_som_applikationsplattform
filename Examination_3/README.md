# 1dv527 - Grupp D
## Gruppmedlemmar:
Mikael Edberg(me222rs), Emil Karlsson(ek222mw), Rasmus Karlsson(rk222gg)

## Installationsdetaljer
Här finns användargränssnittet: https://dv-rpi3.lnu.se:20443/pi/resources/ui  
Här finns REST api:ets root: https://dv-rpi3.lnu.se:20443/pi/resources/  
Koden för att stänga av larmet från användargränssnittet: 1234  
Inbjudningslänk till discord: https://discord.gg/YAMruf7  
Postman collection: Det finns en postman collection i repositoriet med ett par requests som går göra för att få reda på status på de olika sensorerna och lamporna.  
Lösenord för autentisering: thisisthepass  

## Gruppens redovisning
Vår web thing är ett inbrottslarm som aktiveras så fort något rör sig framför den infraröda sensorn. När larmet går lyser endast den röda lampan och ett meddelande skickas till discord (länk finns ovan) att larmet har gått. Om larmet inte har gått så lyser endast den gröna lampan. Det finns en knapp på raspberryn som går att trycka på för att avaktivera larmet. När larmet avaktiveras så kommer den gröna lampan att tändas.

Till vårt larm finns den ett user interface som består av en webbsida som pratar med ett REST api där det går att se larmets status samt en knapp för att avaktivera larmet (kod: 1234). Vi använder sockets och när någonting händer med sensorn eller knappen skickas senaste statusen till UI:et om online och även offline notifikationer till discord. Vi använder oss av direct integration pattern och kopplar upp oss mot raspberryn genom Wifi. I första lagret i Web of Things modellen använder vi oss av  HTTP, REST API, JSON, Websockets, Webhooks och HTML. I det andra lagret är det HATEOAS och Web Of Thing Model. I lager nummer tre som är share använder vi oss av JWT och TLS(HTTPS). I sista lagret använder vi oss av en Web application. Vi följer de flesta modellerna som tas upp i boken,det som vi inte följer är websockets som skulle ha körts som en egen server, istället använder vi oss av Socket.io.
