package REST

import (
	"database/sql"
	"fmt"
	"net/http"
	"strings"
)

// PUT creates or updates requested entry in a database
func PUT(w http.ResponseWriter, r *http.Request) (string, int, error) {
	table := r.FormValue("table")

	if table == "" {
		return missingPartError("table")
	}

	columnPairsUnparsed := r.FormValue("columns")
	columnPairs := ""
	if columnPairsUnparsed != "" {
		res, err := parsePairQueryParam(columnPairsUnparsed, ",")
		if err != nil {
			return parsingError(err, "columns")
		}
		columnPairs = " SET " + res
	}

	input := r.FormValue("columns")
	if input == "" {
		return missingPartError("columns")
	}
	columns := "("
	values := "VALUES ("
	params := strings.Split(input, ",")
	var p []string
	for _, param := range params {
		p = strings.Split(param, "=")
		if len(p) != 2 {
			return wrongFormatError("columns")
		}
		columns += fmt.Sprintf("%s,", p[0])
		values += fmt.Sprintf("'%s',", p[1])
	}
	columns = columns[:len(columns)-1] + ")"
	values = values[:len(values)-1] + ")"

	db, err := sql.Open("postgres", "user=postgres port=5432 dbname=UXPtests password=root sslmode=disable")
	defer db.Close()
	if err != nil {
		return otherError("Error opening database: "+err.Error(), http.StatusInternalServerError)
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
		return otherError("Error getting primary key: "+err.Error(), http.StatusBadRequest)
	}

	query := fmt.Sprintf(`INSERT INTO %s %s %s ON CONFLICT (%s) DO UPDATE%s RETURNING row_to_json(%s);`,
		table, columns, values, primaryKey, columnPairs, table)
	fmt.Println(query)
	var res string
	err = db.QueryRow(query).Scan(&res)
	if err != nil {
		return otherError("Error executing query: "+err.Error(), http.StatusBadRequest)
	}

	return res, http.StatusOK, nil
}
