import collections
import hashlib
import json

class Manager:
    def __init__(self):
        self.messages = collections.OrderedDict()#{}
        self.chain = []

        # chainの最初のブロックを作る
        self.chain.append(
            {
                "id": "00000",
                "transaction": {
                    "name": "root",
                    "content": "root",
                    "id": "000000000000"
                }
            }
        )

    def process(self, message):
        ret = []
        data = message["data"]
        opinion_id = message["data"]["id"]

        if message["status"] == "new":
            self.messages[opinion_id] = data
            ret.append(
                {
                    "status": "new_realtime_message",
                    "data": data
                }
            )
        elif message["status"] == "like":
            self.messages[opinion_id]["like"] += 1
            ret.append(
                {
                    "status": "like",
                    "id": opinion_id
                }
            )
            if self.messages[opinion_id]["like"] == 4:
                self.chain.append(
                    self.make_block(self.messages[opinion_id])
                )
                ret.append(
                    {
                        "status": "new_chain_message",
                        "data": self.chain[-1]
                    }
                )
            
        print(self.messages)

        return ret

    def make_block(self, message):
        m = hashlib.sha256()
        
        m.update(
            json.dumps(self.chain[-1]).encode("utf-8")
        )

        blk = {
            "previous_hash": m.hexdigest(),
            "transaction": message
        }

        return blk

    def get_all_messages(self):
        ret = []
        for k in self.messages.keys():
            ret.append(
                {
                    "status": "logged_realtime_message",
                    "data": self.messages[k]
                }
            )

        return ret

    def get_all_chains(self):
        ret = []
        for c in self.chain[1:]:
            ret.append(
                {
                    "status": "new_chain_message",
                    "data": c
                }
            )

        return ret