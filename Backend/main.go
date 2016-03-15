package main

import (
	"net/http"

	"github.com/congrady/Bakalarka/Backend/REST"
	"github.com/congrady/Bakalarka/Backend/controllers"
<<<<<<< HEAD
	_ "github.com/lib/pq"
=======
	_ "github.com/mattn/go-sqlite3"
>>>>>>> 53256142f54cc1acb559b071f5f11fd9c5377732
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
<<<<<<< HEAD
=======
	http.HandleFunc("/GetTestNames", controllers.GetTestNames)
>>>>>>> 53256142f54cc1acb559b071f5f11fd9c5377732
	http.HandleFunc("/GetTestsInfo", controllers.GetTestsInfo)
	http.HandleFunc("/AddNewSegment", controllers.AddNewSegment)
	http.HandleFunc("/SaveNewTest", controllers.SaveNewTest)
	http.HandleFunc("/Login", controllers.Login)
	http.HandleFunc("/", controllers.Index)

<<<<<<< HEAD
	http.ListenAndServe(":8000", nil)
=======
	http.ListenAndServe(":8080", nil)
>>>>>>> 53256142f54cc1acb559b071f5f11fd9c5377732
}
