package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
)

// Test holds data about a test
type Test struct {
	Name         string `json:"name"`
	AddedBy      string `json:"addedBy"`
	Uploaded     string `json:"uploaded"`
	LastModified string `json:"lastModified"`
	NumSegments  int    `json:"numSegments"`
}

func (t Test) String() string {
	return fmt.Sprintf("%s,%s,%s,%s,%d", t.Name, t.AddedBy, t.Uploaded, t.LastModified, t.NumSegments)
}

// GetTestsInfo sends info about all tests in DB
func GetTestsInfo(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("postgres", "user=postgres port=5432 dbname=UXPtests password=root sslmode=disable")
	defer db.Close()
	if err != nil {
		http.Error(w, "Error opening database: "+err.Error(), http.StatusInternalServerError)
		return
	}

	rows, err := db.Query(`SELECT t.name, t.added_by, COALESCE(to_char(t.uploaded, 'DD.MM.YYYY HH24:MI:SS'), ''),
	 											COALESCE(to_char(t.last_modified, 'DD.MM.YYYY HH24:MI:SS'), ''), count(s.test_name)
												FROM tests t LEFT JOIN segments s ON t.name = s.test_name GROUP BY t.name`)
	if err != nil {
		http.Error(w, "Error getting data from database: "+err.Error(), http.StatusBadRequest)
		return
	}
	var tests []Test
	for rows.Next() {
		var t Test
		rows.Scan(&t.Name, &t.AddedBy, &t.Uploaded, &t.LastModified, &t.NumSegments)
		tests = append(tests, t)
	}
	res, err := json.Marshal(tests)
	if err != nil {
		http.Error(w, "Error coverting tests to JSON: "+err.Error(), http.StatusBadRequest)
		return
	}
	w.Write(res)
}
