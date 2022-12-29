const { ethers, network } = require("hardhat")
const { FUNCTION, NEW_STORE_VALUE, PROPOSAL_DESCRIPTION, proposalsFile } = require("../helper-hardhat-config")
const fs = require("fs")



const execute = async() => {

    const box = await ethers.getContract("Box")

    const encodedFunctionCall = box.interface.encodeFunctionData(FUNCTION, [NEW_STORE_VALUE])

    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION))

    const governorContract = await ethers.getContract("GovernorContract")



    const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))

    const chainId = network.config.chainId

    const proposalId = proposals[chainId].at(-1)

    


    console.log("Executing...")

    const executeTx = await governorContract.execute([box.address], [0], [encodedFunctionCall], descriptionHash)

    await executeTx.wait(1)



    const proposalState = await governorContract.state(proposalId)


    // 0 = Pending | 1 = Active | 2 = Cancelled | 3 = Defeated | 4 = Succeeded | 5 = Queued | 6 = Expired | 7 = Executed


    if(proposalState == 7) {

        console.log("Executed Successfully!")

        console.log("Proposal State : Executed")

    } else {

        console.log("Executing Failed!")
    }



    const checkingBoxContractNewValue = await box.retrieve()

    console.log(`New Value : ${checkingBoxContractNewValue}`)
}



execute()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })