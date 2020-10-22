import axios from "axios";

export default class FileUploadService {
    endpoint: string;
    endpointAppKey: string;
    constructor() {
        this.endpoint = process.env.FILEUPLOAD_API_URL + "/api/files/permanent";
        this.endpointAppKey = process.env.FILEUPLOAD_API_URL + "/api/files/permanent-app-key";
    }
    async makeFilePermanent(user, sourceFilename, destinationFilename) {
        const payload = {
            sourceFilename,
            destinationFilename
        }
        const url = user ? this.endpoint : this.endpointAppKey;
        const authorization = user.token ? user.token : process.env.FILEUPLOAD_API_APP_KEY;
        let response;
        try {
            response = await axios.post(url, payload, {
                headers: {
                    authorization
                }
            })
        } catch (err) {
            // console.log('err:', err)
            throw err
        }
        return response.data;
    }
}
