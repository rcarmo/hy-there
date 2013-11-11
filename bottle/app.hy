(import sys); we need this solely to keep dependencies in one spot
(.append sys.path "../lib")

(import [bottle [run route]])

(route "/" ["GET"]
    (fn [] "Hy There!"))

(kwapply (run)
    {"host" "localhost"
     "port" 8080})
