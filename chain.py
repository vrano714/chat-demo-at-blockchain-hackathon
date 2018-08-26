import hashlib

class Manager:
    def __init__(self):
        self.messages = {}
        self.chain = []

    def process(self, message):
        print("new message is coming to process")
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
            # self.messagesの中からlike対象を探してlikeを+1する
            self.messages[opinion_id]["like"] += 1
            ret.append(
                {
                    "status": "like",
                    "id": opinion_id
                }
            )
            # そのメッセージのlikeがある値を超えたらハッシュをつけてchainに入れる
            if self.messages[opinion_id]["like"] >= 4:
                # chain化
                self.chain.append(
                    self.messages[opinion_id]
                )
                ret.append(
                    {
                        "status": "new_chain_message",
                        "data": self.messages[opinion_id]
                    }
                )
            
        print(self.messages)

        return ret