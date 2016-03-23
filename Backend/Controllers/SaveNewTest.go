package controllers

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"
)

type test struct {
	Name         string `json:"name"`
	AddedBy      string `json:"added_by"`
	Uploaded     string `json:"uploaded"`
	LastModified string `json:"last_modified"`
}

// SaveNewTest reads form, saves information about new test into database
func SaveNewTest(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(0)

	name := strings.ToLower(r.FormValue("name"))
	addedBy := r.FormValue("userName")
	uploaded := time.Now().Format("2006-01-02 15:04:05")

	db, err := sql.Open("postgres", "user=postgres port=5432 dbname=UXPtests password=root sslmode=disable")
	defer db.Close()
	if err != nil {
		http.Error(w, "Error opening database: "+err.Error(), http.StatusInternalServerError)
		return
	}

	_, err = db.Exec(fmt.Sprintf("INSERT INTO tests VALUES ('%s','%s','%s','%s')", name, addedBy, uploaded, uploaded))
	if err != nil {
		http.Error(w, "Error inserting into database: "+err.Error(), 409)
		return
	}

	os.Mkdir("../data/tests/"+name, 0777)

	fmt.Fprintln(w, "New test successfuly saved.")
}
