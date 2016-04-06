package REST

import (
	"database/sql"
	"fmt"
	"net/http"
)

// POST updates requested columns of an entry
func POST(w http.ResponseWriter, r *http.Request) (string, int, error) {
	table := r.FormValue("table")

	if table == "" {
		return missingPartError("table")
	}

	whereUnparsed := r.FormValue("where")
	where := ""
	if whereUnparsed != "" {
		res, err := parsePairQueryParam(whereUnparsed, "OR")
		if err != nil {
			return parsingError(err, "where")
		}
		where = "WHERE " + res
	}

	columnPairsUnparsed := r.FormValue("columns")
	columnPairs := ""
	if columnPairsUnparsed != "" {
		res, err := parsePairQueryParam(columnPairsUnparsed, ",")
		if err != nil {
			return parsingError(err, "columns")
		}
		columnPairs = "SET " + res
	}

	db, err := sql.Open("postgres", "user=postgres port=5432 dbname=UXPtests password=root sslmode=disable")
	defer db.Close()
	if err != nil {
		return otherError("Error opening database: "+err.Error(), http.StatusInternalServerError)
	}

	query := fmt.Sprintf(`UPDATE %s %s %s RETURNING row_to_json(%s);`, table, columnPairs, where, table)
	var res string
	fmt.Println(query)
	err = db.QueryRow(query).Scan(&res)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			return "{}", http.StatusOK, nil
		}
		return otherError("Error executing query: "+err.Error(), http.StatusBadRequest)
	}

	return res, http.StatusOK, nil
}
