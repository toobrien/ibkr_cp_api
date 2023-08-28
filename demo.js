

async function demo() {

    let client  = new ibkr_cp_client();
    let res     = null;

    res = await client.secdef([ "416904" ]);

    console.log(JSON.stringify(res, null, 2));

    res = await client.search("SPX", true, "IND");

    console.log(JSON.stringify(res, null, 2));

    res = await client.secdef_info("416904", "OPT", "202308", null, 4405, "C");

    console.log(JSON.stringify(res, null, 2));

    res = await client.strikes("416904", "OPT", "202308");

    console.log(JSON.stringify(res, null, 2));

    await client.init_ws();
    await client.sub_market_data(497222760);

}

demo();