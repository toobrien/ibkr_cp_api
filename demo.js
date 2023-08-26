
async function init() {

    let client = new ibkr_cp_client();

    console.log("hello, world");

    let res = await client.secdef([ "416904" ]);

    console.log(JSON.stringify(res, null, 2));
    
}

init();