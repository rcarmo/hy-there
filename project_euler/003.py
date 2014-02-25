def largest_prime_factor(n):
    l = 2
    while (n > l):
        if not (n % l):
            n = n / l
            l = 2
        else:
            l += 1
    return l

print largest_prime_factor(13195)
print largest_prime_factor(600851475143)
