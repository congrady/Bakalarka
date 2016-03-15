package REST

import (
	"database/sql"
	"fmt"
	"net/http"
	"strings"
)

// Todo

// PUT creates or updates requested entry in a database
func PUT(w http.ResponseWriter, r *http.Request) {
	urlParams := strings.Split(r.URL.Path[5:], "$")

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

<<<<<<< HEAD
	db, err := sql.Open("postgres", "user=root port=8080 dbname=UXPtests password=root sslmode=disable")
	if err != nil {
		http.Error(w, "Error opening database: "+err.Error(), http.StatusInternalServerError)
=======
	db, err := sql.Open("sqlite3", "UXPtests.db")
	if err != nil {
		http.Error(w, "Error opening database: "+err.Error(), http.StatusBadRequest)
>>>>>>> 53256142f54cc1acb559b071f5f11fd9c5377732
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
