; A Hy version of my Python SAPO Broker client
(import [json [dumps]]
        [struct]
        [socket [connect sendall close socket recv recvfrom AF_INET SOCK_STREAM]]
        [base64 [encodestring]])

(defn pack [topic message &optional [action "PUBLISH"] [kind "TOPIC"]]
    (let [[msg (dumps (if (= action "PUBLISH") 
                   {"action"
                       {"publish"
                           {"destination" topic "destination_type" kind "message" {"payload" message}}
                           "action_type" action}}
                   {"action"
                       {action
                           {"destination" topic "destination_type" kind
                           "action_type" action}}})) ]]
        (struct.pack (% "!hhi%ds" (len msg)) 3 0 (len msg) msg)))


(defn publish [host topic message &optional [proto SOCK_STREAM] [port 3323]
    (let [[msg (encodestring message)]
          [sock (socket AF_INET proto)]]
        (if (= proto SOCK_STREAM)
            (do 
                (.connect sock (, host port)) ; requires a tuple
                (.sendall sock (pack topic message))
                (.close sock))
            (.sendto sock (pack topic message) (, host port)))))


(defn subscribe [host topic channel &optional [port 3323]]
    (let [[sock (socket AF_INET proto)]
          [prev ""]]
        (do
            (.connect sock (, host port))
            (.sendall sock (apply pack [topic ""] {"action" "SUBSCRIBE"})))
        (try
            (while True 
                (let [[raw (.recv sock 8192)]]
                    
                ))
            (catch [e Exception]
                (print e)))))

(print (pack "topic" "message"))
