package requestHandlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
)

type test struct {
	name         string
	addedBy      string
	uploaded     string
	lastModified string
	amount       int
}

// GetTestsInfo sends test names saved in DB
func GetTestsInfo(w http.ResponseWriter, r *http.Request) {
	db, _ := sql.Open("sqlite3", "data/UXPtests.db")

	rows, err := db.Query("SELECT t.name, t.added_by, t.uploaded_string, t.last_modified_string, count(*) FROM tests t JOIN segments s ON t.name = s.test_name GROUP BY t.name")
	if err != nil {
		fmt.Println(err.Error())
	}
	for rows.Next() {
		var t test
		rows.Scan(&t.name, &t.addedBy, &t.uploaded, &t.lastModified, &t.amount)
		//testJSON, _ := json.Marshal(t)
		fmt.Println(t)
		json.NewEncoder(w).Encode(t)
	}
}
