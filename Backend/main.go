package main

import (
	"net/http"

	"github.com/congrady/Bakalarka/Backend/services"

	_ "github.com/lib/pq"
)

func main() {
	var folders []string
	folders = append(folders, "../Frontend", "../data")
	var files []string
	files = append(files, "../dataModels.js")
	services.FileServer(folders, files)

	http.HandleFunc("/GET/", services.GET)
	http.HandleFunc("/DELETE/", services.DELETE)
	http.HandleFunc("/POST/", services.POST)
	http.HandleFunc("/PUT/", services.PUT)

	http.HandleFunc("/AddNewSegment", services.AddNewSegment)
	http.HandleFunc("/SaveNewTest", services.SaveNewTest)
	http.HandleFunc("/Login", services.Login)
	http.HandleFunc("/", services.Index)

	http.ListenAndServe(":8000", nil)
}
