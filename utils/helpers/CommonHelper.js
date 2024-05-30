'user strict';

class CommonHelper {

    assetBaseUrl()
    {
        return process.env.AZURE_BASE_URL + process.env.AZURE_CONTAINER;
    }
}

module.exports = new CommonHelper();