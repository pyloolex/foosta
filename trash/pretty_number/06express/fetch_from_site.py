import json
import time

from selenium import webdriver
from selenium.webdriver.common.by import By

N = 28  # 28

def process_page(page):
    data = page.find_elements_by_css_selector('.product-inner.clearfix')
    res = []
    for elem in data:
        lnk = elem.find_elements_by_css_selector(
            '.mf-product-thumbnail')[0].find_elements_by_css_selector('a')[0]
        number = lnk.get_attribute('href').rstrip('/').rpartition('/')[-1]
        try:
            price = elem.find_elements_by_css_selector('bdi')[0].text[1:]
        except:
            continue

        res.append({
            'number': number,
            'price': price,
        })

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

    result = []
    for page_number in range(1, N):
        address = (
            'https://06express.nl/product-categorie/alle-06-nummers/page/' +
            str(page_number)
        )
        print(address)
        #import pdb;pdb.set_trace()
        driver.get(address)
        temp = process_page(driver)
        #time.sleep(1)

        result.extend(temp)

    fl = open('res.json', 'w')
    json.dump(result, fl, indent=2)


if __name__ == '__main__':
    main()
