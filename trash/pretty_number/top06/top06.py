import json
import os
import pdb
import time

from selenium import webdriver
from selenium.webdriver.common.by import By

M = 15
N = 20  # 44


def process_page(page):
    #pdb.set_trace()
    data = page.find_elements(By.CSS_SELECTOR, '.woocommerce-LoopProduct-link.woocommerce-loop-product__link')
    res = {}
    for elem in data:
        try:
            elem.find_element(By.CSS_SELECTOR, '.mk-out-of-stock')
        except:
            pass
        else:
            continue

        number = elem.find_element(By.CSS_SELECTOR, '.woocommerce-loop-product__title').text.replace(' ', '').replace('-', '').replace('/', '').replace('|', '').replace('\\', '')
        bad = False
        for c in number:
            if not c.isdigit():
                bad = True
                print(c)
                break
        if bad:
            continue

        price = elem.find_element(By.CSS_SELECTOR, 'bdi').text[1:]

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
    timer = 20
    driver.set_page_load_timeout(timer)

    result = {}
    for page_number in range(M, N):
        address = (
            'https://top06.nl/product-categorie/alle-06-nummers/page/%s/?min_price=1&max_price=100' % str(page_number)
        )
        print(address)
        #import pdb;pdb.set_trace()

        while True:
            try:
                driver.get(address)
            except:
                print('Timeout', timer)
                timer += 1
                driver.set_page_load_timeout(timer)
                continue
            else:
                print('OK', timer)
                timer -= 1
                driver.set_page_load_timeout(timer)
                break

        temp = process_page(driver)

        result.update(temp)

    fl_name = os.path.join(os.path.dirname(__file__), 'res.json')
    try:
        fl = open(fl_name)
        data = json.load(fl)
        fl.close()
        data.update(result)
    except:
        data = result

    fl = open(fl_name, 'w')
    json.dump(data, fl, indent=2)


if __name__ == '__main__':
    main()
