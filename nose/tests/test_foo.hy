(import os sys logging)
(import [nose.tools [eq_]])

(defn test-fail []
    (assert (= 4 5)))
