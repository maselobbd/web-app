function formatAmountToFloat(amount) {
    return parseFloat((amount.replace(/\s/g, "").replace(",", "."))) || 0
  }
module.exports = {formatAmountToFloat}