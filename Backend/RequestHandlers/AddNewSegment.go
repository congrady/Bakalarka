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

// AddNewSegment saves new segment to database, and saves .csv file
// with eye tracker results locally
func AddNewSegment(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(0)

	infile, _, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Error parsing uploaded file: "+err.Error(), http.StatusBadRequest)
		return
	}
	testName := strings.ToLower(r.FormValue("testName"))
	addedBy := r.FormValue("userName")
	uploaded := time.Now().Format("02.01.2006 15:04:05")

	db, _ := sql.Open("sqlite3", "data/UXPtests.db")

	var segmentID string
	err = db.QueryRow(`SELECT COUNT(*) FROM segments WHERE test_name = "` + testName + `"`).Scan(&segmentID)

	filePath := "data/tests/" + testName + "/ETresult" + segmentID + ".csv"

	stmt, _ := db.Prepare("INSERT INTO `segments` (test_name, added_by, uploaded, file_path) VALUES (?,?,?,?)")
	_, err = stmt.Exec(testName, addedBy, uploaded, filePath)
	if err != nil {
		http.Error(w, "Error inserting into database: "+err.Error(), 409)
		return
	}

	outfile, err := os.Create(filePath)
	if err != nil {
		http.Error(w, "Error saving file: "+err.Error(), http.StatusBadRequest)
		return
	}
	_, err = io.Copy(outfile, infile)
	if err != nil {
		http.Error(w, "Error saving file: "+err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Fprintln(w, "New segment successfuly saved.")
}
