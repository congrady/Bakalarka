package RequestHandlers

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

// GetTestsInfo sends test names saved in DB
func GetTestsInfo(w http.ResponseWriter, r *http.Request) {
	db, _ := sql.Open("sqlite3", "data/UXPtests.db")

	rows, err := db.Query("SELECT t.name, t.added_by, t.uploaded_string, t.last_modified_string, count(*) FROM tests t JOIN segments s ON t.name = s.test_name GROUP BY t.name")
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
