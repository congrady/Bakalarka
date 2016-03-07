package main

import (
	"net/http"

	"github.com/congrady/Bakalarka/Backend/REST"
	"github.com/congrady/Bakalarka/Backend/controllers"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	var folders []string
	folders = append(folders, "../Frontend", "../data")
	var files []string
	files = append(files, "../config.js")
	controllers.FileServer(folders, files)

	http.HandleFunc("/GET/", REST.GET)
	http.HandleFunc("/DELETE/", REST.DELETE)
	http.HandleFunc("/POST/", REST.POST)
	http.HandleFunc("/PUT/", REST.PUT)
	http.HandleFunc("/GetTestNames", controllers.GetTestNames)
	http.HandleFunc("/GetTestsInfo", controllers.GetTestsInfo)
	http.HandleFunc("/AddNewSegment", controllers.AddNewSegment)
	http.HandleFunc("/SaveNewTest", controllers.SaveNewTest)
	http.HandleFunc("/Login", controllers.Login)
	http.HandleFunc("/", controllers.Index)

	http.ListenAndServe(":8080", nil)
}
