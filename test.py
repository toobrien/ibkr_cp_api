from json       import dumps, loads
from requests   import get, post
from sys        import argv
from websocket  import create_connection
from ssl        import CERT_NONE
from time       import time


# python test.py <test_name> <args>

# note: disable https in config.yaml


REST_URI    = "http://localhost:5000/v1/api"
WS_URI      = "ws://localhost:5000/v1/api/ws"


def secdef(conid: int):

    res = post(
                url     = f"{REST_URI}/trsrv/secdef",
                json    = { "conids": [ conid ] }
            )
        
    print(dumps(res.json(), indent = 2))


def portfolio_summary(account_id: str):

    res = get(f"{REST_URI}/portfolio/{account_id}/summary")

    print(dumps(res.json(), indent = 2))


def search(symbol: str, name: bool, secType: str):

    name = bool(name)

    res = post(
            url     = f"{REST_URI}/iserver/secdef/search",
            json    = {
                        "symbol":   symbol,
                        "name":     name,
                        "secType":  secType
                    }
        )

    print(dumps(res.json()[0], indent = 2))


# month is like "202308" or "AUG23"

def strikes(conid: str, sectype: str, month: str, exchange: str = None):

    url = f"{REST_URI}/iserver/secdef/strikes?conid={conid}&sectype={sectype}&month={month}"

    if exchange:

        url += f"&exchange={exchange}"

    res = get(url)

    print(dumps(res.json(), indent = 2))


def secdef_info(
    conid:      str,
    sectype:    str,
    month:      str = None, 
    exchange:   str = None,
    strike:     str = None,
    right:      str = None
):

    url = f"{REST_URI}/iserver/secdef/info?conid={conid}&sectype={sectype}"
    
    if month:

        url += f"&month={month}"

    if exchange:

        url += f"&exchange={exchange}"

    if strike:

        url += f"&strike={strike}"
    
    if right:

        url += f"&right={right}"

    res = get(url)
    
    print(dumps(res.json(), indent = 2))


def contract_info(conid: str):

    res = get(f"{REST_URI}/iserver/contract/{conid}/info")

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


def server():

    pass


TESTS = {
            "secdef":               secdef,
            "portfolio_summary":    portfolio_summary,
            "search":               search,
            "strikes":              strikes,
            "secdef_info":          secdef_info,
            "contract_info":        contract_info,
            "ws_quote":             ws_quote,
            "server":               server
        }



if __name__ == "__main__":

    test = argv[1]
    args = argv[2:] if len(argv) > 2 else []

    t0 = time()

    TESTS[test](*args)

    print(f"elapsed: {time() - t0:0.3f}")
