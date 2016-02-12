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

// SaveNewTest reads form, saves information about new test into database
func SaveNewTest(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(0)

	testName := strings.ToLower(r.FormValue("testName"))
	addedBy := r.FormValue("userName")
	uploaded := time.Now().Format("02.01.2006 15:04:05")

	db, _ := sql.Open("sqlite3", "data/UXPtests.db")

	stmt, _ := db.Prepare("INSERT INTO `tests` (name, added_by, uploaded) VALUES (?,?,?)")
	_, err := stmt.Exec(testName, addedBy, uploaded)
	if err != nil {
		http.Error(w, "Error inserting into database: "+err.Error(), 409)
		return
	}

	if err != nil {
		http.Error(w, "Error parsing uploaded file: "+err.Error(), http.StatusBadRequest)
		return
	}
	os.Mkdir("data/tests/"+testName, 0777)
	outfile, err := os.Create("data/tests/" + testName + "/image.txt")
	if err != nil {
		http.Error(w, "Error saving file: "+err.Error(), http.StatusBadRequest)
		return
	}
	infile, _, _ := r.FormFile("file")
	_, err = io.Copy(outfile, infile)
	if err != nil {
		http.Error(w, "Error saving file: "+err.Error(), http.StatusBadRequest)
		return
	}

	rows, _ := db.Query("SELECT * FROM tests")
	for rows.Next() {
		var name string
		var addedBy string
		var uploaded string
		err = rows.Scan(&name, &addedBy, &uploaded)
		fmt.Println(name)
		fmt.Println(addedBy)
		fmt.Println(uploaded)
	}

	fmt.Fprintln(w, "New test successfuly saved.")
}
