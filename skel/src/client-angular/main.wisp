; vim: set filetype=clojure:
(set! **print-compiled** true)

;(ns app.main)
;  (:require [wisp.sequence :refer [first rest list conj]]))

(set! (.-exports window) {})

(defmacro ->
  [& operations]
  (reduce
   (fn [form operation]
     (cons (first operation)
           (cons form (rest operation))))
   (first operations)
   (rest operations)))

(def dash-app (angular.module "dash-app" []))


(dash-app.controller "dash-controller"
  (fn [$scope $http]
    (-> 
      ($http.get "/api/charts")
      (.success #(set! $scope.charts %)))))


(dash-app.controller "chart-controller"
  (fn [$scope $http]
    (-> 
      ($http.get (+ "/api/series/" $scope.chart.id))
      (.success #(set! $scope.data %)))))


(dash-app.directive "ds-chart"
  (fn [] { 
    :restrict "A"
    :scope { :data "=" :type "@" :options "=" :id "@" }
    :link
      (fn [$scope $elem]
        (set! ctx (.getContext $elem[0] "2d"))
        (set! chart (new Chart ctx))
        ($scope.$watch 
          "data"
          (fn [newVal oldVal] 
            ((get chart $scope.type) $scope.data $scope.options))
            true))}))

(print "loaded.")
