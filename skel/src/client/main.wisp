; vim: set filetype=clojure:
(set! **print-compiled** true)

;(ns app.main)
;  (:require [wisp.sequence :refer [first rest list conj]]))

(set! (.-exports window) {})


(defn ajax
  [url callback]
  (def request
    (if window.XMLHttpRequest
      (XMLHttpRequest.)
      (ActiveXObject. "Microsoft.XMLHTTP")))
  (.open request :GET url true)
  (if request.override-mime-type
    (.override-mime-type request "application/json"))
  (set! request.onreadystatechange
        (fn []
          (if (identical? request.ready-state 4)
            (if (or (identical? request.status 0)
                    (identical? request.status 200))
              (callback (JSON.parse request.response-text))
              (callback nil)))))
  (.send request null))


(defn setup-events [url]
   (let [source (new EventSource url)]
		(.addEventListener 
   			source	 
   			"refresh"
   			(fn [] (location.reload True))
   			false)
   		(set! source.open
   			(fn []
   				(console.log "event source open")))
   		(set! source.onerror
   			(fn []
   				(console.log "event source error")))
   		(set! source.onmessage
   			(fn [event]
   				(console.log event)))))


(set! ko.on-demand-observable
    ; augmented computed observable based on http://www.knockmeout.net/2011/06/lazy-loading-observable-in-knockoutjs.html
    (fn [callback target] 
        (console.log (+ "odo:" callback))
        (console.log (+ "odo:" (JSON.stringify target)))
        (def _value (ko.observable))
        (def result
            (ko.computed {
              ; if it hasn't been loaded, issue a callback
              :read  (fn []
                        (if (not (.loaded result))
                           (.call callback target))
                        (_value))
              ; set it as loaded
              :write (fn [new-value]
                        (.loaded result true)
                        (_value new-value))
              ; do not evaluate immediately when created
              :deferEvaluation true}))
        ; our internal state, which can be used for UI feedback
        (set! result.loaded (ko.observable))
        ; our refresh handler - set loaded to false and have the callback re-invoked
        (set! result.refresh (fn [] (.loaded result false)))
        result))


(set! ko.observable-chart
    (fn [callback chart-id] 
        (def _values (ko.observableArray))
        (def result
            (ko.computed {
              ; if it hasn't been loaded, issue a callback
              :read  (fn []
                        (if (not (.loaded result))
                           (.call callback chart-id))
                        (_values))
              ; set it as loaded
              :write (fn [new-values]
                        (.loaded result true)
                        (_values new-values)) ; redraw chart here
              ; do not evaluate immediately when created
              :deferEvaluation true}))
        ; our internal state, which can be used for UI feedback
        (set! result.loaded (ko.observable))
        ; our refresh handler - set loaded to false and have the callback re-invoked
        (set! result.refresh (fn [] (.loaded result false)))
        result))

(defn dash-model []
  (set! self this)
  (set! this.charts (ko.on-demand-observable (fn [] (ajax "/items" (fn [data] self.data data)))))
  self)


(defn chart-model [] 
  (set! self this)
  (set! this.charts (ko.observable-array [{"id" "one" "height" 150 "width"  200}]))
  (set! this.data (ko.on-demand-observable 
    (fn [] (ajax "/data/one" (fn [data] (self.data data))))))
  self)


(set! dash (new dash-model))

(def chart
  (.Line (new Chart (.getContext (.item (document.get-elements-by-tag-name "canvas") 0) "2d"))
         (model.data) {"animation" false}))

;         {"labels"   ["January" "February" "March" "April" "May" "June"]
;         "datasets" [{
;            "fillColor"         "rgba(220,220,220,0.5)"
;            "strokeColor"       "rgba(220,220,220,1)"
;            "pointColor"        "rgba(220,220,220,1)"
;            "pointStrokeColor"  "#fff"
;            "data"              [65 59 90 81 16 51]
;         }]} {"animation" false}))

(ko.applyBindings dash (document.get-element-by-id "dash"))
(print "loaded.")
