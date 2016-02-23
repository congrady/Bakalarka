package explicit

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

// GetTestNames sends test names saved in DB
func GetTestNames(w http.ResponseWriter, r *http.Request) {
	db, _ := sql.Open("sqlite3", "data/UXPtests.db")

	var testNames []string
	rows, _ := db.Query("SELECT DISTINCT `name` FROM tests")
	for rows.Next() {
		var testName string
		rows.Scan(&testName)
		testNames = append(testNames, testName)
	}

	testNamesJSON, _ := json.Marshal(testNames)
	w.Write(testNamesJSON)
}
