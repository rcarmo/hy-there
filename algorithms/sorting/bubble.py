def bubble(l):
    for i in xrange(len(l)):
        for k in xrange(len(l) - 1, i, -1):
            if l[k] < l[k-1]:
                l[k], l[k-1] = l[k-1], l[k]
    return l

print bubble([1, 3, 6, 2, 4])
