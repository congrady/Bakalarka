package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"path/filepath"
)

func index(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "../index.html")
}

func sendResources(contentType string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", contentType)
		http.ServeFile(w, r, "../"+r.URL.Path)
	}
}

func cssResourceHandler() {
	contentType := "text/css"
	files, _ := ioutil.ReadDir("../Frontend/css")
	for _, file := range files {
		http.HandleFunc("/Frontend/css/"+file.Name(), sendResources(contentType))
	}
}

func scriptsResourceHandler() {
	contentType := "application/javascript"
	files, _ := ioutil.ReadDir("../Frontend/scripts")
	for _, file := range files {
		http.HandleFunc("/Frontend/scripts/"+file.Name(), sendResources(contentType))
	}
}

func dataResourceHandler() {
	videos, _ := ioutil.ReadDir("../Frontend/data/videos")
	for _, video := range videos {
		filePath := "/Frontend/data/videos/" + video.Name()
		fileExtension := filepath.Ext("../" + filePath)
		if fileExtension == ".mp4" {
			http.HandleFunc(filePath, sendResources("video/mp4"))
		}
	}
	imgs, _ := ioutil.ReadDir("../Frontend/data/imgs")
	for _, img := range imgs {
		filePath := "/Frontend/data/imgs/" + img.Name()
		fileExtension := filepath.Ext("../" + filePath)
		if fileExtension == ".jpg" || fileExtension == "jpeg" {
			http.HandleFunc(filePath, sendResources("image/jpeg"))
		}
		if fileExtension == ".gif" {
			http.HandleFunc(filePath, sendResources("image/gif"))
		}
	}
	texts, _ := ioutil.ReadDir("../Frontend/data/texts")
	for _, text := range texts {

		filePath := "/Frontend/data/texts/" + text.Name()
		fileExtension := filepath.Ext("../" + filePath)
		if fileExtension == ".txt" {
			http.HandleFunc(filePath, sendResources("text/plain"))
		}
	}
}

func pagesResourceHandler() {
	contents, _ := ioutil.ReadDir("../Frontend/pages")
	for _, content := range contents {
		if content.IsDir() {
			files, _ := ioutil.ReadDir("../Frontend/pages/html-schemas")
			for _, file := range files {
				http.HandleFunc("/Frontend/pages/html-schemas/"+file.Name(), sendResources("text/html"))
			}
		} else {
			http.HandleFunc("/Frontend/pages/"+content.Name(), sendResources("application/javascript"))
		}
	}
}

func pageComponentsResourceHandler() {
	contents, _ := ioutil.ReadDir("../Frontend/page-components")
	for _, content := range contents {
		if content.IsDir() {
			files, _ := ioutil.ReadDir("../Frontend/page-components/html-schemas")
			for _, file := range files {
				http.HandleFunc("/Frontend/page-components/html-schemas/"+file.Name(), sendResources("text/html"))
			}
		} else {
			http.HandleFunc("/Frontend/page-components/"+content.Name(), sendResources("application/javascript"))
		}
	}
}

func getPageNames(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/javascript")
	var res = ""
	contents, _ := ioutil.ReadDir("../Frontend/pages")
	for _, content := range contents {
		if !content.IsDir() {
			res += content.Name() + ","
		}
	}
	fmt.Fprint(w, res[:len(res)-1])
}

func main() {
	//Create handlers to serve static resources
	cssResourceHandler()
	scriptsResourceHandler()
	dataResourceHandler()
	pagesResourceHandler()
	pageComponentsResourceHandler()

	http.HandleFunc("/pageNames", getPageNames)
	http.HandleFunc("/", index)
	http.ListenAndServe(":8080", nil)
}
