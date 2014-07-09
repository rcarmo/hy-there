; A Hy version of my Python SAPO Broker client
(import [json   [dumps loads]]
        [socket [socket AF_INET SOCK_STREAM]]
        [base64 [encodestring]]
        [goless [go chan]]
        [struct]
        [logging])

(def log (.getLogger logging))

(defn pack [topic message &optional [action "PUBLISH"] [kind "TOPIC"]]
    (let [[msg (dumps (if (= action "PUBLISH") 
                   {"action"
                       {"publish"
                           {"destination" topic "destination_type" kind "message" {"payload" message}}
                           "action_type" action}}
                   {"action"
                       {action
                           {"destination" topic "destination_type" kind
                           "action_type" action}}}))]]
        (struct.pack (% "!hhi%ds" (len msg)) 3 0 (len msg) msg)))


(defn publish [host topic message &optional [proto SOCK_STREAM] [port 3323]]
    (let [[msg  (encodestring message)]
          [sock (socket AF_INET proto)]]
        (if (= proto SOCK_STREAM)
            (do 
                (.connect sock (, host port)) ; requires a tuple
                (.sendall sock (pack topic message))
                (.close sock))
            (.sendto sock (pack topic message) (, host port)))))


(defn subscribe [host topic chan &optional [port 3323]]
    (let [[sock (socket AF_INET proto)]
          [prev ""]]
        (do
            (.connect sock (, host port))
            (.sendall sock (apply pack [topic ""] {"action" "SUBSCRIBE"})))
        (try
            (while True 
                (let [[raw (.recv sock 8192)]
                      [buffer (+ prev raw)]
                      [length 0]]
                    (while (len buffer)
                        (setv length 0)
                        (try
                            (let [[(, _ _ length) (struct.unpack "!hh" (slice buffer 0 8))]
                                  [payload (slice buffer 8 (+ 8 length))]
                                  [buffer (slice buffer (+ 8 length))]]
                                (.send chan (loads payload)))
                            (catch [e Exception]
                                (setv prev buffer)
                                (break))))))
            (catch [e Exception]
                (print e)))))

(.info log (pack "topic" "message"))
