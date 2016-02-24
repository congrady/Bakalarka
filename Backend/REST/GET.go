package REST

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

// GET sends test names saved in DB
func GET(w http.ResponseWriter, r *http.Request) {
	urlParams := strings.Split(r.URL.Path[5:], "/")

	table := urlParams[0]

	columns := ""
	if urlParams[1] == "*" {
		columns = "*"
	} else {
		columnsArray := strings.Split(urlParams[1], ",")
		for _, col := range columnsArray {
			columns += ("`" + col + "`" + ",")
		}
		columns = strings.TrimSuffix(columns, ",")
	}
	//fmt.Println(columns)

	conditions := ""
	if urlParams[2] != "" {
		conditionsArray := strings.Split(urlParams[2], ",")
		conditions := "WHERE "
		for _, cond := range conditionsArray {
			c := strings.Split(cond, "=")
			conditions += (c[0] + `="` + c[1] + `" AND `)
		}
		conditions = strings.TrimSuffix(conditions, " AND ")
	}

	db, err := sql.Open("sqlite3", "data/UXPtests.db")
	if err != nil {
		http.Error(w, "Error opening database: "+err.Error(), http.StatusBadRequest)
	}

	fmt.Println(fmt.Sprintf("SELECT %s FROM %s%s;", columns, table, conditions))
	rows, err := db.Query(fmt.Sprintf("SELECT %s FROM %s%s;", columns, table, conditions))
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
