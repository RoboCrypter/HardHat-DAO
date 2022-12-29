const { ethers, network } = require("hardhat")
const fs = require("fs")
const { proposalsFile, reason, devNetworks, VOTING_PERIOD } = require("../helper-hardhat-config")
const { moveBlocks } = require("../utils/move-blocks")



const vote = async() => {

    const governorContract = await ethers.getContract("GovernorContract")


    const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))

    const chainId = network.config.chainId

    const proposalId = proposals[chainId].at(-1)


    const support = 1      // 0 = Against (Down Voted) | 1 = Agree (Up Voted) | 2 = Abstain (Decline to Vote)




    console.log("Voting...")

    const voteTx = await governorContract.castVoteWithReason(proposalId, support, reason)

    const voteTxReceipt = await voteTx.wait(1)

    const voteReason = voteTxReceipt.events[0].args.reason

    console.log(`Vote Reason : ${voteReason}`)



    // After casting a vote we have to wait for the "VOTING_PERIOD" to end in order to see the result!

    // If working on a development network i.e "localhost", We can move the blocks --> to the block when the "VOTING_PERIOD" expires!



    if(devNetworks.includes(network.name)) {

        await moveBlocks(VOTING_PERIOD + 1)
    }



    const proposalState = await governorContract.state(proposalId)


    // 0 = Pending | 1 = Active | 2 = Cancelled | 3 = Defeated | 4 = Succeeded | 5 = Queued | 6 = Expired | 7 = Executed


    if(proposalState == 4) {

        console.log("Voted Successfully!")

        console.log("Proposal State : Succeeded")

    } else {

        console.log("Voting Failed!")
    }
}



vote()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })