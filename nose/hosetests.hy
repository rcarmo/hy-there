(import os sys logging nose)
(import [nose.plugins [Plugin]])
(import [nose.case [FunctionTestCase Test]])
(import [hy.importer [import_file_to_module]])

(setv log (.getLogger logging "nose.plugins.hylang"))

(.setLevel log logging.DEBUG)

(defclass HoseTests [Plugin]
    [[name "HoseTests"]
     [options
        (fn [self parser &optional [env os.environ]]
            (.options (super HoseTests self) parser env))]
     [configure
        (fn [self options conf]
            (.configure (super HoseTests self) options conf)
            (setv self.enabled True))]
     [finalize 
        (fn [self result]
            (.debug log "Loaded"))]
     [wantFile
        (fn [self file]
            (if (.endswith file ".hy")
                True))]
     [loadTestsFromFile
        (fn [self filename] 
            (.debug log "loadTestsFromFile")
            (.debug log filename)
            (let [[mod (import_file_to_module "test" filename)]]
                (for (i (dir mod))
                    ; just grab anything that looks like a test for now
                    (if (in "test_" i)
                        (yield (FunctionTestCase (getattr mod i))))))
        )]])

(if (= __name__ "__main__")
    (kwapply (nose.main) {"addplugins" [(HoseTests)]}))
