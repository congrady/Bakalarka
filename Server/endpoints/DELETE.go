package endpoints

import (
	"fmt"
	"net/http"

	"../REST"
)

// DELETE deletes requested entry from database
func DELETE(w http.ResponseWriter, r *http.Request) {
	res, status, err := REST.DELETE(w, r)

	if err != nil {
		http.Error(w, err.Error(), status)
		return
	}

	w.WriteHeader(status)
	fmt.Fprint(w, res)
}
