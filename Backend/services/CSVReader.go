package services

import (
	"encoding/csv"
	"io"
	"strconv"
	"strings"

	"gopkg.in/fatih/set.v0"
)

var moves = [12][2]int{{-2, 0}, {-1, 1}, {-1, 0}, {-1, -1}, {0, 2}, {0, 1}, {0, -1}, {0, -2}, {2, 0}, {1, 1}, {1, 0}, {1, -1}}

type point struct {
	x, y int
}

func move(x int, y int, value uint32, slice [][]uint32, set set.SetNonTS, step int) {
	slice[x][y] += value
	set.Add(point{x: x, y: y})

	for i := range moves {
		if !set.Has(point{x: x + moves[i][0], y: y + moves[i][1]}) &&
			x+step*moves[i][0] > 0 &&
			x+step*moves[i][0] < len(slice) &&
			y+step*moves[i][1] > 0 &&
			y+step*moves[i][1] < len(slice[0]) &&
			int(value)-step > step {
			move(x+moves[i][0], y+moves[i][1], value-1, slice, set, step)
		}
	}
}

// ReadCSV reads a csv file and returns its content
func readCSV(file io.Reader, width uint32, height uint32) (res [][]uint32, err error) {
	res = make([][]uint32, int(width))
	for i := range res {
		res[i] = make([]uint32, int(height))
	}

	reader := csv.NewReader(file)

	reader.Comma = ';'
	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		} else if err != nil {
			return res, err
		}

		recordX := strings.Replace(record[3], ",", ".", 1)
		recordY := strings.Replace(record[4], ",", ".", 1)
		normalizedX, err := strconv.ParseFloat(recordX, 64)
		if err != nil {
			continue
		}
		normalizedY, err := strconv.ParseFloat(recordY, 64)
		if err != nil {
			continue
		} else {
			x := int(normalizedX*float64(width)) - 1
			y := int(normalizedY*float64(height)) - 1
			if x < 1 {
				x = 0
			}
			if y < 1 {
				y = 0
			}

			set := set.NewNonTS()
			move(x, y, 15, res, *set, 3)
		}
	}

	return res, nil
}
