; A straight port of the goless library example (runs fine with the PyPy backend)
(import [goless [go chan]]
        [cProfile [Profile]]
        [pstats [Stats]])

(setv p (Profile))
(setv done (chan))
(setv msgs (chan))
(setv out (chan))

(defn produce []
    (for [i (xrange 10000)]
        (.send msgs i))
    (.send done))

(defn consume [name]
    (for [msg msgs]
        (.send out (% "%s:%s" (, name msg)))))

(defn logger []
    (for [msg out]
        (print msg)))

(.enable p)
(go produce)
(go consume "one")
(go consume "two")
(go consume "three")
(go logger)
(.recv done)
(.disable p)
(.dump_stats (Stats p) "out.pstats")
