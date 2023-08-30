

class opt_client {


    constructor(
        host = "localhost",
        port = 5000
    ) {

        this.base_client = new base_client(host, port);

    }


    async get_defs_ind(ul_sym, exp, lo_str, hi_str, right) {

        exp             = String(exp);
        let exp_month   = exp.slice(0, -2);
        let ids         = [];
        let res         = await this.base_client.search(ul_sym, true, "IND");

        if (!res)

            ids = null;
            
        else {
            
            const ul_conid  = res[0].conid;
            res             = await this.base_client.secdef_info(ul_conid, "OPT", exp_month, "SMART", "0", right);

            if (!res)

                ids = null;
            
            else {

                for (let i = 0; i < res.length; i++) {

                    let opt_def = res[i];

                    if (
                            opt_def.maturityDate == exp &&
                            opt_def.strike >= lo_str    && 
                            opt_def.strike <= hi_str
                        )

                        ids.push(
                            {
                                "conid":    opt_def.conid,
                                "strike":   opt_def.strike,
                                "right":    opt_def.right,
                                "class":    opt_def.tradingClass
                            }
                        );

                }

                ids.sort((a, b) => a.strike - b.strike);

            }
        
        }

        return ids;

    }


    async get_defs_stock(ul_sym, exp, lo_str, hi_str, right) {



    }


    async get_defs_fut(ul_sym, ul_month, exp, lo_str, hi_str, right) {



    }


    async set_handlers(msg_handler, err_handler, opn_handler, cls_handler) {

        this.base_client.set_ws_handlers(
            msg_handler = handler,
            err_handler = err_handler,
            opn_handler = opn_handler,
            cls_handler = cls_handler
        );

    }


    async sub_l1(conids) {



    }


    async unsub_l1(conids) {



    }


}