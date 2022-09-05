import json
import os
import pdb
import time

from selenium import webdriver
from selenium.webdriver.common.by import By

N = 14  # 14

def process_page(page):
    #pdb.set_trace()
    data = page.find_elements(By.CSS_SELECTOR, '.product')
    res = {}
    for elem in data:
        number = elem.find_element(By.CSS_SELECTOR, '.woocommerce-loop-product__title').text.replace(' ', '').replace('-', '').replace('|', '').replace('\\', '').replace('/', '')
        bad = False
        for c in number:
            if not c.isdigit():
                bad = True
                print(c)
                break
        if bad:
            continue

        price = elem.find_element(By.CSS_SELECTOR, '.woocommerce-Price-amount.amount').text.partition(
' ')[0][1:]

        res[number] = {
            'price': price,
        }

    return res


def main():
    options = webdriver.ChromeOptions()
    options.add_argument('headless')
    options.add_argument("disable-gpu")

    # Some of these flags might suddenly help.
    # If you face a problem with this test on CI,
    # play around with these flags.
    #
    # options.add_argument("start-maximized")
    # options.add_argument("enable-automation")
    # options.add_argument("no-sandbox")
    # options.add_argument("disable-infobars")
    # options.add_argument("disable-dev-shm-usage")
    # options.add_argument("disable-browser-side-navigation")

    driver = webdriver.Chrome(options=options)

    result = {}
    for page_number in range(1, N):
        address = (
            'https://zer06x.nl/product-category/alle-06-nummers/page/%s/?min_price=0&max_price=100' % str(page_number)
        )
        print(address)
        #import pdb;pdb.set_trace()
        driver.get(address)
        temp = process_page(driver)
        #time.sleep(1)

        result.update(temp)

    fl_name = os.path.join(os.path.dirname(__file__), 'res.json')
    fl = open(fl_name, 'w')
    json.dump(result, fl, indent=2)


if __name__ == '__main__':
    main()
