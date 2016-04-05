package services

import (
	"database/sql"
	"fmt"
	"net/http"
	"strings"
)

// SegmentsCount send amount of segments for specified test
func SegmentsCount(w http.ResponseWriter, r *http.Request) {
	urlParams := strings.Split(r.URL.Path[15:], "$")

	var query string
	if len(urlParams) > 2 {
		http.Error(w, "Test name not specified.", http.StatusBadRequest)
		return
	} else if len(urlParams) == 2 {
		query = fmt.Sprintf(`SELECT array_to_json(array_agg(row_to_json(j))) FROM(
													SELECT t.name, count(t.name) as count
													FROM tests t
													LEFT JOIN segments s
													ON t.name = s.test_name
													GROUP BY t.name
													HAVING t.name = '%s') j`, urlParams[1])
	} else {
		query = `SELECT array_to_json(array_agg(j))
						 FROM (SELECT t.name, count(*) as count
						 			 FROM tests t
									 LEFT JOIN segments s
									 ON t.name = s.test_name
									 GROUP BY t.name) j`
	}

	db, err := sql.Open("postgres", "user=postgres port=5432 dbname=UXPtests password=root sslmode=disable")
	defer db.Close()
	if err != nil {
		http.Error(w, "Error opening database: "+err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Println(query)
	var res string
	err = db.QueryRow(query).Scan(&res)
	if err != nil {
		http.Error(w, "Error executing query: "+err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, res)
}
