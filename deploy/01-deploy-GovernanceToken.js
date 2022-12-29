const { MAX_SUPPLY, devNetworks } = require("../helper-hardhat-config")
const { network, ethers } = require("hardhat")
const { verify } = require("../utils/verify")



module.exports = async({ getNamedAccounts, deployments }) => {

    const { deploy, log } = deployments

    const { deployer } = await getNamedAccounts()


    const governanceToken = await deploy("GovernanceToken", {

        from: deployer,

        args: [MAX_SUPPLY],

        log: true,

        waitConfirmations: network.config.blockConfirmations || 1
    })


    log("GovernanceToken Deployed!")

    log("---------------------------------------------")



    if(!devNetworks.includes(network.name) && process.env.ETHERSCAN_API_KEY) {

        await verify(governanceToken.address, [MAX_SUPPLY])
    }



    await delegate(governanceToken.address, deployer)

    log("Delegated!")
}



const delegate = async(governanceTokenAddress, delegatedAccount) => {
    
    const accounts = await ethers.getSigners()

    const deployer = accounts[0]

    const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress, deployer)

    const delegateTx = await governanceToken.delegate(delegatedAccount)

    await delegateTx.wait(1)

    console.log(`Checkpoints : ${await governanceToken.numCheckpoints(delegatedAccount)}`)
}



module.exports.tags = ["all", "governanceToken"]