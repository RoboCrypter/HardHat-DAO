const devNetworks = ["hardhat", "localhost"]

const MAX_SUPPLY = "10000000000000000000000"

const MINIMUM_DELAY = 3600

const VOTING_DELAY = 1

const VOTING_PERIOD = 5

const QUORUM_PERCENTAGE = 4

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"

const FUNCTION = "storeValue"

const NEW_STORE_VALUE = 100

const PROPOSAL_DESCRIPTION = "Proposal # 1 --> Store '100' in storeValue() in the Box Contract."

const proposalsFile = "proposals.json"

const reason = "Do you really wanna know!"



module.exports = {
    devNetworks,
    MAX_SUPPLY,
    MINIMUM_DELAY,
    VOTING_DELAY,
    VOTING_PERIOD,
    QUORUM_PERCENTAGE,
    ADDRESS_ZERO,
    FUNCTION,
    NEW_STORE_VALUE,
    PROPOSAL_DESCRIPTION,
    proposalsFile,
    reason
}