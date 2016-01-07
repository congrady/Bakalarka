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
Backend routing. Na všetky requesty (okrem resource requestov a login-u) odpovedá hlavnou stránkou - index.html. Vlastné SPA routovanie prebieha na frontende.

#Frontend

//Todo
