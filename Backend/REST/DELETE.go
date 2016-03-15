package REST

import (
	"database/sql"
	"fmt"
	"net/http"
	"strings"
)

// DELETE deletes requested entry from database
func DELETE(w http.ResponseWriter, r *http.Request) {
	urlParams := strings.Split(r.URL.Path[8:], "$")

	if len(urlParams) != 2 {
		wrongURLParamsAmount(w)
		return
	}

	if urlParams[0] == "" {
		missingPartError(w, "table")
		return
	}
	table := "`" + urlParams[0] + "`"

	where, errorType := parsePairQueryParam(urlParams[1])
	if errorType == "missing part error" {
		missingPartError(w, "where")
		return
	} else if errorType == "wrong format error" {
		wrongFormatError(w, "where")
		return
	}

	db, err := sql.Open("postgres", "user=root port=5432 dbname=UXPtests password=root sslmode=disable")
	if err != nil {
		http.Error(w, "Error opening database: "+err.Error(), http.StatusInternalServerError)
		return
	}

	_, err = db.Exec(fmt.Sprintf("DELETE FROM %s WHERE %s;", table, where))
	if err != nil {
		http.Error(w, "Error executing query: "+err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}
