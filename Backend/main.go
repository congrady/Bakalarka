package main

import (
	"net/http"

	"github.com/congrady/Bakalarka/Backend/endpoints"

	_ "github.com/lib/pq"
)

func main() {
	var folders []string
	folders = append(folders, "../Frontend", "../data")
	var files []string
	files = append(files, "../dataModels.js")
	endpoints.FileServer(folders, files)

	http.HandleFunc("/GET/", endpoints.GET)
	http.HandleFunc("/DELETE/", endpoints.DELETE)
	http.HandleFunc("/POST/", endpoints.POST)
	http.HandleFunc("/PUT/", endpoints.PUT)

	http.HandleFunc("/AddNewSegment", endpoints.AddNewSegment)
	http.HandleFunc("/SaveNewTest", endpoints.SaveNewTest)
	http.HandleFunc("/Login", endpoints.Login)
	http.HandleFunc("/GenerateHeatMap", endpoints.GenerateHeatMap)
	http.HandleFunc("/", endpoints.Index)

	http.ListenAndServe(":8000", nil)
}
