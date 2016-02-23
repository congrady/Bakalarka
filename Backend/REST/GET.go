package REST

import "net/http"

// GET sends test names saved in DB
func GET(w http.ResponseWriter, r *http.Request) {
	/*db, _ := sql.Open("sqlite3", "data/UXPtests.db")
	params, err := url.ParseQuery("&" + r.URL.Path[5:])
	if err != nil {
		http.Error(w, "Error coverting tests to JSON: "+err.Error(), http.StatusBadRequest)
	}
	/*
	   	for param := range params {
	   		fmt.Println(param + ": " + params.Get(param))
	   		if param == "db" {
	   			database := params.Get(param)
	   		} else if param == "id" {
	   			id := params.Get(param)
	   		} else if param == "name" {
	   			name := params.Get(param)
	   		}
	   	}
	   s := fmt.Sprintf("Hi, my name is %s and I'm %d years old.", "Bob", 23)
	   	var testNames []string
	   	rows, _ := db.Query(fmt.Sprintf("SELECT * FROM %s", database))
	   	for rows.Next() {
	   		var testName string
	   		rows.Scan(&testName)
	   		testNames = append(testNames, testName)
	   	}

	   	testNamesJSON, _ := json.Marshal(testNames)
	   	w.Write(testNamesJSON)*/
}
