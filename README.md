# Bakalárka - UXP data processing

Projekt spracováva, vyhodnocuje a vizualizuje výstupy z UXP testovania.

Projekt je vytvorený vo frameworku congo-bongo.js (vo fáze vývoja).
Framework je vytvorený pre tvorbu SPA - single page applications.

Backende je v jazyk go-lang, z produkcie googlu https://golang.org/

Frontend je čisto javascriptový. Využíva aj niektoré funkcie Javascript-u 6 (Ecmascript 6)
Framework nevyužíva žiadne externé knižnice. Využíva najnovšie HTML5 a JS6 technológie (implementované už v dnešných browseroch).

Prioroty:

1. výkon 

2. prehľadnosť (rýchla "naučiteľnosť")

3. rozšíriteľnosť 

4. komfort pre developera 


Framework momentálne nemá podporu starých browserov. V budúcnosti nevylučujem implementáciu podpory pre tieto browsery.

-------------------------------------------------------
Štruktúra web aplikácie napísanej v congo-bongo.js

#Backend

**main.go**
(Súbor - back-end routing. Na všetky requesty (okrem resource requestov) odpovedá hlavnou stránkou - index.html. Vlastné SPA routovanie prebieha na frontende.)

#Frontend

**css**
(Zložka, obsahuje statické css súbory)



**data**
(Zložka, obsahuje statické dáta)

  ---- ***videos***
(Zložka, obsahuje video, napr. formát .mp4)

  ---- ***imgs***
(Zložka, obsahuje obrázky, napr. .jpg, .gif)

  ---- ***texts***
(Zložka, obsahuje textové súbory, napr. .txt)



**pages**
(Zložka, obsahuje .js súbory (1 js objekt pre 1 stránku/model))

  ---- ***html-schemas***
(Zložka, obsahuje .html súbory - len jednoduché kostry stránok a statický obsah pre danú stránku.)



**page-components**
(Zložka, obsahuje .js súbory, classy, ktoré reprezentujú komponent stránky - napr. input box, slider, a pod.)

  ---- ***html-schemas***
  (Zložka, obsahuje html súbory - len jednoduché kostry daných komponentov.)



**scripts**
(Zložka, obsahuje .js súbory - util funkcie, routing a súbory zodpovedné za fungovanie stránky/frameworku)
