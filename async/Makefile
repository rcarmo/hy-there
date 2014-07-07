profile.png:
	hy producer_consumer.hy
	#gprof2dot -f pstats out.pstats | dot -Tsvg > profile.svg
	gprof2dot -f pstats out.pstats | dot -Tpng > profile.png
	rm out.pstats
