package REST

import (
	"database/sql"
	"fmt"
	"net/http"
)

// DELETE deletes requested entry from database
func DELETE(w http.ResponseWriter, r *http.Request) {
	table := r.FormValue("table")
	if table == "" {
		missingPartError(w, "table")
		return
	}

	whereUnparsed := r.FormValue("where")
	where := ""
	if whereUnparsed != "" {
		res, errorType := parsePairQueryParam(whereUnparsed, "OR")
		if errorType == "wrong format error" {
			wrongFormatError(w, "where")
			return
		}
		if res != "" {
			where = " WHERE " + res
		}
	}

	db, err := sql.Open("postgres", "user=postgres port=5432 dbname=UXPtests password=root sslmode=disable")
	if err != nil {
		http.Error(w, "Error opening database: "+err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Println(fmt.Sprintf("DELETE FROM %s%s;", table, where))
	_, err = db.Exec(fmt.Sprintf("DELETE FROM %s%s;", table, where))
	if err != nil {
		http.Error(w, "Error executing query: "+err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(""))
}
