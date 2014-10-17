(import sys); we need this solely to keep dependencies in one spot
(.append sys.path "../lib")

(import [bottle [run route]])
(import eww)
(eww.embed)

(setv app "foo")

(route "/" ["GET"]
    (fn [] "Hy There!"))

(apply (run)
    {"host" "localhost"
     "port" 8080})
