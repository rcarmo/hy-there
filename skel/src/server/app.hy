(import [bottle [run route static_file response]]
        [subprocess [Popen]]
        [random [sample]]
        [os.path [splitext getmtime join exists]])

(setv counter 0)
(setv root "../client-angular")

(defn wisp-compile [filename]
    (setv wisp (+ (first (splitext filename)) ".wisp"))
    (if (exists wisp)
        (if (or (not (exists filename)) (< (getmtime filename) (getmtime wisp)))
            (.communicate
                (kwapply (Popen "wisp")
                    {"stdin"  (open wisp "r")
                     "stdout" (open filename "w")})))))

(route "/api/charts" ["GET"]
    (fn []
        (setv response.content_type "application/json")
        {"one" {"id" "one" "width" 250 "height" 250}
         "two" {"id" "two" "width" 250 "height" 250}
         "three" {"id" "three" "width" 250 "height" 250}
         "four" {"id" "four" "width" 250 "height" 250}
         "five" {"id" "five" "width" 250 "height" 250}}))
        

(route "/api/series/<name>" ["GET"]
    (fn [name]
        (setv response.content_type "application/json")
        {"data" (sample (range 100) 20)}))


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
