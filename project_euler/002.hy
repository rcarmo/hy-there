; basic recursion

(defn fib-recur [n]
    (if (<= n 1)
        1
        (+ (fib-recur (- n 1)) (fib-recur (- n 2)))))

; iterative, SICP-inspired

(defn fib-iter [n]
    (defn fib-inner [n a b i]
        (if (= i n)
            b
            (fib-inner n b (+ a b) (+ i 1))))
    (if (<= n 1)
        n
        (fib-inner n 0 1 1)))

; generator

(defn fib []
    (setv a 0)
    (setv b 1)
    (while true
        (yield a)
        (setv (, a b) (, b (+ a b)))))


; decorator (taken from https://github.com/hylang/hy/issues/195)

(defn memoize [func]
    (setv cache {})

    (defn memoized_fn [*args]
        (if (in *args cache)
            (.get cache *args)
            (.setdefault cache *args (func *args))))
    memoized_fn)

(with-decorator memoize 
    (defn fib-recur-memo [n]
        (if (<= n 1)
            1
            (+ (fib-recur-memo (- n 1)) (fib-recur-memo (- n 2))))))

(defn even [x] (not (% x 2)))

(defn sum [x y] (+ x y))

; the even-valued terms occur every 3 items
(print (reduce sum (list-comp (fib-iter x) (x (range 36)) (= 0 (% x 3)))))
