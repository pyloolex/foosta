import json
import os
import pdb
import time

from selenium import webdriver
from selenium.webdriver.common.by import By

N = 9  # 44

def process_page(page):
    #pdb.set_trace()
    data = page.find_elements(By.CSS_SELECTOR, '.product')
    res = {}
    for elem in data:
        number = elem.find_element(By.CSS_SELECTOR, '.name').text.replace(' ', '').replace('-', '').replace('/', '')
        price = elem.find_element(By.CSS_SELECTOR, 'div.price').text.rpartition(' ')[-1].replace(',', '.')

        bad = False
        for c in number:
            if not c.isdigit():
                bad = True
                print('Bad symbol', c)
                break
        if bad:
            continue

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
            'https://www.easy06.nl/webshop/vanaf-2999/?page=' +
            str(page_number)
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
