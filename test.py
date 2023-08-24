from json       import dumps
from requests   import get, post


# ...

HOST_URI = "https://localhost:5000"

if __name__ == "__main__":

    res = post(
            url     = f"{HOST_URI}/v1/api/trsrv/secdef",
            verify  = False,
            json    = {
                        "conids": [ 
                            645111234, 
                            645111279, 
                            645111251 
                        ]
                    }
        )
    
    print(dumps(res.json(), indent = 2))