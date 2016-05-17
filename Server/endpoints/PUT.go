package endpoints

import (
	"fmt"
	"net/http"

	"../REST"
)

// PUT puts requested entry to database
// PUT is an idepotent operation
func PUT(w http.ResponseWriter, r *http.Request) {
	res, status, err := REST.PUT(w, r)

	if err != nil {
		http.Error(w, err.Error(), status)
		return
	}

	w.WriteHeader(status)
	fmt.Fprint(w, res)
}
