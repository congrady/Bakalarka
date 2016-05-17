package endpoints

import (
	"fmt"
	"net/http"
	"os"

	"../services"
)

// GenerateHeatMap ...
func GenerateHeatMap(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(0)

	testID := r.FormValue("testID")
	CSVFilePath := "../data/tests/" + testID + "/ETresult0.csv"

	heatMapFilePath := "data/tests/" + testID + "/heat-map.png"
	file, err := os.Open("../" + heatMapFilePath)
	defer file.Close()
	if err == nil {
		fmt.Fprintln(w, "Fragment already exists.")
		return
	}

	err = services.MakeHeatMap(CSVFilePath, testID, 1280, 780)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	fmt.Fprintln(w, "Fragment successfuly generated.")
}
