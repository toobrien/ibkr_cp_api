

class ibkr_cp_client {
 

    constructor(
        host = "localhost", 
        port = 5000
    ) {

        this.rest_uri   = `http://${host}:${port}/v1/api`;
        this.ws_uri     = `ws://${host}:${port}/v1/api/ws`;
        this.ws         = null;

        let def_ws_handler  = async (evt) =>  {

            if (evt.data) {
            
                let msg = JSON.parse(await evt.data.text(), null, 2);

                console.log(JSON.stringify(msg, null, 2));
            
            }

        }

        this.ws_cls_handler = def_ws_handler;
        this.ws_opn_handler = def_ws_handler;
        this.ws_err_handler = def_ws_handler;
        this.ws_msg_handler = def_ws_handler;

    }

    
    async secdef(conids) {

        let res = await fetch(
                    `${this.rest_uri}/trsrv/secdef`,
                    {
                        method:     "POST",
                        body:       JSON.stringify({ conids: conids }),
                        headers:    { "Content-Type": "application/json" }
                    }
                );
        
        return await res.json();

    }

    
    async search(symbol, name, secType) {

        let res = await fetch(
                    `${this.rest_uri}/iserver/secdef/search`,
                    {
                        method:     "POST",
                        body:       JSON.stringify(
                                        {
                                            symbol:     symbol,
                                            name:       name,
                                            secType:    secType
                                        }
                                    ),
                        headers:    { "Content-Type": "application/json" }
                    }
                );
        
        return await res.json();

    }

    
    async secdef_info(
        conid,
        sectype,
        month,
        exchange,
        strike,
        right
    ) {

        let url = `${this.rest_uri}/iserver/secdef/info?conid=${conid}&sectype=${sectype}`;

        if (month)      url += `&month=${month}`;
        if (exchange)   url += `&exchange=${exchange}`;
        if (strike)     url += `&strike=${strike}`;
        if (right)      url += `&right=${right}`;

        let res = await fetch(url);

        return await res.json();

    }


    async strikes(
        conid,
        sectype,
        month,
        exchange
    ) {

        let url = `${this.rest_uri}/iserver/secdef/strikes?conid=${conid}&sectype=${sectype}&month=${month}`;

        if (exchange) url += `&exchange=${exchange}`;

        let res = await fetch(url);

        return await res.json();

    }


    async init_ws() {

        let res = await fetch(`${this.rest_uri}/tickle`);

        if (res.status == 200) {

            let body            = await res.json();
            this.session        = body.session;
            this.ws             = new WebSocket(this.ws_uri);
            
            this.ws.onerror     = this.ws_err_handler;
            this.ws.onopen      = this.ws_opn_handler;
            this.ws.onmessage   = this.ws_msg_handler;
            this.ws.onclose     = this.ws_cls_handler;

            while (true)

                if (!this.ws.readyState)

                    // wait until websocket is ready
                
                    await new Promise(resolve => setTimeout(resolve, 1000));
                
                else

                    break;
            
        } else {

            // error receiving session token

            console.log(res.text);

            this.ws = null;

        }

    }


    async set_ws_handlers(
        msg_handler,
        err_handler,
        opn_handler,
        cls_handler
    ) {

        if (!this.ws) await this.init_ws();

        if (msg_handler) { 
            
            this.ws_msg_handler = msg_handler;
            this.ws.onmessage   = msg_handler;

        }

        if (err_handler) {
        
            this.ws_err_handler = err_handler;
            this.ws.onerror     = err_handler;
        
        }

        if (opn_handler) {
        
            this.ws_opn_handler = opn_handler
            this.ws.onopen      = opn_handler;
        
        }

        if (cls_handler) {
        
            this.ws.onclose     = cls_handler 
            this.ws.onclose     = cls_handler;
        
        }

    }


    async sub_market_data(conid) {

        if (!this.ws) await init_ws();
        if (!this.ws) return;

        let cmd = `smd+${conid}+{ "fields": [ "31", "84", "85", "86", "88", "TimestampBase", "TimestampDelta" ] }`;

        this.ws.send(cmd);

    }


}
