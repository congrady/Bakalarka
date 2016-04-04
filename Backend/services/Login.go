package services

import (
	"fmt"
	"net/http"
)

// Login checks if the specified userName and password are valid
// If they are, sends JWT (token)
// Otherwise sends Error 403
func Login(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	login := r.PostFormValue("login")
	password := r.PostFormValue("password")
	if login == "Matus" && password == "heslo" {
		userName := "Matus Congrady"
		fmt.Fprintf(w, "%s,%s,%s", userName, "token", "0")
	} else if login == "user123" && password == "heslo123" {
		userName := "Nahodny pouzivatel"
		fmt.Fprintf(w, "%s,%s,%s", userName, "token", "1")
	} else {
		http.Error(w, http.StatusText(403), 403)
	}
}
