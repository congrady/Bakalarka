package requestHandlers

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

	db, _ := sql.Open("sqlite3", "data/UXPtests.db")

	stmt, _ := db.Prepare("INSERT INTO `tests` (name, added_by, uploaded, uploaded_string, last_modified, last_modified_string) VALUES (?,?,?,?,?,?)")
	_, err := stmt.Exec(name, addedBy, uploaded, uploaded, uploaded, uploaded)
	if err != nil {
		http.Error(w, "Error inserting into database: "+err.Error(), 409)
		return
	}

	os.Mkdir("data/tests/"+name, 0777)

	/*

		SELECT t.name, t.added_by, t.uploaded_string, count(*) as "AMOUNT"
		FROM tests t
		JOIN segments s ON t.name = s.test_name
		GROUP BY t.name
		HAVING t.uploaded = (SELECT MAX(segments.uploaded)
											FROM segments
											WHERE t.name = s.test_name);

	*/
	/*
		width := 640
		height := 360
		cmd := exec.Command("ffmpeg", "-i", videoFileName, "-vframes", "1", "-s", fmt.Sprintf("%dx%d", width, height), "-f", "singlejpeg", "-")
		var buffer bytes.Buffer
		cmd.Stdout = &buffer
		if cmd.Run() != nil {
			panic("could not generate frame")
		}

		imageFileName := "data/tests/" + name + "/frame.jpeg"
		outfile, err = os.Create(imageFileName)
		if err != nil {
			http.Error(w, "Error creating file: "+err.Error(), http.StatusBadRequest)
			return
		}

		_, err = buffer.WriteTo(outfile)
		if err != nil {
			http.Error(w, "Error saving file: "+err.Error(), http.StatusBadRequest)
			return
		}*/

	fmt.Fprintln(w, "New test successfuly saved.")
}
