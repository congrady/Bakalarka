package REST

import (
	"database/sql"
	"fmt"
	"net/http"
)

// POST updates requested columns of an entry
func POST(w http.ResponseWriter, r *http.Request) {
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
			where = "WHERE " + res
		}
	}

	columnPairsUnparsed := r.FormValue("columns")
	columnPairs := ""
	if whereUnparsed != "" {
		res, errorType := parsePairQueryParam(columnPairsUnparsed, ",")
		if errorType == "wrong format error" {
			wrongFormatError(w, "columns")
			return
		}
		if res != "" {
			columnPairs = "SET " + res
		}
	}

	db, err := sql.Open("postgres", "user=postgres port=5432 dbname=UXPtests password=root sslmode=disable")
	defer db.Close()
	if err != nil {
		http.Error(w, "Error opening database: "+err.Error(), http.StatusInternalServerError)
		return
	}

	query := fmt.Sprintf(`UPDATE %s %s %s;`, table, columnPairs, where)
	fmt.Println(query)

	_, err = db.Exec(query)
	if err != nil {
		http.Error(w, "Error executing query: "+err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}
