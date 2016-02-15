package requestHandlers

import (
	"bytes"
	"database/sql"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
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

	stmt, _ := db.Prepare("INSERT INTO `tests` (name, added_by, uploaded) VALUES (?,?,?)")
	_, err := stmt.Exec(name, addedBy, uploaded)
	if err != nil {
		http.Error(w, "Error inserting into database: "+err.Error(), 409)
		return
	}

	if err != nil {
		http.Error(w, "Error parsing uploaded file: "+err.Error(), http.StatusBadRequest)
		return
	}
	os.Mkdir("data/tests/"+name, 0777)
	videoFileName := "data/tests/" + name + "/video.mp4"
	outfile, err := os.Create(videoFileName)
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
	}

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
	}
	// Do something with buffer, which contains a JPEG image

	fmt.Fprintln(w, "New test successfuly saved.")
}
