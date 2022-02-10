def a(m):
    return 28 + ((0x2eeeecc >> (2*m)) & 3)

def b(m):
    return 28 + ((0x3bbeecc >> (2*m)) & 3)


for i in range(1, 13):
    print(a(i), b(i))
