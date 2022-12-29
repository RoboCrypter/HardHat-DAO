const { MINIMUM_DELAY, devNetworks } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")



module.exports = async({ getNamedAccounts, deployments }) => {

    const { deploy, log } = deployments

    const { deployer } = await getNamedAccounts()


    const timeLock = await deploy("TimeLock", {

        from: deployer,

        args: [MINIMUM_DELAY, [], [], deployer],

        log: true,

        waitConfirmations: network.config.blockConfirmations || 1
    })


    log("TimeLock Deployed!")

    log("---------------------------------------------")



    if(!devNetworks.includes(network.name) && process.env.ETHERSCAN_API_KEY) {

        await verify(timeLock.address, [MINIMUM_DELAY, [], [], deployer])
    }
}



module.exports.tags = ["all", "timeLock"]