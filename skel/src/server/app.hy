(import [bottle [run route static_file response]]
        [subprocess [Popen]]
        [os.path [splitext getmtime join exists]])

(setv counter 0)
(setv root "../client")

(defn wisp-compile [filename]
    (setv wisp (+ (first (splitext filename)) ".wisp"))
    (if (exists wisp)
        (if (or (not (exists filename)) (< (getmtime filename) (getmtime wisp)))
            (.communicate
                (kwapply (Popen "wisp")
                    {"stdin"  (open wisp "r")
                     "stdout" (open filename "w")})))))

(route "/data/<name>" ["GET"]
    (fn [name]
        (setv response.content_type "application/json")
        (get {"one" {"labels"   ["January" "February" "March" "April" "May" "June"]
                     "datasets" [{
                       "fillColor"         "rgba(220,220,220,0.5)"
                       "strokeColor"       "rgba(220,220,220,1)"
                       "pointColor"        "rgba(220,220,220,1)"
                       "pointStrokeColor"  "#fff"
                       "data"              [65 59 90 81 16 51]}]}
              "two" {"labels"   ["January" "February" "March" "April" "May" "June"]
                     "datasets" [{
                       "fillColor"         "rgba(220,220,220,0.5)"
                       "strokeColor"       "rgba(220,220,220,1)"
                       "pointColor"        "rgba(220,220,220,1)"
                       "pointStrokeColor"  "#fff"
                       "data"              [15 29 40 21 56 31]}]}} name)))

(route "/listen" ["GET"] 
    (fn [] 
        (setv response.content_type "text/event-stream")
        (setv counter (inc counter))
        (% "event: progress\ndata: %d\n\n" counter)))

(route "/<path:path>" ["GET"]
    (fn [path] 
        (if (= ".js" (nth (splitext path) 1))
            (wisp-compile (join root path)))
        (kwapply (static_file path) {"root" root})))

(kwapply (run)
    {"host"     "localhost"
     "port"     8080})
