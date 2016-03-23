package REST

import (
	"database/sql"
	"fmt"
	"net/http"
	"strings"
)

// MissingPartError sends error response, specifying which part of request is missing
func missingPartError(w http.ResponseWriter, part string) {
	http.Error(w, fmt.Sprintf("Wrong REST request: `%s` part of SQL query not specified", part), http.StatusBadRequest)
}

// WrongFormatError sends error response, specifying which part of request has wrong format
func wrongFormatError(w http.ResponseWriter, part string) {
	http.Error(w, fmt.Sprintf("Wrong REST request: `%s` part has wrong format", part), http.StatusBadRequest)
}

func wrongURLParamsAmount(w http.ResponseWriter) {
	http.Error(w, "Wrong REST request: wrong amount of URL parameters", http.StatusBadRequest)
}

func parsePairQueryParam(input string, separator string) (string, string) {
	separator = separator + " "
	if input == "" {
		return "", "missing part error"
	}
	res := ""
	paramArray := strings.Split(input, ",")
	var params []string
	for _, pair := range paramArray {
		params = strings.Split(pair, "=")
		if len(params) != 2 {
			return "", "wrong format error"
		}
		res += fmt.Sprintf("%s='%s'%s", params[0], params[1], separator)
	}
	return strings.TrimSuffix(res, separator), ""
}

func parseQueryParam(input string) (string, string) {
	if input == "" {
		return "", "missing part error"
	}
	res := ""
	paramArray := strings.Split(input, ",")
	for _, param := range paramArray {
		res += fmt.Sprintf("%s,", param)
	}
	return strings.TrimSuffix(res, ","), ""
}

func getJSON(rows *sql.Rows) (string, string) {
	cols, err := rows.Columns()
	if err != nil {
		return "", "Error getting columns: " + err.Error()
	}
	values := make([]string, len(cols))
	scanArgs := make([]interface{}, len(values))
	for i := range values {
		scanArgs[i] = &values[i]
	}

	res := ""
	for rows.Next() {
		err = rows.Scan(scanArgs...)
		if err != nil {
			return "", "Error scaning rows: " + err.Error()
		}
		res += "{"
		for i := range values {
			res += fmt.Sprintf(`"%s":"%s",`, cols[i], values[i])
		}
		res = res[:len(res)-1] + "},"
		if err != nil {
			return "", "Error coverting tests to JSON: " + err.Error()
		}
	}
	if res != "" {
		return fmt.Sprintf("[%s]", res[:len(res)-1]), ""
	}
	return "", ""
}
