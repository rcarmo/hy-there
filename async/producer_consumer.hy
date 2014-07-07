; A straight port of the goless library example (runs fine with the PyPy backend)
(import [goless [go chan]]
        [cProfile [Profile]]
        [pstats [Stats]]
        [functools [partial]])


(defn produce [msgs done count]
    (for [i (xrange count)]
        (.send msgs i))
    (.send done))

(defn consume [msgs out name]
    (for [msg msgs]
        (.send out (% "%s:%s" (, name msg)))))

(defn logger [out]
    (for [msg out]
        (print msg)))

(let [[p (Profile)]
      [done (chan)]
      [msgs (chan)]
      [out  (chan)]]
      ; enable profiler
      (.enable p)
      ; start a producer
      (go produce msgs done 10000)
      ; start three consumers
      (map (partial go consume msgs out) ["one" "two" "three"])
      ; start a logger
      (go logger out)
      ; wait for completion
      (.recv done)
      ; stop profiler
      (.disable p)
      (.dump_stats (Stats p) "out.pstats"))
