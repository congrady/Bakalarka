package REST

import (
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

func parsePairQueryParam(urlParam string, separator string) (string, string) {
	separator = " " + separator + " "
	if urlParam == "" {
		return "", "missing part error"
	}
	res := ""
	paramArray := strings.Split(urlParam, ",")
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

func parseQueryParam(urlParam string) (string, string) {
	if urlParam == "" {
		return "", "missing part error"
	}
	res := ""
	paramArray := strings.Split(urlParam, ",")
	for _, param := range paramArray {
		res += fmt.Sprintf("cast (%s as text),", param)
	}
	return strings.TrimSuffix(res, ","), ""
}
