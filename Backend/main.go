package main

import (
	"fmt"
	"net/http"

	"github.com/congrady/Bakalarka/Backend/requestHandlers"
	_ "github.com/mattn/go-sqlite3"
)

func get(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, `{
    "glossary": {
        "title": "example glossary",
		"GlossDiv": {
            "title": "S",
			"GlossList": {
                "GlossEntry": {
                    "ID": "SGML",
					"SortAs": "SGML",
					"GlossTerm": "Standard Generalized Markup Language",
					"Acronym": "SGML",
					"Abbrev": "ISO 8879:1986",
					"GlossDef": {
                        "para": "A meta-markup language, used to create markup languages such as DocBook.",
						"GlossSeeAlso": ["GML", "XML"]
                    },
					"GlossSee": "markup"
                }
            }
        }
    }
}`)
}

func main() {
	requestHandlers.MakeResourceHandlers()

	http.HandleFunc("/Get/", get)
	http.HandleFunc("/GetTestNames", requestHandlers.GetTestNames)
	http.HandleFunc("/GetTestsInfo", requestHandlers.GetTestsInfo)
	http.HandleFunc("/AddNewSegment", requestHandlers.AddNewSegment)
	http.HandleFunc("/SaveNewTest", requestHandlers.SaveNewTest)
	http.HandleFunc("/Login", requestHandlers.Login)
	http.HandleFunc("/", requestHandlers.Index)
	http.ListenAndServe(":8080", nil)
}
