package main

import (
	"io/ioutil"
	"net/http"
)

func index(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "../index.html")
}

func sendResources(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "../"+r.URL.Path)
}

func main() {
	//Creates handlers to serve static resources
	directories, _ := ioutil.ReadDir("../Frontend")
	for _, directory := range directories {
		files, _ := ioutil.ReadDir("../Frontend/" + directory.Name())
		for _, file := range files {
			http.HandleFunc("/Frontend/"+directory.Name()+"/"+file.Name(), sendResources)
		}
	}

	http.HandleFunc("/", index)
	http.ListenAndServe(":8080", nil)
}
