; A Hy version of my Python SAPO Broker client using the JSON transport
(import [json   [dumps loads]]
        [socket [socket AF_INET SOCK_STREAM]]
        [base64 [encodestring decodestring]]
        [goless [go chan]]
        [struct]
        [logging]
        [sys])


(defn pack [topic message &optional [action "PUBLISH"] [kind "TOPIC"]]
    (let [[msg (dumps (if (and (= action "PUBLISH") message) 
                   {"action"
                       {"publish"
                           {"destination" topic "destination_type" kind "message" {"payload" message}}}
                           "action_type" "PUBLISH"}
                   {"action"
                       {"subscribe"
                           {"destination" topic "destination_type" kind}
                            "action_type" "SUBSCRIBE"}}))]]
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


(defn take-bytes [count sock]
    (let [[buffer (bytearray)]]
        (while (< (len buffer) count)
            (setv buffer (+ buffer (.recv sock (- count (len buffer))))))
        buffer))


(defn subscribe [host topic channel &optional [proto SOCK_STREAM] [port 3323]]
    (let [[sock (socket AF_INET proto)]]
        (.connect sock (, host port))
        (.sendall sock (apply pack [topic None] {"action" "SUBSCRIBE"}))
        (while true
            (try
                (let [[header (take-bytes 8 sock)]
                      [(, _ _ length) (struct.unpack "!hhi" header)]
                      [payload (take-bytes length sock)]]
                    (.send channel (loads (unicode payload))))
                (catch [e Exception]
                    (print ">>" e)
                    (break))))))


(defn logger [channel]
    (for [msg channel] 
        (print ">" (decodestring (get (get (get (get msg "action") "notification") "message") "payload")))))


(let [[events (chan)]
      [done   (chan)]]
    (go subscribe "broker.labs.sapo.pt" "/sapo.*" events)
    (go logger events)
    (.recv done))

