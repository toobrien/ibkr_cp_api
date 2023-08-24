from json       import dumps, loads
from requests   import get, post
from sys        import argv
from websocket  import create_connection
from ssl        import CERT_NONE

# ...


REST_URI    = "https://localhost:5000/v1/api"
WS_URI      = "wss://localhost:5000/v1/api/ws"


def secdef(conid: int):

    res = post(
                url     = f"{REST_URI}/trsrv/secdef",
                verify  = False,
                json    = {
                            "conids": [ conid ]
                        }
            )
        
    print(dumps(res.json(), indent = 2))


def ws_quote(conid: int):

    res = post(f"{REST_URI}/tickle", verify = False)

    if res.status_code != 200:

        print(res.text)

        exit()

    ws = create_connection(
            url     = WS_URI,
            sslopt  = { "cert_reqs": CERT_NONE }
        )
    
    ws.recv() # skip initial messages before sending market data subscribe
    ws.recv()
    ws.recv()
    
    ws.send(f'smd+{conid}+{{ "fields": [ "31", "84", "85", "86", "88", "TimestampBase", "TimestampDelta" ] }}')

    while(True):

        msg = loads(ws.recv().decode("utf-8"))

        print(dumps(msg, indent = 2))


TESTS = [
            secdef,
            ws_quote
        ]



if __name__ == "__main__":

    test = int(argv[1])
    args = argv[2:] if len(argv) > 2 else []

    TESTS[test](*args)