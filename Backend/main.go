package main

import (
	"net/http"

	"github.com/congrady/Bakalarka/Backend/REST"
	"github.com/congrady/Bakalarka/Backend/explicit"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	explicit.MakeResourceHandlers()

	http.HandleFunc("/GET/", REST.GET)
	http.HandleFunc("/GetTestNames", explicit.GetTestNames)
	http.HandleFunc("/GetTestsInfo", explicit.GetTestsInfo)
	http.HandleFunc("/AddNewSegment", explicit.AddNewSegment)
	http.HandleFunc("/SaveNewTest", explicit.SaveNewTest)
	http.HandleFunc("/Login", explicit.Login)
	http.HandleFunc("/", explicit.Index)

	http.ListenAndServe(":8080", nil)
}
