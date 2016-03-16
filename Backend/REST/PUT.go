package REST

import (
	"database/sql"
	"fmt"
	"net/http"
)

// Todo

// PUT creates or updates requested entry in a database
func PUT(w http.ResponseWriter, r *http.Request) {
	/*table := r.FormValue("table")
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
	}*/

	db, err := sql.Open("postgres", "user=postgres port=5432 dbname=UXPtests password=root sslmode=disable")
	if err != nil {
		http.Error(w, "Error opening database: "+err.Error(), http.StatusInternalServerError)
		return
	}

	row, err := db.Query(`SELECT Col.Column_Name from
    								INFORMATION_SCHEMA.TABLE_CONSTRAINTS Tab,
								    INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE Col
										WHERE
								    Col.Constraint_Name = Tab.Constraint_Name
								    AND Col.Table_Name = Tab.Table_Name
								    AND Constraint_Type = 'PRIMARY KEY'
								    AND Col.Table_Name = 'tests';`)

	var primaryKey []byte
	row.Scan(&primaryKey)
	fmt.Println(primaryKey)
	if err != nil {
		http.Error(w, "Error getting primary key: "+err.Error(), http.StatusBadRequest)
		return
	}

	/*
		_, err = db.Exec(fmt.Sprintf("UPDATE %s SET %s WHERE %s;", table, update, where))
		if err != nil {
			http.Error(w, "Error executing query: "+err.Error(), http.StatusBadRequest)
			return
		}*/

	w.WriteHeader(http.StatusOK)
}
