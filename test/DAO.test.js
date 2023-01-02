const { devNetworks, NEW_STORE_VALUE, FUNCTION, PROPOSAL_DESCRIPTION, VOTING_DELAY, reason, VOTING_PERIOD, MINIMUM_DELAY } = require("../helper-hardhat-config")
const { network, ethers, deployments } = require("hardhat")
const { expect } = require("chai")
const { moveBlocks } = require("../utils/move-blocks")
const { moveTime } = require("../utils/move-time")



!devNetworks.includes(network.name) ? describe.skip

: describe("Testing DAO", () => {

    let governorContract, box

    beforeEach("Deploying Contracts...", async() => {

        await deployments.fixture(["all"])

        governorContract = await ethers.getContract("GovernorContract")

        box = await ethers.getContract("Box")
    })

    describe("storeValue", () => {

        it("Cannot store the value without governance", async() => {

            await expect(box.storeValue(NEW_STORE_VALUE)).to.be.revertedWith("Ownable: caller is not the owner")
        })

        it("Value can only be stored through governance", async() => {

            // Proposing

            const encodedFunctionCall = box.interface.encodeFunctionData(FUNCTION, [NEW_STORE_VALUE])

            const proposeTx = await governorContract.propose([box.address], [0], [encodedFunctionCall], PROPOSAL_DESCRIPTION)

            const proposalTxReceipt = await proposeTx.wait(1)

            await moveBlocks(VOTING_DELAY + 1)

            // Voting

            const proposalId = proposalTxReceipt.events[0].args.proposalId

            const support = 1   // 0 = Against (Down Voted) | 1 = Agree (Up Voted) | 2 = Abstain (Decline to Vote)

            const voteTx = await governorContract.castVoteWithReason(proposalId, support, reason)

            await voteTx.wait(1)

            await moveBlocks(VOTING_PERIOD + 1)

            // Queueing

            const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION))

            const queueTx = await governorContract.queue([box.address], [0], [encodedFunctionCall], descriptionHash)

            await queueTx.wait(1)

            await moveTime(MINIMUM_DELAY + 1)

            await moveBlocks(1)

            // Executing

            const executeTx = await governorContract.execute([box.address], [0], [encodedFunctionCall], descriptionHash)

            await executeTx.wait(1)

            // Checking the Newly stored value in the Box Contract through governance!

            const checkingBoxNewStoreValue = await box.retrieve()

            expect(checkingBoxNewStoreValue).to.equal(NEW_STORE_VALUE)
        })

        it("It shouldn't queue, If the proposal isn't successful", async() => {

            // Proposing

            const encodedFunctionCall = box.interface.encodeFunctionData(FUNCTION, [NEW_STORE_VALUE])

            const proposeTx = await governorContract.propose([box.address], [0], [encodedFunctionCall], PROPOSAL_DESCRIPTION)

            const proposalTxReceipt = await proposeTx.wait(1)

            await moveBlocks(VOTING_DELAY + 1)

            // Voting

            const proposalId = proposalTxReceipt.events[0].args.proposalId

            const support = 0   // 0 = Against (Down Voted) | 1 = Agree (Up Voted) | 2 = Abstain (Decline to Vote)

            const voteTx = await governorContract.castVoteWithReason(proposalId, support, reason)

            await voteTx.wait(1)

            await moveBlocks(VOTING_PERIOD + 1)

            const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION))


            await expect(governorContract.queue([box.address], [0], [encodedFunctionCall], descriptionHash)).to.be.revertedWith("Governor: proposal not successful")

            expect(await box.retrieve()).to.equal(0)
        })
    })
})