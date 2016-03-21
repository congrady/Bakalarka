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

	fmt.Println(fmt.Sprintf("SELECT %s FROM %s%s%s%s;", columns, table, where, groupBy, orderBy))
	rows, err := db.Query(fmt.Sprintf("SELECT %s FROM %s%s%s%s;", columns, table, where, groupBy, orderBy))
	if err != nil {
		http.Error(w, "Error executing query: "+err.Error(), http.StatusBadRequest)
		return
	}

	cols, err := rows.Columns()
	if err != nil {
		http.Error(w, "Error getting columns: "+err.Error(), http.StatusInternalServerError)
	}
	values := make([]string, len(cols))
	scanArgs := make([]interface{}, len(values))
	for i := range values {
		scanArgs[i] = &values[i]
	}

	res := ""
	for rows.Next() {
		err = rows.Scan(scanArgs...)
		if err != nil {
			http.Error(w, "Error scaning rows: "+err.Error(), http.StatusBadRequest)
			return
		}
		res += "{"
		for i := range values {
			res += fmt.Sprintf(`"%s":"%s",`, cols[i], values[i])
		}
		res = res[:len(res)-1] + "},"
		if err != nil {
			http.Error(w, "Error coverting tests to JSON: "+err.Error(), http.StatusBadRequest)
			return
		}
	}
	if res != "" {
		fmt.Fprint(w, fmt.Sprintf("[%s]", res[:len(res)-1]))
	} else {
		fmt.Fprint(w, "")
	}
}
