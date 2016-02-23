package explicit

import (
	"mime"
	"net/http"
	"path/filepath"
)

// Index responds with index.html (for every request except
// for more specific requests)
func Index(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", mime.TypeByExtension(filepath.Ext(r.URL.Path)))
	http.ServeFile(w, r, "../index.html")
}
