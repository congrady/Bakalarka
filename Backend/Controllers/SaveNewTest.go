package controllers

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"
)

// SaveNewTest reads form, saves information about new test into database
func SaveNewTest(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(0)

	name := strings.ToLower(r.FormValue("name"))
	addedBy := r.FormValue("userName")
	uploaded := time.Now().Format("02.01.2006 15:04:05")

<<<<<<< HEAD
	db, err := sql.Open("postgres", "user=root port=8080 dbname=UXPtests password=root sslmode=disable")
	if err != nil {
		http.Error(w, "Error opening database: "+err.Error(), http.StatusInternalServerError)
		return
	}

	stmt, _ := db.Prepare("INSERT INTO tests (name, added_by, uploaded, uploaded_string, last_modified, last_modified_string) VALUES (?,?,?,?,?,?)")
	_, err = stmt.Exec(name, addedBy, uploaded, uploaded, uploaded, uploaded)
=======
	db, _ := sql.Open("sqlite3", "UXPtests.db")

	stmt, _ := db.Prepare("INSERT INTO `tests` (name, added_by, uploaded, uploaded_string, last_modified, last_modified_string) VALUES (?,?,?,?,?,?)")
	_, err := stmt.Exec(name, addedBy, uploaded, uploaded, uploaded, uploaded)
>>>>>>> 53256142f54cc1acb559b071f5f11fd9c5377732
	if err != nil {
		http.Error(w, "Error inserting into database: "+err.Error(), 409)
		return
	}

	os.Mkdir("../data/tests/"+name, 0777)

	fmt.Fprintln(w, "New test successfuly saved.")
}
