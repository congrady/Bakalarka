package services

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"strings"
)

// SaveNewTest reads form, saves information about new test into database
func SaveNewTest(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(0)

	name := strings.ToLower(r.FormValue("name"))
	addedBy := r.FormValue("userName")

	db, err := sql.Open("postgres", "user=postgres port=5432 dbname=UXPtests password=root sslmode=disable")
	defer db.Close()
	if err != nil {
		http.Error(w, "Error opening database: "+err.Error(), http.StatusInternalServerError)
		return
	}

	query := fmt.Sprintf(`INSERT INTO tests (name, added_by) VALUES ('%s', '%s')`, name, addedBy)
	fmt.Println(query)
	_, err = db.Exec(query)

	if err != nil {
		http.Error(w, "Error inserting into database: "+err.Error(), 409)
		return
	}

	os.Mkdir("../data/tests/"+name, 0777)

	fmt.Fprintln(w, "New test successfuly saved.")
}
