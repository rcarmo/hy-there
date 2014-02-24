; a fancy way to do this via reduce

(defn interesting [x]
    (not (and (% x 5) (% x 3))))

(defn add [x y] ; hy can't seem to do (reduce + ...)
    (+ x y))

(print (reduce add (filter interesting (xrange 1000))))

; remove commons

(defn add-divisible [n limit]
    (let [[p (// (- limit 1) n)]]
        (// (* n (* p (+ 1 p))) 2)))

(print
    (-
        (+ (add-divisible 3 1000)
           (add-divisible 5 1000))
        (add-divisible 15 1000)))
