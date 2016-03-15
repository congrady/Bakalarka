package REST

import (
	"database/sql"
	"encoding/json"
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
	table := "`" + urlParams[0] + "`"

	columns, errorType := parseQueryParam(urlParams[1])
	if errorType == "missing part error" {
		missingPartError(w, "select")
		return
	}

	where := ""
	if urlParamsLen > 2 {
		res, errorType := parsePairQueryParam(urlParams[2])
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

	db, err := sql.Open("sqlite3", "UXPtests.db")
	if err != nil {
		http.Error(w, "Error opening database: "+err.Error(), http.StatusBadRequest)
	}

	rows, err := db.Query(fmt.Sprintf("SELECT %s FROM%s%s%s%s;", columns, table, where, groupBy, orderBy))
	if err != nil {
		http.Error(w, "Error executing query: "+err.Error(), http.StatusBadRequest)
		return
	}

	cols, err := rows.Columns()
	ints := make([]string, len(cols))
	vals := make([]interface{}, len(cols))
	for i := range ints {
		vals[i] = &ints[i]
	}
	for rows.Next() {
		err = rows.Scan(vals...)
		if err != nil {
			http.Error(w, "Error executing query: "+err.Error(), http.StatusBadRequest)
			return
		}
		res, err := json.Marshal(vals)
		if err != nil {
			http.Error(w, "Error coverting tests to JSON: "+err.Error(), http.StatusBadRequest)
			return
		}
		w.Write(res)
	}
}
