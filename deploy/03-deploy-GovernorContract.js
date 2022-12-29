const { VOTING_DELAY, VOTING_PERIOD, QUORUM_PERCENTAGE, devNetworks } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")



module.exports = async({ getNamedAccounts, deployments }) => {

    const { deploy, log } = deployments

    const { deployer } = await getNamedAccounts()


    const governanceToken = await ethers.getContract("GovernanceToken")

    const timeLock = await ethers.getContract("TimeLock")

    

    const governorContract = await deploy("GovernorContract", {

        from: deployer,

        args: [governanceToken.address, timeLock.address, VOTING_DELAY, VOTING_PERIOD, QUORUM_PERCENTAGE],

        log: true,

        waitConfirmations: network.config.blockConfirmations || 1
    })


    log("GovernorContract Deployed!")

    log("---------------------------------------------")



    if(!devNetworks.includes(network.name) && process.env.ETHERSCAN_API_KEY) {

        await verify(governorContract.address, [governanceToken.address, timeLock.address, VOTING_DELAY, VOTING_PERIOD, QUORUM_PERCENTAGE])
    }
}



module.exports.tags = ["all", "governanceContract"]