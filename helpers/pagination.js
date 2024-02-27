
const pagination = (data, params) => {
        data.page = +(params.page || 1);
        data.limit = +(params.limit || 5);
        data.totalPage = Math.ceil(data.count / data.limit);
        data.data = data.rows;
        delete data.rows;
        return data;
    }

module.exports = pagination