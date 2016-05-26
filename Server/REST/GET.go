package REST

import (
	"database/sql"
	"fmt"
	"net/http"
	"strings"
)

// GET gets requested entry from database
func GET(w http.ResponseWriter, r *http.Request) (string, int, error) {
	urlParams := strings.Split(r.URL.Path[5:], "$")

	urlParamsLen := len(urlParams)

	if (urlParamsLen > 5) || (urlParamsLen < 2) {
		return wrongURLParamsAmount()
	}

	if urlParams[0] == "" {
		return missingPartError("table")
	}
	table := urlParams[0]

	columns, _ := parseQueryParam(urlParams[1])
	if columns == "" {
		columns = " * "
	}

	where := ""
	if urlParamsLen > 2 && urlParams[2] != "" {
		res, err := parsePairQueryParam(urlParams[2], "OR")
		if err != nil {
			return parsingError(err, "where")
		}
		where = " WHERE " + res
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
	if err != nil {
		if err.Error() == "sql: Scan error on column index 0: unsupported driver -> Scan pair: <nil> -> *string" || 
		 err.Error() == "sql: Scan error on column index 0: unsupported Scan, storing driver.Value type <nil> into type *string" {
			return "[]", http.StatusOK, nil
		}
		return otherError("Error executing query: "+err.Error(), http.StatusBadRequest)
	}

	return res, http.StatusOK, nil
}
