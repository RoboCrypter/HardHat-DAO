const { network, ethers } = require("hardhat")
const { devNetworks } = require("../helper-hardhat-config")



module.exports = async({ getNamedAccounts, deployments }) => {

    const { deploy, log } = deployments

    const { deployer } = await getNamedAccounts()


    const box = await deploy("Box", {

        from: deployer,

        args: [],

        log: true,

        waitConfirmations: network.config.blockConfirmations || 1
    })


    log("Box Deployed!")

    log("---------------------------------------------")



    if(!devNetworks.includes(network.name) && process.env.ETHERSCAN_API_KEY) {

        await verify(box.address, [])
    }



    log("Transfering Box Contract Ownership to TimeLock Contract...")


    const timeLock = await ethers.getContract("TimeLock")

    const boxContract = await ethers.getContract("Box")


    const transferOwnershipTx = await boxContract.transferOwnership(timeLock.address)

    await transferOwnershipTx.wait(1)

    
    log("Box Contract Ownership has been Successfully Transfered to TimeLock Contract!")
}



module.exports.tags = ["all", "box"]