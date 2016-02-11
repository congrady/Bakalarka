package requestHandlers

import (
	"database/sql"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"
)

func saveNewTest(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(0)

	name := strings.ToLower(r.FormValue("name"))
	addedBy := "Username"
	uploaded := time.Now().Format("02.01.2006 15:04:05")

	db, _ := sql.Open("sqlite3", "data/UXPtests.db")

	stmt, _ := db.Prepare("INSERT INTO `tests` (name, added_by, uploaded) VALUES (?,?,?)")
	_, err := stmt.Exec(name, addedBy, uploaded)
	if err != nil {
		http.Error(w, "Error inserting into database: "+err.Error(), 409)
		return
	}

	infile, _, err := r.FormFile("file")

	if err != nil {
		http.Error(w, "Error parsing uploaded file: "+err.Error(), http.StatusBadRequest)
		return
	}
	outfile, err := os.Create("data/" + name + ".txt")
	if err != nil {
		http.Error(w, "Error saving file: "+err.Error(), http.StatusBadRequest)
		return
	}
	_, err = io.Copy(outfile, infile)
	if err != nil {
		http.Error(w, "Error saving file: "+err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Fprintln(w, "New test successfuly saved.")
}
