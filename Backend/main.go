package main

import (
	"fmt"
	"io/ioutil"
	"mime"
	"net/http"
	"path/filepath"
)

func index(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	http.ServeFile(w, r, "../index.html")
}

func sendResources(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", mime.TypeByExtension(filepath.Ext(r.URL.Path)))
	http.ServeFile(w, r, "../"+r.URL.Path)
}

func makeResourceHandlers() {
	folders, _ := ioutil.ReadDir("../Frontend")
	for _, folder := range folders {
		files, _ := ioutil.ReadDir("../Frontend/" + folder.Name())
		for _, file := range files {
			if file.IsDir() {
				dataFolder, _ := ioutil.ReadDir("../Frontend/" + folder.Name() + "/" + file.Name())
				for _, dataFile := range dataFolder {
					path := "/Frontend/" + folder.Name() + "/" + file.Name() + "/" + dataFile.Name()
					http.HandleFunc(path, sendResources)
				}
			} else {
				path := "/Frontend/" + folder.Name() + "/" + file.Name()
				http.HandleFunc(path, sendResources)
			}
		}
	}
}

func login(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	login := r.PostFormValue("login")
	fmt.Fprintf(w, "%s,%s", login, "token")
}

func main() {
	makeResourceHandlers()

	http.HandleFunc("/login", login)
	http.HandleFunc("/", index)
	http.ListenAndServe(":8080", nil)
}

/*
var availableHandlers []string
handlers, _ := ioutil.ReadDir("../Frontend/pages")
for _, handler := range handlers {
	availableHandlers := handler.Name()
}

func index(availableHandlers *[]string) http.HandlerFunc {
	urlPath = r.URL.Path
	for (i := 0; i < len(*availableHandlers)); i++ {
		if (*availableHandlers == urlPath) {
			return func(w http.ResponseWriter, r *http.Request) {
				w.Header().Set("Content-Type", "text/html")
				http.ServeFile(w, r, "../index.html")
			}
		}
		return func(w http.ResponseWriter, r *http.Request) {
			http.ServeFile(w, r, "../sdgksdflkgjfdlkgndfjklgn")
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

func getHTML(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	var res = "<p>Ahoj</p>"
	fmt.Fprint(w, res)
}*/
