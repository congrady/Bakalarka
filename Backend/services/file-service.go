package services

import (
	"io"
	"mime"
	"net/http"
	"os"
	"path/filepath"
)

func sendResources(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", mime.TypeByExtension(filepath.Ext(r.URL.Path)))
	http.ServeFile(w, r, "../"+r.URL.Path)
}

// SaveFile creates a file and copies contents of Reader to it
func SaveFile(filePath string, content io.Reader) error {
	file, err := os.Create(filePath)
	if err != nil {
		return err
	}
	if content != nil {
		_, err = io.Copy(file, content)
		if err != nil {
			return err
		}
	}

	http.HandleFunc(filePath[2:], sendResources)
	return nil
}
