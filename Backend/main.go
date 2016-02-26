package main

import (
	"net/http"

	"github.com/congrady/Bakalarka/Backend/REST"
	"github.com/congrady/Bakalarka/Backend/RequestHandlers"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	RequestHandlers.MakeResourceHandlers()

	http.HandleFunc("/GET/", REST.GET)
	http.HandleFunc("/GetTestNames", RequestHandlers.GetTestNames)
	http.HandleFunc("/GetTestsInfo", RequestHandlers.GetTestsInfo)
	http.HandleFunc("/AddNewSegment", RequestHandlers.AddNewSegment)
	http.HandleFunc("/SaveNewTest", RequestHandlers.SaveNewTest)
	http.HandleFunc("/Login", RequestHandlers.Login)
	http.HandleFunc("/", RequestHandlers.Index)

	http.ListenAndServe(":8080", nil)
}
