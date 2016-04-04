package services

import (
	"io/ioutil"
	"mime"
	"net/http"
	"path/filepath"
)

// SendResources - sets correct MIME type for requested resource and
// serves this file
func SendResources(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", mime.TypeByExtension(filepath.Ext(r.URL.Path)))
	http.ServeFile(w, r, "../"+r.URL.Path)
}

// FileServer - creates resource handlers for every valid
// file on the server available to frontend
func FileServer(folders []string, files []string) {
	var filePaths []string
	for _, file := range folders {
		filePaths = append(filePaths, getFileNames(file)...)
	}
	for _, filePath := range files {
		filePaths = append(filePaths, filePath)
	}
	for _, file := range filePaths {
		http.HandleFunc(file[2:], SendResources)
	}
}

func getFileNames(folder string) []string {
	var res []string
	folders, _ := ioutil.ReadDir(folder)
	for _, content := range folders {
		if content.IsDir() {
			res = append(res, getFileNames(folder+"/"+content.Name())...)
		} else {
			res = append(res, folder+"/"+content.Name())
		}
	}
	return res
}
