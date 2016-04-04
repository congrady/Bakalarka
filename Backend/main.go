package main

import (
	"net/http"

	"github.com/congrady/Bakalarka/Backend/REST"
	"github.com/congrady/Bakalarka/Backend/services"

	_ "github.com/lib/pq"
)

func main() {
	var folders []string
	folders = append(folders, "../Frontend", "../data")
	var files []string
	files = append(files, "../dataModels.js")
	services.FileServer(folders, files)

	http.HandleFunc("/GET/", REST.GET)
	http.HandleFunc("/DELETE/", REST.DELETE)
	http.HandleFunc("/POST/", REST.POST)
	http.HandleFunc("/PUT/", REST.PUT)

	http.HandleFunc("/AddNewSegment", services.AddNewSegment)
	http.HandleFunc("/SegmentsCount/", services.SegmentsCount)
	http.HandleFunc("/SaveNewTest", services.SaveNewTest)
	http.HandleFunc("/Login", services.Login)
	http.HandleFunc("/", services.Index)

	http.ListenAndServe(":8000", nil)
}
