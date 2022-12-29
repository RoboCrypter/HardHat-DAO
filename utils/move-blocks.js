const { network } = require("hardhat")



const moveBlocks = async(amount) => {

    for(let index = 0; index < amount; index++) {

        await network.provider.request({ method: "evm_mine", prams: [] })
    }
}



module.exports = { moveBlocks }