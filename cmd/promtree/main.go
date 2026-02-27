package main

import (
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/0x1306e6d/promtree/web"
	"github.com/0x1306e6d/promtree/internal/server"
)

func main() {
	port := flag.Int("port", 0, "port to listen on (default 8080, or PORT env)")
	flag.Parse()

	if *port == 0 {
		if env := os.Getenv("PORT"); env != "" {
			fmt.Sscanf(env, "%d", port)
		}
		if *port == 0 {
			*port = 8080
		}
	}

	addr := fmt.Sprintf(":%d", *port)
	srv := server.New(addr, web.Handler())

	log.Printf("listening on %s", addr)
	if err := srv.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
