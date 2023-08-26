
class ibkr_cp_client {
 
    constructor(
        host = "localhost", 
        port = 5000
    ) {

        this.rest_uri   = `http://${host}:${port}/v1/api`;
        this.ws_uri     = `ws://${host}:${port}/v1/api/ws`;

    }

    async secdef(conids) {

        let res = await fetch(
                    `${this.rest_uri}/trsrv/secdef`,
                    {
                        method: "POST",
                        body: JSON.stringify(
                            {
                                conids: conids
                            }
                        ),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );
        
        return await res.json();

    }

}