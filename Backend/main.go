package main

import (
	"net/http"

	"github.com/congrady/Bakalarka/Backend/requestHandlers"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	requestHandlers.MakeResourceHandlers()

	http.HandleFunc("/getTestNames", requestHandlers.GetTestNames)
	http.HandleFunc("/addNewSegment", requestHandlers.AddNewSegment)
	http.HandleFunc("/saveNewTest", requestHandlers.SaveNewTest)
	http.HandleFunc("/login", requestHandlers.Login)
	http.HandleFunc("/", requestHandlers.Index)
	http.ListenAndServe(":8080", nil)
}
