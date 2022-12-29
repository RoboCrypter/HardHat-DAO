const { ethers, network } = require("hardhat")
const { FUNCTION, NEW_STORE_VALUE, PROPOSAL_DESCRIPTION, devNetworks, MINIMUM_DELAY, proposalsFile } = require("../helper-hardhat-config")
const { moveTime } = require("../utils/move-time")
const { moveBlocks } = require("../utils/move-blocks")
const fs = require("fs")



const queue = async() => {

    const box = await ethers.getContract("Box")

    const encodedFunctionCall = box.interface.encodeFunctionData(FUNCTION, [NEW_STORE_VALUE])

    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION))

    const governorContract = await ethers.getContract("GovernorContract")




    console.log("Queueing...")

    const queueTx = await governorContract.queue([box.address], [0], [encodedFunctionCall], descriptionHash)

    await queueTx.wait(1)



    // After queueing the proposal we still have to wait "MINIMUM_DELAY" in order to execute it!

    // If working on a development network i.e "localhost", We can move the time --> to get past the "MINIMUM_DELAY" and also moving a block to be sure!



    if(devNetworks.includes(network.name)) {

        await moveTime(MINIMUM_DELAY + 1)

        await moveBlocks(1)
    }



    const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))

    const chainId = network.config.chainId

    const proposalId = proposals[chainId].at(-1)

    const proposalState = await governorContract.state(proposalId)


    // 0 = Pending | 1 = Active | 2 = Cancelled | 3 = Defeated | 4 = Succeeded | 5 = Queued | 6 = Expired | 7 = Executed


    if(proposalState == 5) {

        console.log("Queued Successfully!")

        console.log("Proposal State : Queued")

    } else {

        console.log("Queueing Failed!")
    }
}



queue()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })