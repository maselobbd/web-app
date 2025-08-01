const getRedirectUrl = (currentUrl) => {
    if(currentUrl.includes("ukukhula")) {
        return process.env.ukukhulaRedirectUrl;
    } else if(currentUrl.includes("bursary")) {
        return process.env.bursaryRedirectUrl;
    } else if(currentUrl.includes("bbdbursaries")) {
        return process.env.adminRedirectUrl;
    }
    return process.env.redirectUrl;
}

module.exports = { getRedirectUrl }