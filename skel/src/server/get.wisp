(.get (http.get {:host "http://www.sapo.pt"}
  (fn [res]
    (let [data ""]
      (res.on "data" #(+ data %))
      (res.on "end" data)))))


