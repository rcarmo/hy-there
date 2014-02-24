; a fancy way to do this via reduce

(defn interesting [x]
    (not (and (% x 5) (% x 3))))

(defn add [x y] ; hy can't seem to do (reduce + ...)
    (+ x y))

(print (reduce add (filter interesting (xrange 1000))))
