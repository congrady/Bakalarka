package REST

import (
	"database/sql"
	"fmt"
	"net/http"
	"strings"
)

// GET gets requested entry from database
func GET(w http.ResponseWriter, r *http.Request) {
	urlParams := strings.Split(r.URL.Path[5:], "$")

	urlParamsLen := len(urlParams)

	if (urlParamsLen > 5) || (urlParamsLen < 2) {
		wrongURLParamsAmount(w)
		return
	}

	if urlParams[0] == "" {
		missingPartError(w, "table")
		return
	}
	table := urlParams[0]

	columns, errorType := parseQueryParam(urlParams[1])
	if errorType == "missing part error" {
		missingPartError(w, "select")
		return
	}

	where := ""
	if urlParamsLen > 2 {
		res, errorType := parsePairQueryParam(urlParams[2], "OR")
		if errorType == "wrong format error" {
			wrongFormatError(w, "where")
			return
		}
		if res != "" {
			where = " WHERE " + res
		}
	}

	groupBy := ""
	if urlParamsLen > 3 {
		res, _ := parseQueryParam(urlParams[3])
		if res != "" {
			groupBy = " GROUP BY " + res
		}
	}

	orderBy := ""
	if urlParamsLen > 4 {
		res, _ := parseQueryParam(urlParams[4])
		if res != "" {
			orderBy = " ORDER BY " + res
		}
	}

	db, err := sql.Open("postgres", "user=postgres port=5432 dbname=UXPtests password=root sslmode=disable")
	defer db.Close()
	if err != nil {
		http.Error(w, "Error opening database: "+err.Error(), http.StatusBadRequest)
	}

	query := fmt.Sprintf(`SELECT array_to_json(array_agg(row_to_json(t))) FROM (select %s FROM %s) t %s%s%s;`,
		columns, table, where, groupBy, orderBy)
	fmt.Println(query)
	var res string
	err = db.QueryRow(query).Scan(&res)
	if err != nil && err.Error() == "sql: Scan error on column index 0: unsupported driver -> Scan pair: <nil> -> *string" {
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, "[]")
		return
	}
	if err != nil {
		http.Error(w, "Error executing query: "+err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, res)
}
