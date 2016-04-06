package services

import (
	"bytes"
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"os/exec"
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

	testID := r.FormValue("testID")
	addedBy := r.FormValue("userName")

	db, err := sql.Open("postgres", "user=postgres port=5432 dbname=UXPtests password=root sslmode=disable")
	defer db.Close()
	if err != nil {
		http.Error(w, "Error opening database: "+err.Error(), http.StatusInternalServerError)
		return
	}

	var numSegments string
	err = db.QueryRow(`SELECT COUNT(*) FROM segments WHERE test_id = '` + testID + `'`).Scan(&numSegments)
	fmt.Println(numSegments)

	filePath := "../data/tests/" + testID + "/ETresult" + numSegments

	query := fmt.Sprintf(
		`INSERT INTO segments
		(test_id, added_by, file_path)
		VALUES ('%s','%s','%s');`,
		testID, addedBy, filePath)
	_, err = db.Exec(query)
	if err != nil {
		http.Error(w, "Error inserting into database: "+err.Error(), 409)
		return
	}
	query = fmt.Sprintf(`UPDATE tests SET segments_amount = segments_amount + 1 WHERE id = '%s'`, testID)
	_, err = db.Exec(query)
	if err != nil {
		http.Error(w, "Error inserting into database: "+err.Error(), 409)
		return
	}

	err = saveFile(filePath+".mp4", video)
	err = saveFile(filePath+".csv", et)
	if err != nil {
		http.Error(w, "Error saving files: "+err.Error(), 409)
		return
	}
	http.HandleFunc(filePath[2:]+".mp4", SendResources)
	http.HandleFunc(filePath[2:]+".csv", SendResources)

	imageFileName := "../data/tests/" + testID + "/frame.jpeg"
	_, err = os.Open(imageFileName)
	if err == nil {
		fmt.Fprintln(w, "New segment successfuly saved.")
		return
	}

	width := 640
	height := 360
	cmd := exec.Command("ffmpeg", "-i", filePath+".mp4", "-vframes", "1", "-s", fmt.Sprintf("%dx%d", width, height), "-f", "singlejpeg", "-")
	var buffer bytes.Buffer
	cmd.Stdout = &buffer
	if cmd.Run() != nil {
		panic("could not generate frame")
	}

	outfile, err := os.Create(imageFileName)
	if err != nil {
		http.Error(w, "Error creating file: "+err.Error(), http.StatusBadRequest)
		return
	}

	_, err = buffer.WriteTo(outfile)
	if err != nil {
		http.Error(w, "Error saving file: "+err.Error(), http.StatusBadRequest)
		return
	}
	http.HandleFunc(imageFileName[2:], SendResources)

	fmt.Fprintln(w, "New segment successfuly saved.")
}
