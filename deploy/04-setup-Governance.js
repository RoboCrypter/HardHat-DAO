const { ethers } = require("hardhat")
const { ADDRESS_ZERO } = require("../helper-hardhat-config")



module.exports = async({ getNamedAccounts, deployments }) => {

    const { log } = deployments

    const { deployer } = await getNamedAccounts()


    const timeLock = await ethers.getContract("TimeLock", deployer)

    const governorContract = await ethers.getContract("GovernorContract", deployer)

    
    log("Granting Roles...")


    const proposerRole = await timeLock.PROPOSER_ROLE()

    const executorRole = await timeLock.EXECUTOR_ROLE()

    const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE()

    

    log("Granting Proposer Role...")

    const grantingProposerRoleTx = await timeLock.grantRole(proposerRole, governorContract.address)

    await grantingProposerRoleTx.wait(1)

    log("Proposer Role has been Granted!")



    log("Granting Executer Role...")

    const grantingExecutorRoleTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO)

    await grantingExecutorRoleTx.wait(1)

    log("Executer Role has been Granted!")



    log("Revoking Admin Role...")

    const revokingAdminRoleTx = await timeLock.revokeRole(adminRole, deployer)

    await revokingAdminRoleTx.wait(1)

    log("Admin Role has been Revoked!")

    // Guess What? Now, Anything that the "TimeLock" wants to do has to go through governance process!


    log("Roles have been Granted!")
}



module.exports.tags = ["all", "setupGovernance"]