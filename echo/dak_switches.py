""" fauxmo_minimal.py - Fabricate.IO

    This is a demo python file showing what can be done with the debounce_handler.
    The handler prints True when you say "Alexa, device on" and False when you say
    "Alexa, device off".

    If you have two or more Echos, it only handles the one that hears you more clearly.
    You can have an Echo per room and not worry about your handlers triggering for
    those other rooms.

    The IP of the triggering Echo is also passed into the act() function, so you can
    do different things based on which Echo triggered the handler.
"""

import fauxmo
import logging
import time
import urllib2

logging.basicConfig(level=logging.DEBUG)
device_list = {"lamp": 52000, "fan": 52001, "strip": 52002, "wake": 52003, "sleep": 52004}
def open_url(url):
    try:
        return urllib2.urlopen(url)
    except e:
        print e
        print "Failed to contact API Endpoint."
        return 1
class device_handler():
    def __init__(self, name):
        self.name = name

    def on(self, client_address):
        state = "on";
        print "Setting device", self.name, "to", state, "from client @", client_address
        open_url("http://127.0.0.1:3000/api/"+self.name+"-"+state)
        return True

    def off(self, client_address):
        state = "off";
        print "Setting device", self.name, "to", state, "from client @", client_address
        open_url("http://127.0.0.1:3000/api/"+self.name+"-"+state)
        return True

if __name__ == "__main__":
    # Startup the fauxmo server
    fauxmo.DEBUG = True
    p = fauxmo.poller()
    u = fauxmo.upnp_broadcast_responder()
    u.init_socket()
    p.add(u)

    # Register the device callback as a fauxmo handler
    for trig, port in device_list.items():
        d = device_handler(trig)
        fauxmo.fauxmo(trig, u, p, None, port, d)

    # Loop and poll for incoming Echo requests
    logging.debug("Entering fauxmo polling loop")
    while True:
        try:
            # Allow time for a ctrl-c to stop the process
            p.poll(100)
            time.sleep(0.1)
        except Exception, e:
            logging.critical("Critical exception: " + str(e))
            break
