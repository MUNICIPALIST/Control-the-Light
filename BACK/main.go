package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.Serve(autocert.NewListener("example.com"), nil)
}
