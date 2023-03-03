const cds = require('@sap/cds')
module.exports = cds.service.impl(function () {
    const { Products } = this.entities()

    this.after('each', Products, row => {
        console.log(`Read Product: ${row.ID}`)
    })

    this.after(['CREATE', 'UPDATE', 'DELETE'], [Products], async (Product, req) => {
        const header = req.data
        req.on('succeeded', () => {
            global.it || console.log(`< emitting: product_Changed ${Product.ID}`)
            this.emit('prod_Change', header)
        })
    })

    /**
     * Custom error handler
     *
     * throw a new error with: throw new Error('something bad happened');
     *
     **/
    this.on("error", (err, req) => {
        switch (err.message) {
          case "ENTITY_ALREADY_EXISTS":
            err.message = `An error occurred. Please retry. Error code: ENTITY_ALREADY_EXISTS. Error description: The entry already exists.`;
            break;
          default:
            if (!err.message.includes("Technical explanation of error")) {
              err.message = `An error occurred. Please retry. Technical explanation of error: ${err.message}`;
            }
            break;
        }
      });
      
      
})