def selection(l):
    for i in xrange(len(l)):
        n = i
        # ripple next sub-list
        for k in xrange(i+1, len(l)):
            if l[k] < l[n]:
                n = k
        # swap
        l[n], l[i] = l[i], l[n]
    return l

print selection([1, 3, 6, 2, 4])
