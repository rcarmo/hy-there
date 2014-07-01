; A straight port of the goless library example (runs fine with the PyPy backend)
(import [goless [go chan]])

(setv done (chan))
(setv msgs (chan))
(setv out (chan))

(defn produce []
    (for [i (xrange 10)]
        (.send msgs i))
    (.send done))

(defn consume [name]
    (for [msg msgs]
        (.send out (% "%s:%s" (, name msg)))))

(defn logger []
    (for [msg out]
        (print msg)))

(go produce)
(go consume "one")
(go consume "two")
(go consume "three")
(go logger)
(.recv done)
