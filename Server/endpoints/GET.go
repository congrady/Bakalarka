package endpoints

import (
	"fmt"
	"net/http"

	"../REST"
)

// GET sends requested entry from database
func GET(w http.ResponseWriter, r *http.Request) {
	res, status, err := REST.GET(w, r)

	if err != nil {
		http.Error(w, err.Error(), status)
		return
	}

	w.WriteHeader(status)
	fmt.Fprint(w, res)
}
