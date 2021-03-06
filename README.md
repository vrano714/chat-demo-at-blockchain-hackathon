# ブロックチェーンハッカソン合宿デモWebアプリ

<img width="410" alt="2018-09-01 12 57 53" src="https://user-images.githubusercontent.com/12181846/44942161-c260b080-ade6-11e8-9a1a-629c0deb3209.png">


このリポジトリはブロックチェーンの応用を考えるハッカソン合宿で実装されたデモです．

Websocketベースのチャットで，メッセージにlikeを行えます．  
4以上likeがつくとchain側にメッセージがブロックとして記録されます．  
バックエンドでは前ブロックのハッシュを求めて，新しいブロックに設定をする操作が入っています．

## Requirements

* Python >= 3.6.5 (作者の環境が3.6.5です．それより下でも動くかも)
* tornado >= 5.0.2 (作者の環境が3.6.5です．それより下でも動くかも)

## 起動

実装の都合で，(1)自分のみで試す場合と，(2)他の人にもアクセスさせる場合でオプションが変わります．

### 自分のみで試す

オプションは不要です．

```bash
$ cd <location-of-this-repo> #このリポジトリの場所まで移動してください
$ python app.py
Server is at: localhost.
Server is up on port 8000.
access http://localhost:8000 on your browser
```

### 他の人にもアクセスさせる

IPアドレスを指定するオプションを利用します．  
事前に自分のPCのIPアドレスを調べておきましょう．

```bash
# 自分のIPアドレスが 192.168.1.2 だとします．
$ cd <location-of-this-repo> #このリポジトリの場所まで移動してください
$ python app.py --bind-ip 192.168.1.2
Server is at: 192.168.1.2.
Server is up on port 8000.
access http://192.168.1.2:8000 on your browser
```

## 利用

起動したら，ターミナルに表示されるアドレスにアクセスしてみましょう．  
(Google Chrome 推奨)

送信されたメッセージの本文をクリックするとlikeをつけられます．  
枠の色がピンク色になりますが，何度でもlikeをつけられるようにしてあります．  
likeが4より多くなった場合は，そのメッセージがchain側に追加されます．
