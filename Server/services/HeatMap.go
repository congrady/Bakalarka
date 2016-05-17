package services

import (
	"fmt"
	"image"
	"image/color"
	"image/jpeg"
	"image/png"
	"net/http"
	"os"
	"sort"
)

// colors represent heat-map color scale, from green to red
var colors = [11]color.RGBA{
	color.RGBA{71, 209, 71, 255},
	color.RGBA{204, 255, 51, 255},
	color.RGBA{255, 255, 77, 255},
	color.RGBA{255, 214, 51, 255},
	color.RGBA{255, 153, 0, 255},
	color.RGBA{255, 83, 26, 255},
}

// Uint32Slice attaches the methods of sort.Interface to []uint32
type Uint32Slice []uint32

func (s Uint32Slice) Len() int           { return len(s) }
func (s Uint32Slice) Less(i, j int) bool { return s[i] < s[j] }
func (s Uint32Slice) Swap(i, j int)      { s[i], s[j] = s[j], s[i] }

// Pixel represtents heat-map pixel that should be written into image file
type pixel struct {
	x, y       uint32
	colorIndex uint32
}

func combine(c1, c2 color.Color) color.Color {
	r, g, b, a := c1.RGBA()
	r2, g2, b2, a2 := c2.RGBA()
	coef := a + a2
	a /= 4

	return color.RGBA{
		uint8(((r*a)/coef + (r2*a2)/coef) >> 8),
		uint8(((g*a)/coef + (g2*a2)/coef) >> 8),
		uint8(((b*a)/coef + (b2*a2)/coef) >> 8),
		uint8((a*4 + a2) / 2),
	}
}

// MakeHeatMap analyses...
func MakeHeatMap(csvFilePath string, testID string, width, height int) error {
	file, err := os.Open(csvFilePath)
	if err != nil {
		return err
	}
	defer file.Close()

	valueMap, err := readCSV(file, uint32(width), uint32(height))
	if err != nil {
		return err
	}

	var analys Uint32Slice
	for i := range valueMap {
		for j := range valueMap[0] {
			if valueMap[i][j] != 0 {
				analys = append(analys, valueMap[i][j])
			}
		}
	}
	sort.Sort(analys)
	var decils [10]int
	dec := len(analys) / 7
	for i := 1; i <= 7; i++ {
		decils[i-1] = int(analys[dec*i])
	}

	var pixels []pixel
	for i := range valueMap {
		for j := range valueMap[0] {
			if valueMap[i][j] != 0 {
				for k := range decils {
					if k == 5 {
						pixels = append(pixels, pixel{x: uint32(i), y: uint32(j), colorIndex: uint32(k)})
						break
					} else {
						val := int(valueMap[i][j])
						if val >= decils[k] && val < decils[k+1] {
							pixels = append(pixels, pixel{x: uint32(i), y: uint32(j), colorIndex: uint32(k)})
							break
						}
					}
				}
			}
		}
	}

	frameFilePath := "../data/tests/" + testID + "/frame.jpeg"
	imgfile, err := os.Open(frameFilePath)
	defer imgfile.Close()
	if err != nil {
		fmt.Println(err.Error())
	}

	decodedImg, err := jpeg.Decode(imgfile)
	img := image.NewRGBA(decodedImg.Bounds())

	size := img.Bounds().Size()
	for x := 0; x < size.X; x++ {
		for y := 0; y < size.Y; y++ {
			img.Set(x, y, decodedImg.At(x, y))
		}
	}

	for _, pixel := range pixels {
		x, y := int(pixel.x), int(pixel.y)
		color := colors[int(pixel.colorIndex)]
		img.Set(x, y, combine(img.At(x, y), color))
	}

	heatMapFilePath := "../data/tests/" + testID + "/heat-map.png"
	file, err = os.Create(heatMapFilePath)
	if err != nil {
		return err
	}

	png.Encode(file, img)
	http.HandleFunc(heatMapFilePath[2:], sendResources)

	return nil
}
