(import [os [walk makedirs unlink]]
        [os.path [join splitext exists dirname]]
        [distutils.core [setup]]
        [distutils.command.build [build]]
        [fnmatch [fnmatch]]
        [shutil [copyfile copyfileobj]]
        [subprocess [Popen PIPE]])


(defn glob [path pattern]
    "find all files matching a given pattern"
    (for (step (walk path))
        (for (basename (nth step 2))
            (if (fnmatch basename pattern)
                (yield (join (nth step 0) basename))))))


(defn wisp-compile [filename]
    "compile .wisp files into .js"
    (print (% "=> %s" filename))
    (.communicate
        (kwapply (Popen "wisp")
            {"stdin"  (open filename "r")
             "stdout" (open (+ (first (splitext filename)) ".js") "w")})))


(defn copy-to-target [filename]
    "copy files to target directory"
    (setv dest (.replace filename "src" "target" 1))
    (print (% "%s -> %s" (, filename dest)))
    (if (not (exists (dirname dest))) (makedirs (dirname dest)))
    (copyfile filename dest))


(defn make-bundle [files bundle]
    "make a file bundle"
    (try (unlink bundle))
    (with [b (open bundle "a")]
        (map
            (fn [file]
                (print (% "%s +> %s" (, file bundle)))
                (copyfileobj (open file "r") b))
            files)))
        

(defclass custom-build [build]
    "custom build steps"
    [[run
        (fn [self] 
            (build.run self)
            (map wisp-compile (glob "src" "*.wisp"))
            (make-bundle (glob "src/client" "*.js") "src/client/bundle.js")
            (map
                (fn [p] (map copy-to-target (glob "src/client" p)))
                ["*.html" "*.css" "bundle.js"]))]])

(kwapply (setup) {"cmdclass" {"build" custom-build}})
