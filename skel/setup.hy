(import [os [walk]]
        [os.path [join splitext]]
        [distutils.core [setup]]
        [distutils.command.build [build]]
        [fnmatch [fnmatch]]
        [subprocess [Popen PIPE]])

(defn glob [path pattern]
    "find all files matching a given pattern"
    (for (step (walk path))
        (for (basename (nth step 2))
            (if (fnmatch basename pattern)
                (yield (join (nth step 0) basename))))))

(defn wisp-compile [filename]
    "compile .wisp files into .js"
    (print (% "-> %s" filename))
    (.communicate
        (kwapply (Popen "wisp")
            {"stdin"  (open filename "r")
             "stdout" (open (+ (first (splitext filename)) ".js") "w")})))

(defclass custom-build [build]
    "custom build steps"
    [[run
        (fn [self] 
        (build.run self)
        (map wisp-compile (glob "src" "*.wisp")))]])

(kwapply (setup) {"cmdclass" {"build" custom-build}})
