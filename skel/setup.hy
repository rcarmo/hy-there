(import [distutils.core [setup]])
(import [distutils.command.build [build]])

(defclass buildsteps [build]
   "custom build steps"
   [[run (fn [self] 
         (build.run self)
         (print "foobar!"))]])

(kwapply (setup) {"cmdclass" {"build" buildsteps}})
