package Login

import (
	"fmt"
	"net/http"
)

func login(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	login := r.PostFormValue("login")
	password := r.PostFormValue("password")
	if login == "Matus" && password == "heslo" {
		userName := "Matus Congrady"
		fmt.Fprintf(w, "%s,%s", userName, "token")
	} else if login == "user123" && password == "heslo123" {
		userName := "Nahodny pouzivatel"
		fmt.Fprintf(w, "%s,%s", userName, "token")
	} else {
		http.Error(w, http.StatusText(403), 403)
	}
}
