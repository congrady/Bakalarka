package main

import (
	"fmt"
	"io"
	"io/ioutil"
	"mime"
	"net/http"
	"os"
	"path/filepath"

	_ "github.com/mattn/go-sqlite3"
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
	http.HandleFunc("/config.js", sendResources)
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
	password := r.PostFormValue("password")
	if login == "Matus" && password == "heslo" {
		userName := "Matus Congrady"
		fmt.Fprintf(w, "%s,%s", userName, "token")
	} else if login == "user123" && password == "heslo123" {
		userName := "Nahodny pouzivatel"
		fmt.Fprintf(w, "%s,%s", userName, "token")
	} else {
		http.Error(w, http.StatusText(403), 403)
	}
}

func saveNewTest(w http.ResponseWriter, r *http.Request) {
	infile, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Error parsing uploaded file: "+err.Error(), http.StatusBadRequest)
		return
	}
	outfile, err := os.Create("./data/" + header.Filename)
	if err != nil {
		http.Error(w, "Error saving file: "+err.Error(), http.StatusBadRequest)
		return
	}
	_, err = io.Copy(outfile, infile)
	if err != nil {
		http.Error(w, "Error saving file: "+err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Fprintln(w, "New test successfuly saved.")
}

func main() {
	makeResourceHandlers()

	http.HandleFunc("/saveNewTest", saveNewTest)
	http.HandleFunc("/login", login)
	http.HandleFunc("/", index)
	http.ListenAndServe(":8080", nil)
}
