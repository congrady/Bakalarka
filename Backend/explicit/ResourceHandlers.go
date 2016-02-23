package explicit

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

// MakeResourceHandlers - creates resource handlers for every valid
// file on the server available to frontend (in Frontend/.. folder)
func MakeResourceHandlers() {
	http.HandleFunc("/config.js", SendResources)
	folders, _ := ioutil.ReadDir("../Frontend")
	for _, folder := range folders {
		files, _ := ioutil.ReadDir("../Frontend/" + folder.Name())
		for _, file := range files {
			if file.IsDir() {
				dataFolder, _ := ioutil.ReadDir("../Frontend/" + folder.Name() + "/" + file.Name())
				for _, dataFile := range dataFolder {
					path := "/Frontend/" + folder.Name() + "/" + file.Name() + "/" + dataFile.Name()
					http.HandleFunc(path, SendResources)
				}
			} else {
				path := "/Frontend/" + folder.Name() + "/" + file.Name()
				http.HandleFunc(path, SendResources)
			}
		}
	}
}
