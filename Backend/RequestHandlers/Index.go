package requestHandlers

import "net/http"

// Index responds with index.html (for every request except
// for more explicitly specified requests)
func Index(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	http.ServeFile(w, r, "../index.html")
}
