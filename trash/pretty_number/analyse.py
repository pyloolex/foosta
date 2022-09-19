import json
import sys
import time

from selenium import webdriver
from selenium.webdriver.common.by import By


def convert(x):
    price = x
    if ',' in price:
        price = price.replace(',', '')
    return int(float(price))


def calc_beauty(s):
    st = set(s)
    st.discard('+')
    return len(st)


def main():
    fl = open(sys.argv[1])
    data = json.load(fl)

    res = []
    for number, entry in data.items():
        #assert number.startswith('06'), number
        if not number.startswith('06'):
            print('Bad number', number)

        if number.count('0') < 5:
            continue
        if number.count('6') + number.count('9') > 2:
            continue

        res.append({
            'number': number,
            'price': entry['price'],
        })

    sorte = sorted(res, key=lambda x: -convert(x['price']))
    for elem in sorte:
        form2 = '+31' + elem['number'][1:]
        beauty1 = calc_beauty(elem['number'])
        beauty2 = calc_beauty(form2)
        #if beauty1 + beauty2 > 11:
        #    continue
        #if beauty1 > 4:
        #    continue

        print (elem['number'], convert(elem['price']), form2,
               beauty1, beauty2, beauty1 + beauty2)



if __name__ == '__main__':
    main()
