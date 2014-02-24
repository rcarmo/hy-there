; a fancy way to do this via reduce

(defn interesting [x]
    (if (not (and (% x 5) (% x 3)))
        true
        false))

(defn add [x y]
    (+ x y))

(print (reduce add (filter interesting (xrange 1000))))
