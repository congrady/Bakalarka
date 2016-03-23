package main

import (
	"net/http"

	"github.com/congrady/Bakalarka/Backend/REST"
	"github.com/congrady/Bakalarka/Backend/controllers"

	_ "github.com/lib/pq"
)

func main() {
	var folders []string
	folders = append(folders, "../Frontend", "../data")
	var files []string
	files = append(files, "../dataModels.js")
	controllers.FileServer(folders, files)

	http.HandleFunc("/GET/", REST.GET)
	http.HandleFunc("/DELETE/", REST.DELETE)
	http.HandleFunc("/POST/", REST.POST)
	http.HandleFunc("/PUT/", REST.PUT)

	http.HandleFunc("/AddNewSegment", controllers.AddNewSegment)
	http.HandleFunc("/SaveNewTest", controllers.SaveNewTest)
	http.HandleFunc("/Login", controllers.Login)
	http.HandleFunc("/", controllers.Index)

	http.ListenAndServe(":8000", nil)
}
