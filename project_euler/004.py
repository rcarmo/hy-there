def is_palindrome(number):
    number = str(number)
    return number[:len(number)/2] == number[:len(number)/2-1:-1]

palindromes = []
for i in range(999, 100, -1):
    for j in range(i, 100, -1):
        if is_palindrome(i*j):
            palindromes.append(i*j)

print max(palindromes)
