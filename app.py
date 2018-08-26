# -*-coding:utf-8-*-                                                                                                                                     
import os
import sys
import json
import time
import sqlite3
import argparse
from datetime import datetime, timedelta

import tornado.autoreload
import tornado.ioloop
import tornado.web
import tornado.websocket

import chain
ch = chain.Manager()

class ChatHandler(tornado.websocket.WebSocketHandler):

    waiters = set()
    def check_origin(self, origin):
        return True

    def open(self, *args, **kwargs):
        self.waiters.add(self)

    def on_message(self, message):
        print(message)
        # ここでメッセージ処理を書く
        message = json.loads(message)

        to_send = ch.process(message)
        print("process fin: ", to_send)

        for waiter in self.waiters:
            # if waiter == self:
            #     continue
            for msg_to_send in to_send:
                waiter.write_message(msg_to_send)

    def on_close(self):
        self.waiters.remove(self)

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render(
            "index.html",
            bind_ip_port=bind_ip_port
        )

    def data_received(self, chunk):
        pass

application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/chat", ChatHandler)],
    template_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), "template"),
    static_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), "static"),
    debug=True
)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--bind_ip", "-b", help="ip address which will be embedded in index.html", dest="bind_ip", type=str, default="localhost")
    args = parser.parse_args()

    bind_ip = args.bind_ip
    print("Server is at: {}.".format(bind_ip))

    local_port = 8000
    application.listen(local_port)
    print("Server is up on port {}.".format(local_port))

    bind_ip_port = "{0}:{1}".format(bind_ip, local_port)

    print("access http://{0}:{1} on your browser".format(bind_ip, local_port))

    tornado.ioloop.IOLoop.current().start()
