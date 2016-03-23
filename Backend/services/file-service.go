package services

import (
	"io"
	"os"
)

// SaveFile creates a file and copies contents of Reader to it
func SaveFile(filePath string, content io.Reader) error {
	file, err := os.Create(filePath)
	if err != nil {
		return err //errors.New("Error creating file.")
	}
	_, err = io.Copy(file, content)
	if err != nil {
		return err //errors.New("Error copying file contents")
	}
	return nil
}
