const { ethers, network } = require("hardhat")
const { NEW_STORE_VALUE, FUNCTION, PROPOSAL_DESCRIPTION, devNetworks, VOTING_DELAY, proposalsFile } = require("../helper-hardhat-config")
const { moveBlocks } = require("../utils/move-blocks")
const fs = require("fs")



const propose = async([args], functionToCall, proposalDescription) => {

    const governorContract = await ethers.getContract("GovernorContract")

    const box = await ethers.getContract("Box")

    const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, [args])




    console.log("Proposing...")
    
    console.log(`Proposing to Store New Value '${args}' in the ${functionToCall}() in Contract '${box.address}'`)

    console.log(`Proposal Description : ${proposalDescription}`)

    const proposeTx = await governorContract.propose([box.address], [0], [encodedFunctionCall], proposalDescription)



    // After creating a proposal people can't vote on it until the "VOTING_DELAY" passes!

    // If working on a development network i.e "localhost", We can move the blocks --> to the block when the "VOTING_DELAY" ended and voting starts!



    if(devNetworks.includes(network.name)) {

        await moveBlocks(VOTING_DELAY + 1)
    }

    

    const proposalTxReceipt = await proposeTx.wait(1)

    const proposalId = proposalTxReceipt.events[0].args.proposalId

    console.log(`Proposal ID : ${proposalId}`)



    // Saving the "Proposal ID" in the "proposals.json" file.

    storeProposalId(proposalId)



    const proposalState = await governorContract.state(proposalId)
    

    // 0 = Pending | 1 = Active | 2 = Cancelled | 3 = Defeated | 4 = Succeeded | 5 = Queued | 6 = Expired | 7 = Executed


    if(proposalState == 1) {

        console.log("Proposed Successfully!")
        
        console.log("Proposal State : Active")

    } else {

        console.log("Proposing Failed!")
    }



    const proposalSnapshot = await governorContract.proposalSnapshot(proposalId)

    console.log(`Proposal Snapshot : ${proposalSnapshot}`)  // At which block number the Snapshot was taken.



    const proposalDeadline = await governorContract.proposalDeadline(proposalId)

    console.log(`Proposal Deadline : ${proposalDeadline}`)  // At which block number the voting period of the proposal will expire.
}



const storeProposalId = (proposalId) => {

    const chainId = network.config.chainId


    let proposals


    if(fs.existsSync(proposalsFile)) {

        proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
    }


    proposals[chainId].push(proposalId.toString())


    fs.writeFileSync(proposalsFile, JSON.stringify(proposals))
}



propose([NEW_STORE_VALUE], FUNCTION, PROPOSAL_DESCRIPTION)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })