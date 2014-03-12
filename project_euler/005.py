def is_divisible(number):
    for d in range(20,2,-1):
        if divmod(number,d)[1]:
            return False
    return True

i = 20
while True:
    i += 20
    if is_divisible(i):
        print i
        break
