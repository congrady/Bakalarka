package endpoints

import (
	"fmt"
	"net/http"

	"../REST"
)

// POST updates requested entry in database
func POST(w http.ResponseWriter, r *http.Request) {
	res, status, err := REST.POST(w, r)

	if err != nil {
		http.Error(w, err.Error(), status)
		return
	}

	w.WriteHeader(status)
	fmt.Fprint(w, res)
}
