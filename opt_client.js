

class opt_client {


    constructor(
        host = "localhost",
        port = 5000
    ) {

        this.base_client = new base_client(host, port);

    }


    async get_conids_ind(ul_sym, exp, lo_str, hi_str, step, right) {



    }


    async get_conids_stock(ul_sym, exp, lo_str, hi_str, step, right) {



    }


    async get_conids_fut(ul_sym, ul_month, exp, lo_str, hi_str, step, right) {



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