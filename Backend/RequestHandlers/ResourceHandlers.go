package RequestHandlers

import (
	"fmt"
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
	files := getFileNames("../Frontend")
	files = append(files, getFileNames("../data")...)
	for _, file := range files {
		fmt.Println(file[2:])
		http.HandleFunc(file[2:], SendResources)
	}
}

func getFileNames(folder string) []string {
	var res []string
	folders, _ := ioutil.ReadDir(folder)
	for _, content := range folders {
		if content.IsDir() {
			//fmt.Println(content.Name())
			res = append(res, getFileNames(folder+"/"+content.Name())...)
		} else {
			//fmt.Println(folder + "/" + content.Name())
			res = append(res, folder+"/"+content.Name())
		}
	}
	return res
}
