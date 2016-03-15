package controllers

import (
	"bytes"
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"strings"
	"time"

	"github.com/congrady/Bakalarka/Backend/services"
)

// AddNewSegment saves new segment to database, and saves .csv file
// with eye tracker results locally
func AddNewSegment(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(0)

	video, _, err := r.FormFile("video")
	if err != nil {
		http.Error(w, "Error parsing uploaded file: "+err.Error(), http.StatusBadRequest)
		return
	}
	et, _, err := r.FormFile("et")
	if err != nil {
		http.Error(w, "Error parsing uploaded file: "+err.Error(), http.StatusBadRequest)
		return
	}

	testName := strings.ToLower(r.FormValue("testName"))
	addedBy := r.FormValue("userName")
	uploaded := time.Now().Format("02.01.2006 15:04:05")

	db, err := sql.Open("postgres", "user=root port=5432 dbname=UXPtests password=root sslmode=disable")
	if err != nil {
		http.Error(w, "Error opening database: "+err.Error(), http.StatusInternalServerError)
		return
	}

	var segmentID string
	err = db.QueryRow(`SELECT COUNT(*) FROM segments WHERE test_name = "` + testName + `"`).Scan(&segmentID)

	filePath := "../data/tests/" + testName + "/ETresult" + segmentID

	stmt, _ := db.Prepare("INSERT INTO segments (test_name, added_by, uploaded, file_path) VALUES (?,?,?,?)")
	_, err = stmt.Exec(testName, addedBy, uploaded, filePath)
	if err != nil {
		http.Error(w, "Error inserting into database: "+err.Error(), 409)
		return
	}

	err = services.SaveFile(filePath+".mp4", video)
	err = services.SaveFile(filePath+".csv", et)
	if err != nil {
		http.Error(w, "Error saving files: "+err.Error(), 409)
		return
	}
	http.HandleFunc(filePath[2:]+".mp4", SendResources)
	http.HandleFunc(filePath[2:]+".csv", SendResources)

	width := 640
	height := 360
	cmd := exec.Command("ffmpeg", "-i", filePath+".mp4", "-vframes", "1", "-s", fmt.Sprintf("%dx%d", width, height), "-f", "singlejpeg", "-")
	var buffer bytes.Buffer
	cmd.Stdout = &buffer
	if cmd.Run() != nil {
		panic("could not generate frame")
	}

	imageFileName := "../data/tests/" + testName + "/frame.jpeg"
	outfile, err := os.Create(imageFileName)
	if err != nil {
		http.Error(w, "Error creating file: "+err.Error(), http.StatusBadRequest)
		return
	}
	http.HandleFunc(imageFileName[2:], SendResources)

	_, err = buffer.WriteTo(outfile)
	if err != nil {
		http.Error(w, "Error saving file: "+err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Fprintln(w, "New segment successfuly saved.")
}
