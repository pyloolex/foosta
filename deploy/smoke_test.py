from selenium import webdriver
from selenium.webdriver.common.by import By

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

driver.get('http://localhost')

assert 'First_player_ever' in driver.page_source
assert 'Indispensable warrior' in driver.page_source
