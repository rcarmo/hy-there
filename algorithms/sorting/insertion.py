def insertion(l):
    for i in xrange(1, len(l)):
        n = l[i]
        k = i
        # ripple back
        while k > 0 and n < l[k-1]:
            l[k] = l[k-1]
            k -= 1
        l[k] = n
    return l

print insertion([1, 4, 5, 2, 3, 9])
