package REST

import (
	"database/sql"
	"fmt"
	"net/http"
	"strings"
)

// POST updates requested entry in a database
func POST(w http.ResponseWriter, r *http.Request) {
	urlParams := strings.Split(r.URL.Path[6:], "$")

	if len(urlParams) != 3 {
		wrongURLParamsAmount(w)
		return
	}

	table := "`" + urlParams[0] + "`"
	if urlParams[0] == "" {
		missingPartError(w, "table")
		return
	}

	update, errorType := parsePairQueryParam(urlParams[1])
	if errorType == "missing part error" {
		missingPartError(w, "update")
		return
	} else if errorType == "wrong format error" {
		wrongFormatError(w, "update")
		return
	}

	where, errorType := parsePairQueryParam(urlParams[2])
	if errorType == "missing part error" {
		missingPartError(w, "where")
		return
	} else if errorType == "wrong format error" {
		wrongFormatError(w, "where")
		return
	}

	db, err := sql.Open("postgres", "user=root port=8080 dbname=UXPtests password=root sslmode=disable")
	if err != nil {
		http.Error(w, "Error opening database: "+err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Println(fmt.Sprintf("UPDATE %s SET %s WHERE %s;", table, update, where))
	_, err = db.Exec(fmt.Sprintf("UPDATE %s SET %s WHERE %s;", table, update, where))
	if err != nil {
		http.Error(w, "Error executing query: "+err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}
