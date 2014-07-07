profile.svg:
	hy producer_consumer.hy
	gprof2dot -f pstats out.pstats | dot -Tsvg > profile.svg
	rm out.pstats
