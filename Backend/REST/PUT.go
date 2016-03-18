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
			where = "WHERE " + table + "." + res
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
			columnPairs = " SET " + res
		}
	}

	input := r.FormValue("columns")
	if input == "" {
		missingPartError(w, "columns")
		return
	}
	columns := "("
	values := "VALUES ("
	params := strings.Split(input, ",")
	var p []string
	for _, param := range params {
		p = strings.Split(param, "=")
		if len(p) != 2 {
			wrongFormatError(w, "columns")
			return
		}
		columns += fmt.Sprintf("%s,", p[0])
		values += fmt.Sprintf("'%s',", p[1])
	}
	columns = columns[:len(columns)-1] + ")"
	values = values[:len(values)-1] + ")"

	db, err := sql.Open("postgres", "user=postgres port=5432 dbname=UXPtests password=root sslmode=disable")
	if err != nil {
		http.Error(w, "Error opening database: "+err.Error(), http.StatusInternalServerError)
		return
	}

	var primaryKey string
	err = db.QueryRow(fmt.Sprintf(`SELECT Col.Column_Name from
																INFORMATION_SCHEMA.TABLE_CONSTRAINTS Tab,
																INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE Col
																WHERE
																Col.Constraint_Name = Tab.Constraint_Name
																AND Col.Table_Name = Tab.Table_Name
																AND Constraint_Type = 'PRIMARY KEY'
																AND Col.Table_Name = '%s';`, table)).Scan(&primaryKey)
	if err != nil {
		http.Error(w, "Error getting primary key: "+err.Error(), http.StatusBadRequest)
		return
	}

	query := fmt.Sprintf(`INSERT INTO %s %s %s ON CONFLICT (%s) DO UPDATE%s %s;`,
		table, columns, values, primaryKey, columnPairs, where)
	fmt.Println(query)

	_, err = db.Exec(query)
	if err != nil {
		http.Error(w, "Error executing query: "+err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}
