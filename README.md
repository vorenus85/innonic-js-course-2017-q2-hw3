Home work 3

Amikor betöltődik az oldal látni fogjuk az aktuális hetet, lapozhatunk előre, hátra a hetek között, ill. behozhatunk egy konkrét hetet is.
 
Az oldal tetején lesz egy gomb “új mozifilm regisztrációja”
 
Modális ablakban fog megjelenni egy regisztrációs űrlap, ajaxxal egy jsontömbbe kerül az
új film:
 
új film felvitele
cím
készítés dátuma (év)
kor besorolás
hossz
percben (nem lehet majd hosszabb 160 percnél, mert kell 20 perc a terem takarításra :-) )
műfaj
több is lehet
radio
rendező
több is lehet
string, gomb ajax új beviteli mező
szereplők
több is lehet
string, gomb ajax új beviteli mező
cselekmény
borítókép
ez egy url lesz, ami a kép urlje
validálni hogy kép-e, létezik e
 
 
A hét napokra lesz bontva látszódni fog a dátum is!
 
heti film lista
amikor bejön az oldal az adott hét filmjeit mutatja
ha az adott borító kép nem elérhető már no_image.png mutassa
új film felvitele az adott napra
tárolás jsonben
3 órás etapokban
16.00; 19.00; 22.00
validáció adott időpontban csak egy film szerepelhet
adott napon egyszerre több időpontot is ki lehet választani
navigáció
előre, hátra, ez a hét, adott hét
film törlése
